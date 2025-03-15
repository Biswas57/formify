import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RecordPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setRecording(true);
    audioChunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = async () => {
    setRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", audioFile);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/forms/${formId}/upload_audio/`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload audio");
        }

        const data = await response.json();
        navigate(`/dashboard/form/${formId}/filled`, { state: { extractedFields: data.fields } });
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    };
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        className="w-24 h-24 bg-red-500 rounded-full text-white text-2xl"
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop" : "Rec"}
      </button>
    </div>
  );
}
