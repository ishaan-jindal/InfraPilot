from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables defined by models that inherit from Base."""
    from app import models  # noqa: F401 — ensures models are registered
    Base.metadata.create_all(bind=engine)

    # Auto-migration: ensure github_user column exists
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE deployments ADD COLUMN IF NOT EXISTS github_user VARCHAR(255);"))
            conn.commit()
        except Exception:
            pass
