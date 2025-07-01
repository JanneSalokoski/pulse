from typing import TYPE_CHECKING
from fastapi import APIRouter, HTTPException
from sqlmodel import Field, Relationship, SQLModel, select

from ..dependencies import SessionDep

if TYPE_CHECKING:
    from .quizzes import Quiz
    from .questions import Question


class AnswerBase(SQLModel):
    value: int


class Answer(AnswerBase, table=True):
    id: int | None = Field(index=True, primary_key=True)
    value: int

    question_id: int = Field(foreign_key="question.id")
    quiz_id: int = Field(foreign_key="quiz.id")

    question: "Question" = Relationship(back_populates="answers")
    quiz: "Quiz" = Relationship(back_populates="answers")


class AnswerPublic(AnswerBase):
    value: int


class AnswerUpdate(AnswerBase):
    value: int


class AnswerCreate(AnswerBase):
    value: int
    question_id: int
    quiz_id: int


router = APIRouter(prefix="/answers", tags=["answers"])


@router.get("", response_model=list[AnswerPublic])
async def list_answerzes(session: SessionDep):
    res = session.exec(select(Answer)).all()
    return res


@router.get("/{id}", response_model=AnswerPublic)
async def get_answer(id: int, session: SessionDep):
    res: Answer | None = session.get(Answer, id)

    if not res:
        raise HTTPException(status_code=404, detail="Answer not found")

    return res


@router.post("/", response_model=AnswerPublic)
async def create_answer(answer: AnswerCreate, session: SessionDep):
    db_answer = Answer(
        id=None,
        value=answer.value,
        quiz_id=answer.quiz_id,
        question_id=answer.question_id,
    )
    session.add(db_answer)
    session.commit()
    session.refresh(db_answer)

    return db_answer


@router.patch("/{id}", response_model=AnswerPublic)
def update_answer(id: int, answer: AnswerUpdate, session: SessionDep):
    answer_db: Answer | None = session.get(Answer, id)
    if not answer_db:
        raise HTTPException(status_code=404, detail="Answer not found")

    answer_data = answer.model_dump(exclude_unset=True)
    _ = answer_db.sqlmodel_update(answer_data)
    session.add(answer_db)
    session.commit()
    session.refresh(answer_db)


@router.delete("/{id}")
def delete_answer(id: int, session: SessionDep):
    answer_db: Answer | None = session.get(Answer, id)

    if not answer_db:
        raise HTTPException(status_code=404, detail="Answer not found")

    answer_db.enabled = False
    session.add(answer_db)
    session.commit()

    return {"ok": True}


_ = Answer.model_rebuild()
