from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from fastapi import Form


# ------------------ User Schemas ------------------ #

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        from_attributes = True  # For Pydantic v2


class UserLoginForm:
    def __init__(
        self,
        email: EmailStr = Form(...),
        password: str = Form(...),
    ):
        self.email = email
        self.password = password


# ------------------ Token Schemas ------------------ #

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    username: Optional[str] = None

# ---------------- Trends ---------------------------- #


class TrendsPoint(BaseModel):
    month: str
    solar: float
    tidal: float
    grid: float
    hydro: float
    geothermal: float

class CompositionPoint(BaseModel):
    month: str
    solar: float
    tidal: float
    grid: float
    hydro: float
    geothermal: float

class SummaryPoint(BaseModel):
    source: str
    kwh: float

class ComposedPoint(BaseModel):
    month: str
    total: float
    highlight: float