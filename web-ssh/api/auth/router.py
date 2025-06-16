from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from ..db.core import DbSession
from .service import (
    create_user,
    login_user,
    get_user_by_email,
    get_current_user,
    logoff_user,
    get_user_by_id,
)
from .models import User, UserLogin

# from starsessions.session import regenerate_session_id

router = APIRouter(prefix="/auth")


@router.post("/user")
def create_account(user: User, session: DbSession):
    user_acc = get_user_by_email(user.email, session)
    if user_acc:
        raise HTTPException(
            status_code=403, detail="User with this email already exists"
        )
    try:
        res = create_user(user, session)
        return {"result": "Sucessfully created user"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process request: {e}")


@router.post("/login")
def login_account(user: UserLogin, session: DbSession, request: Request):
    # check for existing user
    # store user in session object or something
    user_acc = get_user_by_email(user.email_or_user, session)
    if user_acc:
        user_acc = dict(get_user_by_email(user.email_or_user, session)._mapping)
        try:
            session = login_user(user_acc, user.password)
            request.session["user_id"] = session
            # regenerate_session_id(request)
            print(request.session)
            return session
        except Exception as e:
            print(f"Exception: {e}")
            raise HTTPException(status_code=403, detail="Failed to login")
    else:
        raise HTTPException(status_code=403, detail="No user found")


@router.post("/logoff")
def logoff_account(request: Request):
    logoff_user(request)
    return {"result": "User has been signed out."}


@router.get("/user")
def get_signed_in_user(session: DbSession, request: Request):
    user_id = get_current_user(
        request
    )  # get user_id from session object, should probly safeguard incase somehow signed out
    if (
        user_id
    ):  # this nesting is probably unecessary, unless an account got deleted or something crazy edge case
        user = get_user_by_id(user_id, session)
        if user:
            user = dict(user._mapping)
            return {
                "result": {
                    "user_id": user["user_id"],
                    "username": user["username"],
                    "email_address": user["email_address"],
                }
            }
        else:
            raise HTTPException(status_code=400, detail="No user found")
    else:
        raise HTTPException(status_code=400, detail="No user signed in")
