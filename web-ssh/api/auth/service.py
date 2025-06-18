# from db.service import DbSession
from sqlalchemy import insert, select
from fastapi import Request
from .models import User, UserAccount
from ..db.core import DbSession
import bcrypt


def get_user_by_id(user_id: int, dbsession: DbSession):
    stmt = select(
        UserAccount.user_id,
        UserAccount.username,
        UserAccount.email_address,
        UserAccount.password,
        UserAccount.created_at,
    ).where(user_id == UserAccount.user_id)
    try:
        record = dbsession.execute(stmt).one_or_none()
        return record
    except Exception as e:
        print(f"Exception in get_user_by_id: {e}")
        raise


def get_current_user(request: Request):
    print(request.session)
    if request.session.get("user_id"):
        current_user = request.session.get("user_id")
        print(f"Current User: {current_user}")
        return current_user
    else:
        print("No user signed in")
        return None


def get_user_by_email(email_address: str, dbsession: DbSession):
    stmt = select(
        UserAccount.user_id,
        UserAccount.username,
        UserAccount.email_address,
        UserAccount.password,
        UserAccount.created_at,
    ).where(email_address == UserAccount.email_address)
    try:
        record = dbsession.execute(stmt).one_or_none()
        return record
    except Exception as e:
        print(f"Exception in get_user_by_email: {e}")
        raise


def hash_password(password: str):
    to_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(to_bytes, salt)


def create(user: User, dbsession: DbSession) -> dict:
    # TODO validate input

    hashed_pw = hash_password(user.password)
    stmt = (
        insert(UserAccount)
        .values(email_address=user.email, username=user.username, password=hashed_pw)
        .returning(
            UserAccount.user_id,
            UserAccount.username,
            UserAccount.email_address,
            UserAccount.created_at,
        )
    )
    try:
        print(stmt)
        record = dbsession.execute(stmt).one_or_none()
        return dict(record._mapping)
    except Exception as e:
        print(f"Exception in create: {e}")
        # raise HTTPException(status_code=500, detail="Failed to execute query")
        raise


def login(user: dict, input_password: str):
    # validate credentials
    # print(user)
    expected_password = user["password"]
    success = bcrypt.checkpw(input_password.encode("utf-8"), expected_password)
    if success:
        return user["user_id"]  # will be stored in a session object
    else:
        raise ValueError("Incorrect credentials")


def logoff(request: Request) -> None:
    request.session.clear()
    # redirect once we get to that part, for now will probably just redirect on client
