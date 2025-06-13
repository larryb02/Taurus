# from db.service import DbSession
from sqlalchemy import insert
from fastapi import HTTPException
from .models import User, UserAccount
from db.core import DbSession


def create(user: User, dbsession: DbSession) -> dict:
    #TODO validate input and hash passwords
    stmt = (
        insert(UserAccount)
        .values(
            email_address=user.email, username=user.username, password=user.password
        )
        .returning(UserAccount.user_id, UserAccount.username, UserAccount.email_address, UserAccount.created_at)
    )
    try:
        print(stmt)
        res = dbsession.execute(stmt)
        # print(f"Record: {res.fetchone()}")
        return dict(res.fetchone()._mapping)
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail="Failed to execute query")

def login(user: User, dbsession: DbSession):
    pass
