from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="PocketSmart AI API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Data Models
class HomeBudgetRequest(BaseModel):
    budget: float
    lights: int = 0
    fans: int = 0
    furniture: int = 0
    notes: Optional[str] = None

class PartyBudgetRequest(BaseModel):
    event_type: str
    budget: float
    guest_count: int
    notes: Optional[str] = None

class JewelryBudgetRequest(BaseModel):
    budget: float
    notes: str

# Local In-Memory History Storage
history_db = []

@app.get("/")
def read_root():
    return {"status": "success", "message": "PocketSmart AI Backend Running"}

@app.post("/api/plan/home")
def plan_home_interior(data: HomeBudgetRequest):
    if data.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than zero")
    
    lights_cost = round(data.budget * 0.20, 2)
    fans_cost = round(data.budget * 0.25, 2)
    furniture_cost = round(data.budget * 0.45, 2)
    contingency = round(data.budget * 0.10, 2)

    result = {
        "title": "Home Interior Allocation",
        "total_budget": data.budget,
        "breakdown": [
            {"category": f"Lighting ({data.lights} units)", "amount": lights_cost},
            {"category": f"Fans & Ventilation ({data.fans} units)", "amount": fans_cost},
            {"category": f"Furniture ({data.furniture} items)", "amount": furniture_cost},
            {"category": "Contingency / Savings", "amount": contingency}
        ],
        "suggestion": "Consider purchasing items during major e-commerce sales for extra discounts."
    }
    
    save_history("Home Interior", data.budget)
    return result

@app.post("/api/plan/party")
def plan_party(data: PartyBudgetRequest):
    if data.budget <= 0 or data.guest_count <= 0:
        raise HTTPException(status_code=400, detail="Invalid budget or guest count")

    catering = round(data.budget * 0.50, 2)
    venue = round(data.budget * 0.30, 2)
    decor = round(data.budget * 0.20, 2)
    per_guest = round(catering / data.guest_count, 2)

    result = {
        "title": f"Party Plan ({data.event_type})",
        "total_budget": data.budget,
        "guest_count": data.guest_count,
        "breakdown": [
            {"category": f"Catering & Food (~₹{per_guest}/guest)", "amount": catering},
            {"category": "Venue & Sound System", "amount": venue},
            {"category": "Decorations & Balloons", "amount": decor}
        ]
    }

    save_history(f"Party ({data.event_type})", data.budget)
    return result

@app.post("/api/plan/jewelry")
def plan_jewelry(data: JewelryBudgetRequest):
    if data.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than zero")

    necklace = round(data.budget * 0.55, 2)
    earrings = round(data.budget * 0.30, 2)
    bangles = round(data.budget * 0.15, 2)

    result = {
        "title": "Jewelry Styling Recommendation",
        "total_budget": data.budget,
        "style_notes": data.notes,
        "breakdown": [
            {"category": "Necklace Set", "amount": necklace},
            {"category": "Earrings / Jhumkas", "amount": earrings},
            {"category": "Bangles & Accessories", "amount": bangles}
        ]
    }

    save_history("Jewelry Purchase", data.budget)
    return result

@app.get("/api/history")
def get_history():
    return history_db

def save_history(plan_type: str, amount: float):
    record = {
        "id": len(history_db) + 1,
        "type": plan_type,
        "amount": amount,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    history_db.insert(0, record)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
