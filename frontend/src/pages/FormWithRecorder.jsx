// src/pages/FormWithRecorder.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// Helper to get a cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function FormWithRecorder() {
  const { formId } = useParams();
  const [formStructure, setFormStructure] = useState(null);
  const [error, setError] = useState(null);
  const [realtimeAttributes, setRealtimeAttributes] = useState({}); // flat mapping: field name -> value
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Load form structure from your API (ensure it returns JSON with form_name and blocks)
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/forms/${formId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${getCookie("auth_token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch form details");
        const data = await response.json();
        setFormStructure(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchForm();
  }, [formId]);

  // Set up the WebSocket connection for realtime transcription updates.
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/transcription/${formId}/`);
    socket.binaryType = "arraybuffer";
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket data received:", data);
        
        // if (data.corrected_audio) {
        //   // Append new transcript text
        //   setTranscription(prev => prev + " " + data.corrected_audio);
        // }
        
        if (data.attributes) {
          // Merge new attributes into existing ones
          setRealtimeAttributes(prev => ({ ...prev, ...data.attributes }));
        }
        
        // Handle final results
        if (data.final_results) {
          console.log("Received final verified results:", data.attributes);
          setRealtimeAttributes(data.attributes);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };
    socket.onclose = () => {
      console.log("WebSocket closed");
    };
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    wsRef.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  // Start recording: get audio stream and begin sending chunks via WebSocket.
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const arrayBuffer = await event.data.arrayBuffer();
          wsRef.current.send(arrayBuffer);
          console.log(`Sent ${arrayBuffer.byteLength} bytes`);
        }
      };
      recorder.start(1000); // send chunks every second
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      
      // Send stop_recording action to trigger final sweep
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: 'stop_recording' }));
        console.log("Sent stop_recording action");
      }
      setIsRecording(false);
    }
  };
  
  // Merge realtime attributes into the form structure.
  // Assumes formStructure has a property "blocks" which is an array; each block has "fields" (array).
  const getFilledFormStructure = () => {
    if (!formStructure || !formStructure.blocks) return null;
    const updatedBlocks = formStructure.blocks.map(block => {
      const updatedFields = block.fields.map(field => {
        // Check if there's a realtime update for this field (case-insensitive match)
        const key = Object.keys(realtimeAttributes).find(
          k => k.toLowerCase() === field.field_name.toLowerCase()
        );
        return {
          ...field,
          value: key ? realtimeAttributes[key] : field.value || ""
        };
      });
      return { ...block, fields: updatedFields };
    });
    return { ...formStructure, blocks: updatedBlocks };
  };

  const filledForm = getFilledFormStructure();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {!formStructure ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{formStructure.form_name}</h1>
            <p className="text-gray-500 mt-2">Fill this form using voice recording</p>
          </header>
          
          <div className="mb-8">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center transition-colors duration-200 animate-pulse"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Recording
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Form Details
            </h2>
            {filledForm && filledForm.blocks && filledForm.blocks.length > 0 ? (
              filledForm.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100 text-gray-700">
                    {block.block_name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {block.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.field_name}:
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          defaultValue={field.value}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No form fields found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FormWithRecorder;