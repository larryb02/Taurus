from pydantic import BaseModel, Field
from ..db.core import Base
from sqlalchemy import String, TIMESTAMP, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime


class User(BaseModel):
    email: str = Field(min_length=5)
    username: str = Field(min_length=5)
    password: str = Field(
        min_length=5
    )  # set to 16 later and add logic to request stronger passwords


class UserLogin(BaseModel):
    email_or_user: str = Field(strict=True)
    password: str = Field(strict=True)


class UserAccount(Base):
    __tablename__ = "useraccount"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str] = mapped_column(String(100), unique=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[bytes] = mapped_column(LargeBinary())
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.now())
