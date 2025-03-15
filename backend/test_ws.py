import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8000/ws/transcription/"

    # Read an actual WAV file
    with open("New Recording 6.m4a", "rb") as f:
        audio_data = f.read()

    async with websockets.connect(uri) as websocket:
        print("Sending audio file...")
        await websocket.send(audio_data)  # Send valid WAV audio

        # Wait for a response from the server.
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(test_ws())
