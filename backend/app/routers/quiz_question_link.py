from sqlmodel import SQLModel, Field


class QuizQuestionLink(SQLModel, table=True):
    quiz_id: int = Field(foreign_key="quiz.id", primary_key=True)
    question_id: int = Field(foreign_key="question.id", primary_key=True)
