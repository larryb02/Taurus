from fastapi import APIRouter

router = APIRouter(prefix="/auth")


@router.get("/test")
def auth_hello_world():
    return "Hello from /auth!"
