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
        if (data.corrected_audio) {
          // Append new transcript text
          setTranscription(prev => prev + " " + data.corrected_audio);
        }
        if (data.attributes) {
          // Merge new attributes into existing ones
          setRealtimeAttributes(prev => ({ ...prev, ...data.attributes }));
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
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
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
    <div className="max-w-6xl mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      {!formStructure ? (
        <p>Loading form...</p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">{formStructure.form_name}</h1>
          <div className="mb-4">
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Start Recording
            </button>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Stop Recording
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Live Transcription:</h2>
            <p className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
              {transcription || "No transcription yet"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
            {filledForm && filledForm.blocks && filledForm.blocks.length > 0 ? (
              filledForm.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="mb-6">
                  <h3 className="text-lg font-bold mb-2">{block.block_name}</h3>
                  {block.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="mb-2">
                      <label className="block text-sm font-medium">{field.field_name}:</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        defaultValue={field.value}
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No form fields found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FormWithRecorder;
