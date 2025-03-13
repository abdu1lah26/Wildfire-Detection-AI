import firebase_admin
from firebase_admin import messaging, credentials, firestore
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import threading
import random

app = FastAPI()

# ✅ Enable CORS (Allow Frontend & Backend Communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wildfire-tracker-ca6a1.web.app", "https://wildfire-tracker-backend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load Firebase Admin Credentials
FIREBASE_CREDENTIALS_PATH = "serviceAccountKey.json"

if os.path.exists(FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()  # ✅ Initialize Firestore
    print("✅ Firebase Admin SDK initialized successfully!")
else:
    print("⚠️ Warning: Firebase credentials not found! Firestore won't work.")

# ✅ Root Endpoint
@app.get("/")
def home():
    return {"message": "🔥 Wildfire API is running!"}

# ✅ Wildfire Data Endpoint (Fetch from Firestore)
@app.get("/wildfire")
def get_wildfire_data():
    try:
        fires_ref = db.collection("wildfires").stream()
        fires = [fire.to_dict() for fire in fires_ref]
        return {"fires": fires}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔥 Error fetching wildfire data: {str(e)}")

# ✅ Function to Send Notification to a Specific Device
@app.post("/send-notification/")
async def send_notification(token: str, title: str, body: str):
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized. Check credentials.")

    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=token  # ✅ Send to a specific device instead of a topic
        )
        response = messaging.send(message)
        return {"message": "✅ Notification Sent!", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔥 Failed to send notification: {str(e)}")

# ✅ Function to Simulate Real-Time Firestore Updates
def simulate_wildfire_updates():
    while True:
        try:
            fires_ref = db.collection("wildfires").stream()
            for fire in fires_ref:
                fire_data = fire.to_dict()

                # ✅ Simulating fire spread & containment updates
                new_acres_burned = fire_data["acresBurned"] + random.randint(10, 100)
                new_containment = min(fire_data["containment"] + random.randint(0, 5), 100)

                db.collection("wildfires").document(fire.id).update({
                    "acresBurned": new_acres_burned,
                    "containment": new_containment
                })

            print("✅ Firestore wildfires updated!")
        except Exception as e:
            print(f"🔥 Error updating Firestore: {str(e)}")
        
        time.sleep(10)  # ✅ Update Firestore every 10 seconds

# ✅ Start Firestore Update Simulation in Background
threading.Thread(target=simulate_wildfire_updates, daemon=True).start()
