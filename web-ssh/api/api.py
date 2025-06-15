from fastapi import APIRouter
from .ssh.router import router as ssh_router
from .auth.router import router as auth_router

router = APIRouter(prefix="/api")

router.include_router(ssh_router)
router.include_router(auth_router)
