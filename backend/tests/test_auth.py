from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend is running 🚀"}

def test_register_validation_errors():
    response = client.post(
        "/auth/register",
        data={
            "username": "",
            "email": "invalidemail",
            "password": "data"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 422
    data = response.json()
    assert (
        data.get("detail") == "Validation failed"
        or "errors" in data
        or data.get("detail") == "Invalid registration data format"
    )

def test_login_invalid_credentials():
    res = client.post("/auth/login", data={
        "email": "invalid@example.com",
        "password": "wrongpassword"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})

    assert res.status_code == 401
    assert res.json()["detail"] == "Invalid credentials"

def test_login_success():
    email = "user@test.com"
    password = "testuser"

    # Login
    res = client.post("/auth/login", data={
        "email": email,
        "password": password
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})

    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
