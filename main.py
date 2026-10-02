from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="PocketSmart AI API", version="1.0.0")

# CORS Setup - Frontend connect aaga
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # GitHub Pages matrum local testings ku allow pannum
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class HomeDecorRequest(BaseModel):
    budget: float
    num_lights: Optional[int] = 0
    num_fans: Optional[int] = 0
    num_furniture: Optional[int] = 0
    notes: Optional[str] = ""

class PartyRequest(BaseModel):
    event_type: str
    budget: float
    guest_count: int
    notes: Optional[str] = ""

class JewelryRequest(BaseModel):
    budget: float
    notes: str

# Endpoints
@app.get("/")
def read_root():
    return {"message": "PocketSmart AI Backend is Running Successfully!"}

@app.post("/recommend/home-decor")
def recommend_home_decor(req: HomeDecorRequest):
    try:
        total = req.budget
        breakdown = [
            {
                "category": f"Lighting Setup ({req.num_lights} Lights)",
                "allocated_amount": round(total * 0.25, 2),
                "items": ["Smart LED Bulbs & Warm White Strips"]
            },
            {
                "category": f"Fans & Airflow ({req.num_fans} Fans)",
                "allocated_amount": round(total * 0.35, 2),
                "items": ["BLDC Energy Saving Ceiling Fans"]
            },
            {
                "category": f"Furniture Essentials ({req.num_furniture} Items)",
                "allocated_amount": round(total * 0.40, 2),
                "items": ["Minimalist Wooden Furniture Essentials"]
            }
        ]
        return {
            "status": "success",
            "domain": "Home Interior",
            "data": {
                "total_budget": total,
                "budget_breakdown": breakdown
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/party")
def recommend_party(req: PartyRequest):
    try:
        total = req.budget
        breakdown = [
            {
                "category": "Catering & Refreshments",
                "allocated_amount": round(total * 0.55, 2),
                "items": [f"Buffet meals for {req.guest_count} guests"]
            },
            {
                "category": "Venue & Decoration",
                "allocated_amount": round(total * 0.30, 2),
                "items": ["Theme Balloon Arch & Sound Setup"]
            },
            {
                "category": "Cake & Return Gifts",
                "allocated_amount": round(total * 0.15, 2),
                "items": ["Custom Birthday Cake & Gift Favors"]
            }
        ]
        return {
            "status": "success",
            "domain": "Party Package",
            "data": {
                "event_type": req.event_type,
                "guest_count": req.guest_count,
                "budget_breakdown": breakdown
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/jewelry")
def recommend_jewelry(req: JewelryRequest):
    try:
        total = req.budget
        recommendations = [
            f"Curated Antique Gold Finish Matching Set under ₹{total}",
            "Recommended Brands: CaratLane, Tanishq, and Fine Jewelry collections",
            "Set includes: Matching Neckpiece, Earrings, and Bangles"
        ]
        return {
            "status": "success",
            "domain": "Jewelry Stylist",
            "data": {
                "total_budget": total,
                "recommendations": recommendations
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
