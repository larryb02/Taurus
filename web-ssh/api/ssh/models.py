from pydantic import BaseModel
from ..db.core import Base
from sqlalchemy import ForeignKey, String, DATETIME, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column
from ..auth.models import UserAccount
from datetime import datetime
from abc import abstractmethod, ABC
from typing import Annotated


class Auth(ABC):
    @abstractmethod
    def serialize(self):
        pass

    @abstractmethod
    def deserialize(self):
        pass


class PasswordAuth(Auth):
    password: str
    def __init__(self, password):
        self.password = password
    def serialize(self):
        return None
    def deserialize(self):
        return None


class IdentityAuth(Auth):
    private_key: bytes
    def __init__(self, private_key):
        self.private_key = private_key
    def serialize(self):
        return None
    def deserialize(self):
        return None


class SSHConn(BaseModel):
    label: Annotated[str, 'Label for management of ssh connections']
    hostname: Annotated[str, 'Hostname for ssh connection']
    username: Annotated[str, 'Username for ssh connection']
    credentials: Annotated[dict[str, str], 'ssh credentials, only two valid possibilities']


class SSHConnection(Base):
    __tablename__ = "sshconnection"

    connection_id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(255))
    hostname: Mapped[str] = mapped_column(String(255))
    username: Mapped[str] = mapped_column(String(255))
    user_id: Mapped[int] = mapped_column(ForeignKey(UserAccount.user_id))
    credentials: Mapped[bytes] = mapped_column(LargeBinary())
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())