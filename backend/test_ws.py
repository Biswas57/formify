import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8000/ws/transcription/"
    async with websockets.connect(uri) as websocket:
        # Send dummy binary data
        # For testing, ensure the amount of data is at least MIN_AUDIO_CHUNK_SIZE bytes.
        dummy_data = b'\x00' * 60000  # 60 KB of zero bytes
        await websocket.send(dummy_data)

        # Wait for a response
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(test_ws())
