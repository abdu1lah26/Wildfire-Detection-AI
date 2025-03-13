# 🔥 LA Wildfire Tracker

## 🌍 Problem Statement
Wildfires cause massive destruction, leading to loss of life, displacement, and severe environmental damage. Lack of real-time tracking and awareness makes it difficult to respond effectively. 

## 🚀 Solution
LA Wildfire Tracker is a real-time wildfire monitoring system that:
- Fetches live wildfire data from Firestore.
- Displays the latest fire incidents with severity levels.
- Provides data visualization with charts for easy understanding.
- Helps communities and officials take action quickly.

## 🛠 Features
✅ Real-time wildfire tracking from Firestore.
✅ Automatic updates without refreshing the page.
✅ Severity level predictions for different areas.
✅ Interactive graphs & data visualization.

## 🏆 Google Technologies Used
- **Firebase Firestore** → Real-time wildfire data storage.
- **FastAPI** → Backend API to fetch and process data.
- **Google Cloud** → Firestore hosting & data processing.
- **Material UI & Recharts** → Modern UI and graphs.

## 🎯 UN Sustainable Development Goals (SDGs) 
✅ SDG 13: Climate Action → Helps mitigate wildfire disasters by providing real-time data and awareness.
✅ SDG 15: Life on Land → Protects forests and biodiversity by tracking wildfire spread and enabling quicker response.

## 🔧 Installation & Setup
### 1️⃣ Clone the repository
```sh
 git clone https://github.com/abdu1lah26/Wildfire-Detection-AI.git
 cd Wildfire-Detection-AI
```
### 2️⃣ Install dependencies
#### Backend (FastAPI)
```sh
pip install -r requirements.txt
```
#### Frontend (React)
```sh
cd frontend
npm install
```
### 3️⃣ Set up Firebase
- Add your `serviceAccountKey.json` in the backend folder.
- Configure `firebaseConfig.js` in the frontend with your Firebase project details.

### 4️⃣ Run the backend (FastAPI)
```sh
uvicorn main:app --reload
```

### 5️⃣ Run the frontend (React)
```sh
npm start
```

## 📊 How It Works
1️⃣ Backend fetches wildfire data from Firestore.
2️⃣ Data is automatically updated and displayed in the frontend.
3️⃣ Fire severity levels are analyzed and visualized.

## 🔮 Future Improvements
- **AI-powered wildfire prediction using Vertex AI.**
- **Integration with Google Earth Engine for satellite wildfire tracking.**
- **User authentication for emergency responders.**

## 📩 Contact
For queries, contact: shakeelabdullah919@gmail.com

