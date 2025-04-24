from sqlalchemy import (
    Column, Integer, String, Numeric, ForeignKey, TIMESTAMP, func
)
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class EnergySource(Base):
    __tablename__ = "energy_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<EnergySource(id={self.id}, name={self.name})>"


class EnergyType(Base):
    __tablename__ = "energy_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # e.g., "generation", "consumption"
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<EnergyType(id={self.id}, name={self.name})>"


class EnergyTrack(Base):
    __tablename__ = "energy_tracks"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("energy_sources.id"), nullable=False)
    type_id = Column(Integer, ForeignKey("energy_types.id"), nullable=False)
    month = Column(Integer, nullable=False)  # 1 = January, 12 = December
    kwh = Column(Numeric(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<EnergyTrack(id={self.id}, source={self.source_id}, type={self.type_id}, month={self.month}, kwh={self.kwh})>"
