import React, { useState, useEffect, useRef } from "react";

function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [attributes, setAttributes] = useState({});
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const wsRef = useRef(null);
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);

    // Initialize the WebSocket connection when component mounts
    useEffect(() => {
        initWebSocket();

        // Clean up on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Initialize the WebSocket connection
    const initWebSocket = () => {
        // Only create a new connection if one doesn't exist or is closed.
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        const socket = new WebSocket("ws://localhost:8000/ws/transcription/");
        socket.binaryType = "arraybuffer";

        socket.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Received data:", data);
                if (data.corrected_audio) {
                    setTranscription(data.corrected_audio);
                }
                if (data.attributes) {
                    setAttributes(data.attributes);
                }
            } catch (error) {
                console.error("Error parsing message", error);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket closed");
            setIsConnected(false);
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            setError("Failed to connect to transcription server");
            setIsConnected(false);
        };

        wsRef.current = socket;
    };

    // Toggle recording state
    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    // Start recording audio using the MediaRecorder API (WebM format)
    const startRecording = async () => {
        try {
            // Ensure the WebSocket connection is open before starting.
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
                initWebSocket();
            }

            // Initialize audio context (kept here for potential processing)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext({
                sampleRate: 16000 // Match Whisper's expected sample rate
            });

            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1, // Mono channel
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            streamRef.current = stream;

            // Create recorder with WebM format options.
            const options = {
                mimeType: 'audio/webm',
                audioBitsPerSecond: 16000
            };

            const recorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = recorder;

            // When audio data is available, send it via WebSocket.
            recorder.ondataavailable = async (event) => {
                if (
                    event.data &&
                    event.data.size > 0 &&
                    wsRef.current &&
                    wsRef.current.readyState === WebSocket.OPEN
                ) {
                    const arrayBuffer = await event.data.arrayBuffer();
                    wsRef.current.send(arrayBuffer);
                    console.log(`Sent ${arrayBuffer.byteLength} bytes of audio data`);
                }
            };

            // Start recording with a timeslice (1000ms in this example).
            recorder.start(1000);
            setIsRecording(true);
            setError(null);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setError(`Failed to access microphone: ${error.message}`);
        }
    };

    // Stop the recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            // const closingPacket = new Uint8Array([0]);
            // wsRef.current.send(closingPacket)
            // setIsRecording(false);
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop and clean up the media stream.
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Close the WebSocket connection.
            if (wsRef.current) {
                wsRef.current.close();
            }
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Audio Transcription</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex space-x-2 mb-6">
                <button
                    onClick={toggleRecording}
                    className={`px-4 py-2 rounded font-bold ${isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>

                <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected
                        ? "bg-green-500"
                        : "bg-gray-400"}`}
                    ></span>
                    <span className="text-sm">
                        {isConnected ? "Connected" : "Disconnected"}
                    </span>
                </div>
            </div>

            {isRecording && (
                <div className="flex items-center mb-4">
                    <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    <span>Recording in progress...</span>
                </div>
            )}

            <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="text-xl font-semibold mb-2">Transcription:</h3>
                <p className="whitespace-pre-wrap">{transcription || "No transcription yet"}</p>
            </div>

            {Object.keys(attributes).length > 0 && (
                <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-2">Extracted Attributes:</h3>
                    <ul className="list-disc pl-5">
                        {Object.entries(attributes).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AudioRecorder;