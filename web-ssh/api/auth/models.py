from pydantic import BaseModel
from db.core import Base
from sqlalchemy import String, DATETIME, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from datetime import datetime


class User(BaseModel):
    email: str
    username: str
    password: str


class UserLogin(BaseModel):
    email_or_user: str
    password: str


class UserAccount(Base):
    __tablename__ = "useraccount"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str] = mapped_column(String(100), unique=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[bytes] = mapped_column(LargeBinary())
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())
