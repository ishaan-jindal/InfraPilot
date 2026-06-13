"""
WebSocket-based live deployment log streaming.

Each deployment gets a LogBroadcaster that fans out log lines to all
connected WebSocket clients and also accumulates them for persistence.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# deployment_id → LogBroadcaster
_broadcasters: dict[str, "LogBroadcaster"] = {}


class LogBroadcaster:
    """Manages WebSocket connections and log buffer for a single deployment."""

    def __init__(self) -> None:
        self.connections: list[WebSocket] = []
        self.buffer: list[str] = []
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        async with self._lock:
            self.connections.append(ws)
            # Send buffered history
            if self.buffer:
                await ws.send_json({"type": "history", "lines": self.buffer})

    async def disconnect(self, ws: WebSocket) -> None:
        async with self._lock:
            if ws in self.connections:
                self.connections.remove(ws)

    async def broadcast(self, line: str) -> None:
        """Send a log line to all connected clients and buffer it."""
        async with self._lock:
            self.buffer.append(line)
            dead: list[WebSocket] = []
            for ws in self.connections:
                try:
                    await ws.send_json({"type": "log", "line": line})
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.connections.remove(ws)

    def get_full_log(self) -> str:
        """Return all buffered log lines as a single string."""
        return "\n".join(self.buffer)


def get_broadcaster(deployment_id: str) -> LogBroadcaster:
    """Get or create a LogBroadcaster for a deployment."""
    if deployment_id not in _broadcasters:
        _broadcasters[deployment_id] = LogBroadcaster()
    return _broadcasters[deployment_id]


def remove_broadcaster(deployment_id: str) -> None:
    """Clean up broadcaster when deployment is removed."""
    _broadcasters.pop(deployment_id, None)


def log_sync(deployment_id: str, line: str) -> None:
    """
    Synchronous log helper — used from background threads.
    Schedules the async broadcast on the running event loop.
    """
    broadcaster = get_broadcaster(deployment_id)
    broadcaster.buffer.append(line)
    try:
        loop = asyncio.get_running_loop()
        asyncio.run_coroutine_threadsafe(broadcaster.broadcast(line), loop)
    except RuntimeError:
        # No event loop running — just buffer it
        pass


@router.websocket("/ws/logs/{deployment_id}")
async def websocket_logs(websocket: WebSocket, deployment_id: str):
    """WebSocket endpoint for streaming deployment logs."""
    broadcaster = get_broadcaster(deployment_id)
    await broadcaster.connect(websocket)
    try:
        while True:
            # Keep the connection alive; client can send pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        await broadcaster.disconnect(websocket)
