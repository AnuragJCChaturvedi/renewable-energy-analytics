import os
import sys
import random
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add backend root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models import EnergySource, EnergyType, EnergyTrack

# Configuration
MONTHS = list(range(1, 13))
ENERGY_TYPES = ["generation", "consumption"]
SOURCES = ["solar", "tidal", "grid", "hydropower", "geothermal"]

# kWh range per energy type
KWH_RANGES = {
    "generation": (200, 1000),
    "consumption": (100, 600),
}

def seed_energy_tracks():
    db: Session = SessionLocal()

    # Clear existing records
    db.execute(text("DELETE FROM energy_tracks"))
    db.execute(text("DELETE FROM energy_sources"))
    db.execute(text("DELETE FROM energy_types"))
    db.commit()

    # Insert energy types
    type_ids = {}
    for energy_type in ENERGY_TYPES:
        et = EnergyType(name=energy_type)
        db.add(et)
        db.flush()
        type_ids[energy_type] = et.id

    # Insert sources
    source_ids = {}
    for source in SOURCES:
        es = EnergySource(name=source)
        db.add(es)
        db.flush()
        source_ids[source] = es.id

    # Add energy track entries
    for source in SOURCES:
        for etype in ENERGY_TYPES:
            months = random.sample(MONTHS, k=random.randint(6, 12))  # randomly choose months
            for month in months:
                kwh = round(random.uniform(*KWH_RANGES[etype]), 2)
                db.add(EnergyTrack(
                    source_id=source_ids[source],
                    type_id=type_ids[etype],
                    month=month,
                    kwh=kwh
                ))

    db.commit()
    db.close()
    print("Seeded energy_tracks with rich, varied data across sources and types.")

if __name__ == "__main__":
    seed_energy_tracks()
