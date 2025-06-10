from fastapi import APIRouter

router = APIRouter(prefix="/auth")


@router.post("/create")
def create_account():
    return "Hello from /auth!"
