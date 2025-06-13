from fastapi import APIRouter, HTTPException
from db.core import DbSession
from .service import create
from .models import User


router = APIRouter(prefix="/auth")


@router.post("/create")
def create_account(user: User, session: DbSession):
    try:
        res = create(user, session)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process request: {e}")
    
@router.post("/login")
def login(user:User, session: DbSession):
    pass
    
