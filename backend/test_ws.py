import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8000/ws/transcription/"
    async with websockets.connect(uri) as websocket:
        # Open the WAV file in binary mode and read its contents into bytes.
        with open("example.wav", "rb") as wav_file:
            file_bytes = wav_file.read()
        
        # Send the file bytes over the WebSocket.
        await websocket.send(file_bytes)

        # Wait for a response from the server.
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(test_ws())
