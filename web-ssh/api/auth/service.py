# from db.service import DbSession
from sqlalchemy import insert, select

from fastapi import Request
from .models import User, UserAccount
from db.core import DbSession

# from pydantic import ValueError

def get_current_user(request: Request):
    if request.session.get("user_id"):
        current_user = request.session.get("user_id")
        return current_user
    else:
        print("No user signed in")
        return None
    

def get_user(user: User, dbsession: DbSession):
    stmt = select(
        UserAccount.user_id,
        UserAccount.username,
        UserAccount.email_address,
        UserAccount.password,
        UserAccount.created_at,
    ).where(user.email == UserAccount.email_address)
    try:
        record = dbsession.execute(stmt).one_or_none()
        return record
    except Exception as e:
        print(f"Exception in get_user: {e}")
        raise


def create_user(user: User, dbsession: DbSession) -> dict:
    # TODO validate input and hash passwords
    stmt = (
        insert(UserAccount)
        .values(
            email_address=user.email, username=user.username, password=user.password
        )
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


def validate(expected, input) -> bool:
    return expected == input


def login_user(user: dict, input_password: str):
    # validate credentials
    # print(user)
    expected_password = user["password"]
    success = expected_password == input_password
    if success:
        return user["user_id"]  # will be stored in a session object
    else:
        raise ValueError("Incorrect credentials")

def logoff_user(request: Request) -> None:
    request.session.clear()