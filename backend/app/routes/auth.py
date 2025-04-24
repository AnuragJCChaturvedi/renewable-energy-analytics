from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from app import database, models, schemas
from app.core import hashing, jwt
from app.schemas import UserLoginForm

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(database.get_db)
):
    # Validate using Pydantic schema
    try:
        validated = schemas.UserCreate(username=username.strip(), email=email.strip().lower(), password=password)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid registration data format"
        )

    if db.query(models.User).filter(models.User.email == validated.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if db.query(models.User).filter(models.User.username == validated.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    hashed_password = hashing.hash_password(validated.password)
    user = models.User(username=validated.username, email=validated.email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
def login_user(
    form_data: UserLoginForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.email.strip().lower()).first()

    if not user or not hashing.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = jwt.create_access_token(
        data={"sub": str(user.id), "email": user.email, "username": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}
