import hashlib

from fastapi import APIRouter, HTTPException
from sqlmodel import Field, Relationship, SQLModel, select
from datetime import datetime

from ..dependencies import SessionDep

from .questions import Question


class GroupBase(SQLModel):
    name: str


class Group(GroupBase, table=True):
    id: int | None = Field(index=True, primary_key=True)
    slug: str = Field(index=True)
    created_at: str
    enabled: bool

    questions: list["Question"] = Relationship(back_populates="group")


class GroupPublic(GroupBase):
    id: int
    name: str
    slug: str
    created_at: str

    questions: list["Question"]


class GroupUpdate(GroupBase):
    name: str


class GroupCreate(GroupBase):
    pass


router = APIRouter(prefix="/groups", tags=["groups"])


@router.get("", response_model=list[GroupPublic])
async def list_groupzes(session: SessionDep):
    res = session.exec(select(Group).where(Group.enabled)).all()
    return res


@router.get("/{slug}", response_model=GroupPublic)
async def get_group(slug: str, session: SessionDep):
    res: Group | None = session.exec(
        select(Group).where(Group.enabled and Group.slug == slug)
    ).one_or_none()

    if not res:
        raise HTTPException(status_code=404, detail="Group not found")

    return res


@router.post("/", response_model=GroupPublic)
async def create_group(group: GroupCreate, session: SessionDep):
    slug: str = hashlib.md5(group.name.encode()).hexdigest()[:8]
    created_at = datetime.now().isoformat()

    db_group = Group(
        id=None, name=group.name, slug=slug, created_at=created_at, enabled=True
    )
    session.add(db_group)
    session.commit()
    session.refresh(db_group)

    return db_group


@router.patch("/{slug}", response_model=GroupPublic)
def update_group(slug: str, group: GroupUpdate, session: SessionDep):
    group_db: Group | None = session.exec(
        select(Group).where(Group.enabled and Group.slug == slug)
    ).one_or_none()
    if not group_db:
        raise HTTPException(status_code=404, detail="Group not found")

    group_data = group.model_dump(exclude_unset=True)
    _ = group_db.sqlmodel_update(group_data)
    session.add(group_db)
    session.commit()
    session.refresh(group_db)


@router.delete("/{slug}")
def delete_group(slug: str, session: SessionDep):
    group_db: Group | None = session.exec(
        select(Group).where(Group.enabled and Group.slug == slug)
    ).one_or_none()

    if not group_db:
        raise HTTPException(status_code=404, detail="Group not found")

    group_db.enabled = False
    session.add(group_db)
    session.commit()

    return {"ok": True}


_ = Group.model_rebuild()
_ = GroupPublic.model_rebuild()
