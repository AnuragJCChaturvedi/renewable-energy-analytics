from sqlalchemy.orm import Session
from app.models import EnergyTrack, EnergySource, EnergyType
from collections import defaultdict

def get_all_energy_tracks(db: Session):
    raw_tracks = db.query(
        EnergyTrack.month,
        EnergyTrack.kwh,
        EnergySource.name.label("source"),
        EnergyType.name.label("type")
    ).join(EnergySource, EnergyTrack.source_id == EnergySource.id)\
     .join(EnergyType, EnergyTrack.type_id == EnergyType.id)\
     .all()

    result = defaultdict(lambda: defaultdict(float))

    for entry in raw_tracks:
        key = (entry.source, entry.type)
        result[key][entry.month] += float(entry.kwh)

    response = []
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (source, typ), monthly_data in result.items():
        for month_num in range(1, 13):
            if month_num in monthly_data:
                response.append({
                    "month": month_names[month_num - 1],
                    "kwh": monthly_data[month_num],
                    "source": source,
                    "type": typ
                })

    return response
