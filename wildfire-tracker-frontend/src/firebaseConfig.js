import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDIYK-oils-R8g_CdBCk5rcaAawXJ84dNM",
    authDomain: "wildfire-tracker-ca6a1.firebaseapp.com",
    projectId: "wildfire-tracker-ca6a1",
    storageBucket: "wildfire-tracker-ca6a1.appspot.com",
    messagingSenderId: "211253688106",
    appId: "1:211253688106:web:b17fe12b5d9d2151e55053",
    measurementId: "G-FF4VGYVN1R"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app); // ✅ Initialize Firestore

// ✅ Request Permission for Notifications & Get Token
export const requestNotificationPermission = async () => {
  try {
    console.log("📡 Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("📡 Permission result:", permission);

    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      const token = await getToken(messaging, { vapidKey: "BG6jxXQb7WNuHjxfV1WIDirTvGVpQHSoV3_3T33ZmV6tFE5ys-E_QUAAFf0Vyx8aUfNP7eyDLqZqbS5ciEnaEUo" });
      if (token) {
        console.log("✅ FCM Token:", token);
        return token;
      } else {
        console.warn("⚠️ No FCM token received.");
      }
    } else {
      console.warn("⚠️ Notification permission denied.");
    }
  } catch (error) {
    console.error("🔥 Error getting FCM token:", error);
  }
};

// ✅ Listen for Incoming Notifications
onMessage(messaging, (payload) => {
  console.log("🔔 Notification received:", payload);
  alert(`🔥 ${payload.notification.title}: ${payload.notification.body}`);
});

export { db };
