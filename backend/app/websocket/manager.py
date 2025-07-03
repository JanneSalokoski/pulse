from collections import defaultdict
from fastapi import WebSocket


class Event:
    def __init__(self, event: str, payload: dict[str, str | int]):
        self.event: str = event
        self.payload: dict[str, str | int] = payload

    def json(self):
        return {"event": self.event, "payload": self.payload}


connections: dict[str, set[WebSocket]] = defaultdict(set)


async def connect(slug: str, ws: WebSocket):
    await ws.accept()
    connections[slug].add(ws)
    await broadcast_participants(slug)


async def disconnect(slug: str, ws: WebSocket):
    connections[slug].discard(ws)
    await broadcast_participants(slug)


async def broadcast_event(slug: str, event: Event):
    conns = connections[slug]

    dead: list[WebSocket] = []
    for ws in conns:
        try:
            await ws.send_json(event.json())
        except Exception:
            dead.append(ws)

    for ws in dead:
        conns.discard(ws)


async def broadcast_participants(slug: str):
    conns = connections[slug]
    msg = Event("participant_amount", {"amount": len(conns)})
    await broadcast_event(slug, msg)


async def broadcast_answers(slug: str, answers: int):
    msg = Event("answer_amount", {"amount": answers})
    await broadcast_event(slug, msg)
