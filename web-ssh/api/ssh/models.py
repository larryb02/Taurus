from pydantic import BaseModel

class SSHConn(BaseModel):
    label: str
    hostname: str
    user: str
    password: str
    # AuthMethod: str # this will determine the parameters that need to be passed in body ideally