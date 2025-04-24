# backend/main.py

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app import models, database
from app.routes import auth, energy
from app.exceptions import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler
)

load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=database.engine)

# Initialize app
app = FastAPI()

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include routers
app.include_router(auth.router)
app.include_router(energy.router)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}
