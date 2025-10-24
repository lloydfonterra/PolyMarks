"""
Add WebSocket support to FastAPI backend for real-time price updates
"""

with open('backend/main.py', 'r') as f:
    content = f.read()

# Add WebSocket imports
if 'from fastapi import WebSocket' not in content:
    old_imports = 'from fastapi import FastAPI, HTTPException'
    new_imports = 'from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect'
    content = content.replace(old_imports, new_imports)

# Add asyncio import if not present
if 'import asyncio' not in content:
    insert_pos = content.find('import logging')
    if insert_pos >= 0:
        end_of_line = content.find('\n', insert_pos)
        content = content[:end_of_line] + '\nimport asyncio' + content[end_of_line:]

# Add WebSocket manager class before the FastAPI app creation
app_creation = '''app = FastAPI(
    title="PolyMarks API",
    description="Smart Money Intelligence Platform for Polymarket",
    version="1.0.0"
)'''

websocket_manager = '''# WebSocket connection manager for real-time price updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            await self.disconnect(conn)

manager = ConnectionManager()

app = FastAPI(
    title="PolyMarks API",
    description="Smart Money Intelligence Platform for Polymarket",
    version="1.0.0"
)'''

content = content.replace(app_creation, websocket_manager)

# Add WebSocket endpoint after the health endpoint
health_endpoint = '''@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "operational"}'''

websocket_endpoint = '''

@app.websocket("/ws/prices")
async def websocket_prices(websocket: WebSocket):
    """WebSocket endpoint for real-time price streaming
    
    Broadcasts live market prices to connected clients
    """
    await manager.connect(websocket)
    try:
        while True:
            # Receive client message (can be used for filtering)
            data = await websocket.receive_text()
            logger.debug(f"WebSocket message: {data}")
            
            # For now, just acknowledge - prices will be pushed periodically
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected from price stream")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)'''

content = content.replace(health_endpoint, health_endpoint + websocket_endpoint)

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Added WebSocket support to main.py")
