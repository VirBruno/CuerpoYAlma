import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

DATABASE_URL = "postgresql://cuerpoyalma:cuerpoyalma@db:5432/cuerpoyalma_db"

engine = None

# Reintenta conexión
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()
        print("✅ Conectado a la base de datos")
        break
    except OperationalError:
        print("⏳ Esperando a la base de datos...")
        time.sleep(2)
else:
    raise Exception("❌ No se pudo conectar a la base de datos")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
