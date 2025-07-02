import hashlib
from typing import TYPE_CHECKING

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from sqlmodel import Field, Relationship, SQLModel, select
from datetime import datetime

from collections import defaultdict

from ..dependencies import SessionDep

from .questions import Question, QuestionWithAnswers
from .quiz_question_link import QuizQuestionLink

if TYPE_CHECKING:
    from .answers import Answer


class QuizBase(SQLModel):
    name: str


class Quiz(QuizBase, table=True):
    id: int | None = Field(index=True, primary_key=True)
    slug: str = Field(index=True)
    created_at: str
    enabled: bool

    questions: list["Question"] = Relationship(
        back_populates="quizzes", link_model=QuizQuestionLink
    )

    answers: list["Answer"] = Relationship(back_populates="quiz")


class QuizPublic(QuizBase):
    id: int
    name: str
    slug: str
    created_at: str
    questions: list["QuestionWithAnswers"]


class QuizUpdate(QuizBase):
    name: str


class QuizCreate(QuizBase):
    name: str
    questions: list[int]


router = APIRouter(prefix="/quizzes", tags=["quizzes"])

connections: dict[str, set[WebSocket]] = defaultdict(set)


@router.websocket("/ws/{slug}")
async def ws_visitor_counter(ws: WebSocket, slug: str):
    await ws.accept()
    connections[slug].add(ws)

    await broadcast_count(slug)

    try:
        while True:
            _ = await ws.receive_text()

    except WebSocketDisconnect:
        connections[slug].remove(ws)
        await broadcast_count(slug)


async def broadcast_count(slug: str):
    conns: set[WebSocket] = connections[slug]
    count = len(conns)
    msg = str(count)

    dead: list[WebSocket] = []
    for ws in conns:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.append(ws)

    for ws in dead:
        conns.remove(ws)


@router.get("", response_model=list[QuizPublic])
async def list_quizzes(session: SessionDep):
    res = session.exec(select(Quiz).where(Quiz.enabled)).all()
    return res


@router.get("/{slug}", response_model=QuizPublic)
async def get_quiz(slug: str, session: SessionDep):
    res: Quiz | None = session.exec(
        select(Quiz).where(Quiz.enabled and Quiz.slug == slug)
    ).one_or_none()

    if not res:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return res


@router.post("/", response_model=QuizPublic)
async def create_quiz(quiz: QuizCreate, session: SessionDep):
    slug: str = hashlib.md5(quiz.name.encode()).hexdigest()[:8]
    created_at = datetime.now().isoformat()

    db_quiz = Quiz(
        id=None, name=quiz.name, slug=slug, created_at=created_at, enabled=True
    )

    session.add(db_quiz)
    session.commit()
    session.refresh(db_quiz)

    if not db_quiz.id:
        raise HTTPException(status_code=500, detail="Could not create quizz")

    for qid in quiz.questions:
        link = QuizQuestionLink(quiz_id=db_quiz.id, question_id=qid)
        session.add(link)

    session.commit()

    return db_quiz


@router.patch("/{slug}", response_model=QuizPublic)
def update_quiz(slug: str, quiz: QuizUpdate, session: SessionDep):
    quiz_db: Quiz | None = session.exec(
        select(Quiz).where(Quiz.enabled and Quiz.slug == slug)
    ).one_or_none()
    if not quiz_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz_data = quiz.model_dump(exclude_unset=True)
    _ = quiz_db.sqlmodel_update(quiz_data)
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)


@router.delete("/{slug}")
def delete_quiz(slug: str, session: SessionDep):
    quiz_db: Quiz | None = session.exec(
        select(Quiz).where(Quiz.enabled and Quiz.slug == slug)
    ).one_or_none()

    if not quiz_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz_db.enabled = False
    session.add(quiz_db)
    session.commit()

    return {"ok": True}


_ = QuizPublic.model_rebuild()
_ = Quiz.model_rebuild()
