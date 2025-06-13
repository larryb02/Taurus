from fastapi import APIRouter, HTTPException, Request
from db.core import DbSession
from .service import create_user, login_user, get_user, get_current_user
from .models import User

router = APIRouter(prefix="/auth")

@router.get("/quick_test")
def test(request: Request):
    return get_current_user(request)

@router.post("/create")
def create_account(user: User, session: DbSession):
    user_acc = get_user(user, session)
    if user_acc:
        raise HTTPException(status_code=403, detail="User with this email already exists")
    try:
        res = create_user(user, session)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process request: {e}")
    
@router.post("/login")
def login_account(user: User, session: DbSession, request: Request):
    # check for existing user
    # store user in session object or something
    user_acc = dict(get_user(user, session)._mapping)
    if user_acc is None:
        raise HTTPException(status_code=403, detail="No user found")
    print(f"User found: {user_acc}")
    try:
        print("Logging in")
        session = login_user(user_acc, user.password)
        request.session['user_id'] = session
        return session
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=403, detail="Failed to login")
    