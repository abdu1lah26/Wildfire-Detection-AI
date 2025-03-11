// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

// ✅ Replace with your Firebase project config
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
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ✅ Handle Background Notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
