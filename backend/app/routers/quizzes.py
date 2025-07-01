from fastapi import APIRouter, HTTPException
from sqlmodel import Field, SQLModel, select

from ..dependencies import SessionDep


class QuizBase(SQLModel):
    pass


class Quiz(QuizBase, table=True):
    id: int = Field(index=True, primary_key=True)
    slug: str = Field(index=True)
    created_at: str
    enabled: bool


class QuizPublic(QuizBase):
    slug: str
    created_at: str
    enabled: bool


class QuizUpdate(QuizBase):
    enabled: bool


class QuizCreate(QuizBase):
    pass


router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.get("", response_model=list[QuizPublic])
async def list_quizzes(session: SessionDep):
    res = session.exec(select(Quiz)).all()
    return res


@router.get("/{id}")
async def get_quiz(id: int, session: SessionDep):
    res = session.get(Quiz, id)
    if not res:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return res


@router.post("/", response_model=QuizPublic)
async def create_quiz(quiz: QuizCreate, session: SessionDep):
    db_quiz = Quiz.model_validate(quiz)
    session.add(db_quiz)
    session.commit()
    session.refresh(db_quiz)

    return db_quiz


@router.patch("/{id}", response_model=QuizPublic)
def update_quiz(id: int, quiz: QuizUpdate, session: SessionDep):
    quiz_db = session.get(Quiz, id)
    if not quiz_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz_data = quiz.model_dump(exclude_unset=True)
    _ = quiz_db.sqlmodel_update(quiz_data)
    session.add(quiz_db)
    session.commit()
    session.refresh(quiz_db)


@router.delete("/{id}")
def delete_quiz(id: int, session: SessionDep):
    quiz = session.get(Quiz, id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    session.delete(quiz)
    session.commit()

    return {"ok": True}
