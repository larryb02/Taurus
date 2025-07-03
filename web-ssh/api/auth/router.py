import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from ..db.core import DbSession
from .service import (
    create,
    login,
    get_user_by_email,
    get_current_user,
    logoff,
    get_user_by_id,
)
from .models import User, UserLogin

auth_logger = logging.getLogger("web_ssh.auth")
auth_logger.setLevel(logging.DEBUG)
router = APIRouter(prefix="/auth")


@router.post("/user")
def create_account(user: User, session: DbSession):
    user_acc = get_user_by_email(user.email, session)
    if user_acc:
        raise HTTPException(
            status_code=403, detail="User with this email already exists"
        )
    try:
        res = create(user, session)
        return {"result": "Sucessfully created user"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process request: {e}")


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


@router.patch("/user")
def change_user_setting():
    pass


@router.post("/login")
def login_user(user: UserLogin, session: DbSession, request: Request):
    # check for existing user
    # store user in session object or something
    user_acc = get_user_by_email(user.email_or_user, session)
    if not user_acc:
        auth_logger.info("Email address not found")
        raise HTTPException(status_code=403, detail="Failed to login")
    user_acc = dict(get_user_by_email(user.email_or_user, session)._mapping)
    try:
        session = login(user_acc, user.password)
        request.session["user_id"] = session
        auth_logger.info(
            "successfully logged in"
        )  # make sure we include request info in logs
        return {
            "result": {
                "user_id": user_acc["user_id"],
                "username": user_acc["username"],
                "email_address": user_acc["email_address"],
            }
        }
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=403, detail="Failed to login")


@router.post("/logoff")
def logoff_user(request: Request):
    logoff(request)
    return {"result": "User has been signed out."}
