from typing import Annotated
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import Session, DeclarativeBase
from fastapi import Depends

db_dialect = "postgresql"
db_api = "psycopg2"
db_host = "localhost"
db_port = 5432
db_user = "postgres"
db_password = "example"
db_db = "postgres"

db_url = URL.create(
    drivername=f"{db_dialect}+{db_api}",
    username=db_user,
    password=db_password,
    host=db_host,
    port=db_port,
    database=db_db
)

engine = create_engine(db_url, echo=True)

def get_session():
    with Session(engine) as session:
        # yield session
        try:
            yield session
            # session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()

DbSession = Annotated[Session, Depends(get_session)]

class Base(DeclarativeBase):
    pass