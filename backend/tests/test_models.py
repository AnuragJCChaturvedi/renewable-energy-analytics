# tests/test_models.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import User, EnergySource, EnergyType, EnergyTrack

# In-memory SQLite DB for testing
@pytest.fixture(scope="function")
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

def test_create_user(db_session):
    user = User(email="test@example.com", username="testuser", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    fetched = db_session.query(User).filter_by(email="test@example.com").first()
    assert fetched is not None
    assert fetched.username == "testuser"

def test_create_energy_source(db_session):
    source = EnergySource(name="Solar")
    db_session.add(source)
    db_session.commit()

    assert db_session.query(EnergySource).filter_by(name="Solar").first() is not None

def test_create_energy_type(db_session):
    etype = EnergyType(name="generation")
    db_session.add(etype)
    db_session.commit()

    assert db_session.query(EnergyType).filter_by(name="generation").first() is not None

def test_create_energy_track(db_session):
    source = EnergySource(name="Wind")
    etype = EnergyType(name="consumption")
    db_session.add_all([source, etype])
    db_session.commit()

    track = EnergyTrack(source_id=source.id, type_id=etype.id, month=4, kwh=1500.75)
    db_session.add(track)
    db_session.commit()

    result = db_session.query(EnergyTrack).first()
    assert result is not None
    assert result.month == 4
    assert float(result.kwh) == 1500.75
