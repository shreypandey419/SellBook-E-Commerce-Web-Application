import admin from "firebase-admin";

let initialized = false;

const getFirebaseAdmin = () => {
  if (!initialized) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccount) throw new Error("Firebase authentication is not configured.");
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(serviceAccount)) });
    initialized = true;
  }
  return admin;
};

export const verifyFirebaseToken = async (idToken) => getFirebaseAdmin().auth().verifyIdToken(idToken);
