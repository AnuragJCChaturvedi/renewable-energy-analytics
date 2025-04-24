from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from collections import defaultdict

from app.database import get_db
from app.models import EnergyTrack, EnergySource, EnergyType, User
from app.core.authentication import get_current_user
from app.schemas import (
    TrendsPoint,
    CompositionPoint,
    SummaryPoint,
    ComposedPoint,
)

router = APIRouter(prefix="/energy", tags=["energy"])

_MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

def _pivot_by_month_and_source(raw: List) -> Dict[int, Dict[str, float]]:
    pivot: Dict[int, Dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for month, kwh, source, _ in raw:
        pivot[month][source] += float(kwh)
    return pivot

@router.get("/trends", response_model=List[TrendsPoint], summary="Monthly trends per source for a given energy type")
def get_trends(
    energy_type: str = Query(..., description="‘consumption’ or ‘generation’"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    raw = db.query(
        EnergyTrack.month,
        EnergyTrack.kwh,
        EnergySource.name.label("source"),
        EnergyType.name.label("type"),
    ).join(EnergySource, EnergyTrack.source_id == EnergySource.id) \
     .join(EnergyType, EnergyTrack.type_id == EnergyType.id) \
     .filter(EnergyType.name == energy_type) \
     .all()

    pivot = _pivot_by_month_and_source(raw)
    out: List[Dict] = []
    for m in range(1, 13):
        row = {"month": _MONTH_NAMES[m - 1]}
        sources = pivot.get(m, {})
        for src in ["solar", "tidal", "grid", "hydro", "geothermal"]:
            row[src] = sources.get(src, 0.0)
        out.append(row)
    return out

@router.get("/composition", response_model=List[CompositionPoint], summary="Stacked‐bar data: monthly composition by source")
def get_composition(
    energy_type: str = Query(..., description="‘consumption’ or ‘generation’"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trends(energy_type, db)

@router.get("/summary", response_model=List[SummaryPoint], summary="Total kWh per source over all months for a type")
def get_summary(
    energy_type: str = Query(..., description="‘consumption’ or ‘generation’"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    raw = db.query(
        EnergyTrack.kwh,
        EnergySource.name.label("source"),
        EnergyType.name.label("type"),
    ).join(EnergySource, EnergyTrack.source_id == EnergySource.id) \
     .join(EnergyType, EnergyTrack.type_id == EnergyType.id) \
     .filter(EnergyType.name == energy_type) \
     .all()

    totals: Dict[str, float] = defaultdict(float)
    for kwh, src, _ in raw:
        totals[src] += float(kwh)

    return [{"source": src, "kwh": val} for src, val in totals.items()]

@router.get("/composed", response_model=List[ComposedPoint], summary="Combined bar+line: total + highlighted source per month")
def get_composed(
    energy_type: str = Query(..., description="‘consumption’ or ‘generation’"),
    highlight: str = Query(..., description="One of solar|tidal|grid|hydro|geothermal"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    raw = db.query(
        EnergyTrack.month,
        EnergyTrack.kwh,
        EnergySource.name.label("source"),
        EnergyType.name.label("type"),
    ).join(EnergySource, EnergyTrack.source_id == EnergySource.id) \
     .join(EnergyType, EnergyTrack.type_id == EnergyType.id) \
     .filter(EnergyType.name == energy_type) \
     .all()

    pivot = _pivot_by_month_and_source(raw)
    out: List[Dict] = []
    for m in range(1, 13):
        month_data = pivot.get(m, {})
        total = sum(month_data.values())
        out.append({
            "month": _MONTH_NAMES[m - 1],
            "total": total,
            "highlight": month_data.get(highlight, 0.0),
        })
    return out
