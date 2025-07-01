from contextlib import asynccontextmanager
from fastapi import FastAPI

from .dependencies import create_db_and_tables
from .routers import quizzes, questions, groups, answers


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan, root_path="/api")

app.include_router(quizzes.router)
app.include_router(questions.router)
app.include_router(groups.router)
app.include_router(answers.router)
