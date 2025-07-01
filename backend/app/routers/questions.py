from typing import Optional, TYPE_CHECKING
from fastapi import APIRouter, HTTPException
from sqlmodel import Field, Relationship, SQLModel, select

from ..dependencies import SessionDep

if TYPE_CHECKING:
    from .groups import Group


class QuestionBase(SQLModel):
    text: str


class Question(QuestionBase, table=True):
    id: int | None = Field(index=True, primary_key=True)
    text: str

    group_id: int = Field(foreign_key="group.id")
    group: Optional["Group"] = Relationship(back_populates="questions")


class QuestionPublic(QuestionBase):
    text: str


class QuestionUpdate(QuestionBase):
    text: str
    group_id: int


class QuestionCreate(QuestionBase):
    text: str
    group_id: int


router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=list[QuestionPublic])
async def list_questionzes(session: SessionDep):
    res = session.exec(select(Question)).all()
    return res


@router.get("/{id}", response_model=QuestionPublic)
async def get_question(id: int, session: SessionDep):
    res: Question | None = session.get(Question, id)

    if not res:
        raise HTTPException(status_code=404, detail="Question not found")

    return res


@router.post("/", response_model=QuestionPublic)
async def create_question(question: QuestionCreate, session: SessionDep):
    db_question = Question(id=None, text=question.text, group_id=question.group_id)
    session.add(db_question)
    session.commit()
    session.refresh(db_question)

    return db_question


@router.patch("/{id}", response_model=QuestionPublic)
def update_question(id: int, question: QuestionUpdate, session: SessionDep):
    question_db: Question | None = session.get(Question, id)
    if not question_db:
        raise HTTPException(status_code=404, detail="Question not found")

    question_data = question.model_dump(exclude_unset=True)
    _ = question_db.sqlmodel_update(question_data)
    session.add(question_db)
    session.commit()
    session.refresh(question_db)


@router.delete("/{id}")
def delete_question(id: int, session: SessionDep):
    question_db: Question | None = session.get(Question, id)

    if not question_db:
        raise HTTPException(status_code=404, detail="Question not found")

    question_db.enabled = False
    session.add(question_db)
    session.commit()

    return {"ok": True}
