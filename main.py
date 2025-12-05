"""
FastAPI server with TCP receiver for OpenVIBE signals
Receives TCP signals from OpenVIBE and exposes them via REST API
"""

import asyncio
import logging
import socket
import threading
import time
from collections import deque
from datetime import datetime
from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('openvibe_receiver.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="OpenVIBE TCP Receiver API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
class SignalData(BaseModel):
    signal: str
    timestamp: str
    raw_data: Optional[str] = None

class ConnectionState(BaseModel):
    connected: bool
    last_signal: Optional[str] = None
    last_timestamp: Optional[str] = None
    total_signals: int

# Shared state
tcp_state = {
    "connected": False,
    "last_signal": None,
    "last_timestamp": None,
    "total_signals": 0,
    "signal_history": deque(maxlen=100),  # Keep last 100 signals
    "client_address": None
}

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # Connection is now handled in the endpoint directly
        pass

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast_signal(self, signal: str, timestamp: str):
        """Broadcast signal to all connected WebSocket clients"""
        if not self.active_connections:
            logger.warning("No WebSocket connections available for broadcast")
            return
        
        message = {
            "signal": signal,
            "timestamp": timestamp,
            "type": "signal"
        }
        
        logger.info(f"Broadcasting to {len(self.active_connections)} WebSocket clients: {message}")
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
                logger.debug(f"Signal sent successfully to WebSocket client")
            except Exception as e:
                logger.error(f"Error sending to WebSocket: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# Store the main event loop for broadcasting from TCP thread
main_event_loop = None

# TCP Server configuration
TCP_HOST = "0.0.0.0"
TCP_PORT = 5678  # Port for OpenVIBE connection
BUFFER_SIZE = 1024

def parse_signal(data: bytes) -> str:
    """Parse incoming TCP data and extract signal type"""
    try:
        message = data.decode('utf-8').strip().lower()
        logger.info(f"Received raw data: {message}")
        
        # Parse different signal formats
        if 'izquierda' in message or 'left' in message or message == 'i':
            return "izquierda"
        elif 'derecha' in message or 'right' in message or message == 'd':
            return "derecha"
        else:
            # Try to parse as JSON or other formats
            return message
    except Exception as e:
        logger.error(f"Error parsing signal: {e}")
        return data.decode('utf-8', errors='ignore')

def handle_tcp_client(client_socket: socket.socket, address: tuple):
    """Handle individual TCP client connection"""
    logger.info(f"New TCP connection from {address}")
    tcp_state["connected"] = True
    tcp_state["client_address"] = f"{address[0]}:{address[1]}"
    
    try:
        while True:
            data = client_socket.recv(BUFFER_SIZE)
            if not data:
                logger.warning(f"Client {address} disconnected (no data)")
                break
            
            signal = parse_signal(data)
            timestamp = datetime.now().isoformat()
            
            # Update state
            tcp_state["last_signal"] = signal
            tcp_state["last_timestamp"] = timestamp
            tcp_state["total_signals"] += 1
            tcp_state["signal_history"].append({
                "signal": signal,
                "timestamp": timestamp,
                "raw_data": data.decode('utf-8', errors='ignore')
            })
            
            logger.info(f"Signal received: {signal} at {timestamp} from {address}")
            
            # Broadcast signal to WebSocket clients
            if main_event_loop and main_event_loop.is_running():
                try:
                    future = asyncio.run_coroutine_threadsafe(
                        manager.broadcast_signal(signal, timestamp),
                        main_event_loop
                    )
                    logger.info(f"Broadcasting signal '{signal}' to {len(manager.active_connections)} WebSocket clients")
                except Exception as e:
                    logger.error(f"Error broadcasting signal: {e}")
            else:
                logger.warning(f"Main event loop not available. Loop: {main_event_loop}, Running: {main_event_loop.is_running() if main_event_loop else 'N/A'}")
            
            # Send acknowledgment
            ack = f"ACK: {signal}\n"
            client_socket.send(ack.encode('utf-8'))
            
    except ConnectionResetError:
        logger.warning(f"Connection reset by client {address}")
    except Exception as e:
        logger.error(f"Error handling client {address}: {e}")
    finally:
        logger.info(f"Closing connection with {address}")
        tcp_state["connected"] = False
        tcp_state["client_address"] = None
        client_socket.close()

def start_tcp_server():
    """Start TCP server in a separate thread"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        server_socket.bind((TCP_HOST, TCP_PORT))
        server_socket.listen(5)
        logger.info(f"TCP server listening on {TCP_HOST}:{TCP_PORT}")
        
        while True:
            client_socket, address = server_socket.accept()
            logger.info(f"Accepted connection from {address}")
            
            # Handle each client in a separate thread
            client_thread = threading.Thread(
                target=handle_tcp_client,
                args=(client_socket, address),
                daemon=True
            )
            client_thread.start()
            
    except Exception as e:
        logger.error(f"TCP server error: {e}")
    finally:
        server_socket.close()

@app.on_event("startup")
async def startup_event():
    """Start TCP server on startup"""
    global main_event_loop
    try:
        main_event_loop = asyncio.get_running_loop()
    except RuntimeError:
        main_event_loop = asyncio.get_event_loop()
    logger.info(f"Starting FastAPI server and TCP receiver... Event loop: {main_event_loop}")
    logger.info(f"Event loop is running: {main_event_loop.is_running()}")
    tcp_thread = threading.Thread(target=start_tcp_server, daemon=True)
    tcp_thread.start()
    # Give TCP server a moment to start
    time.sleep(0.5)
    logger.info("TCP server thread started and ready to accept connections")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OpenVIBE TCP Receiver API",
        "tcp_port": TCP_PORT,
        "status": "running"
    }

@app.get("/status", response_model=ConnectionState)
async def get_status():
    """Get current connection status and last signal"""
    return ConnectionState(
        connected=tcp_state["connected"],
        last_signal=tcp_state["last_signal"],
        last_timestamp=tcp_state["last_timestamp"],
        total_signals=tcp_state["total_signals"]
    )

@app.get("/last-signal", response_model=SignalData)
async def get_last_signal():
    """Get the last received signal"""
    if not tcp_state["last_signal"]:
        raise HTTPException(status_code=404, detail="No signals received yet")
    
    return SignalData(
        signal=tcp_state["last_signal"],
        timestamp=tcp_state["last_timestamp"],
        raw_data=None
    )

@app.get("/history")
async def get_history(limit: int = 10):
    """Get signal history"""
    history = list(tcp_state["signal_history"])
    return {
        "count": len(history),
        "signals": history[-limit:] if limit > 0 else history
    }

@app.post("/verify-connection")
async def verify_connection():
    """Verify TCP connection status (for frontend)"""
    is_connected = tcp_state["connected"]
    logger.info(f"Connection verification requested: {is_connected}")
    
    return {
        "connected": is_connected,
        "client_address": tcp_state["client_address"],
        "total_signals": tcp_state["total_signals"]
    }

@app.websocket("/ws/signals")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time signal streaming"""
    # Accept connection from any origin (for development)
    await websocket.accept()
    logger.info(f"WebSocket connection attempt from {websocket.client}")
    
    try:
        # Add to manager
        manager.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(manager.active_connections)}")
        
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connection",
            "message": "Connected to signal stream",
            "status": "connected"
        })
        logger.info("Sent initial connection message to WebSocket client")
        
        # Keep connection alive and handle disconnections
        while True:
            # Wait for client messages (ping/pong or close)
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                logger.debug(f"Received WebSocket message: {data}")
                # Handle ping messages
                if data == "ping":
                    await websocket.send_json({"type": "pong"})
            except asyncio.TimeoutError:
                # Send keepalive
                await websocket.send_json({"type": "keepalive"})
            except WebSocketDisconnect:
                logger.info("WebSocket client disconnected normally")
                break
            except Exception as e:
                logger.error(f"Error in WebSocket loop: {e}")
                break
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)
        logger.info(f"WebSocket cleanup complete. Remaining connections: {len(manager.active_connections)}")

if __name__ == "__main__":
    
    logger.info("Starting FastAPI server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

