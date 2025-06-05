from fastapi import APIRouter

router = APIRouter(prefix="/ssh")


@router.post("/connection")
def create_connection():
    return "Hello from POST /connection!"
