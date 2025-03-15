import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import threading
import random
import json

app = FastAPI()

# ✅ Enable CORS (Allow Frontend to Access Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load Firebase Admin Credentials from Render's Environment Variable
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

if FIREBASE_CREDENTIALS:
    cred_dict = json.loads(FIREBASE_CREDENTIALS)  # ✅ Convert JSON string to dictionary
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)
    db = firestore.client()  # ✅ Initialize Firestore
    print("✅ Firebase Admin SDK initialized successfully!")
else:
    print("⚠️ Warning: Firebase credentials not found! Firestore won't work.")
    db = None  # Avoid using an undefined variable

# ✅ Root Endpoint
@app.get("/")
def home():
    return {"message": "🔥 Wildfire API is running!"}

# ✅ Wildfire Data Endpoint (Fetch from Firestore)
@app.get("/wildfire")
def get_wildfire_data():
    if not db:
        raise HTTPException(status_code=500, detail="🔥 Firestore is not initialized.")

    try:
        fires_ref = db.collection("wildfires").stream()
        fires = [{"id": fire.id, **fire.to_dict()} for fire in fires_ref]
        return {"fires": fires}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔥 Error fetching wildfire data: {str(e)}")

# ✅ Function to Simulate Real-Time Wildfire Updates
def simulate_wildfire_updates():
    if not db:
        print("⚠️ Firestore is not initialized. Skipping updates.")
        return

    while True:
        try:
            fires_ref = db.collection("wildfires").stream()
            for fire in fires_ref:
                fire_data = fire.to_dict()

                # ✅ Simulating fire spread & containment updates
                new_acres_burned = fire_data["acresBurned"] + random.randint(10, 150)

                # ✅ Randomly adjust containment (keep some fires active)
                if fire_data["containment"] < 90:
                    new_containment = min(fire_data["containment"] + random.randint(1, 15), 100)
                else:
                    new_containment = 100

                # ✅ Update status based on containment
                new_status = (
                    "Contained" if new_containment >= 90 else 
                    "Controlled" if new_containment >= 50 else 
                    "Active"
                )

                # ✅ Update Firestore
                db.collection("wildfires").document(fire.id).update({
                    "acresBurned": new_acres_burned,
                    "containment": new_containment,
                    "status": new_status
                })

            print("✅ Firestore wildfires updated!")
        except Exception as e:
            print(f"🔥 Error updating Firestore: {str(e)}")
        
        time.sleep(10)  # ✅ Update every 10 seconds

# ✅ Start Firestore Update Simulation in Background
if db:  # Only start if Firestore is initialized
    threading.Thread(target=simulate_wildfire_updates, daemon=True).start()
