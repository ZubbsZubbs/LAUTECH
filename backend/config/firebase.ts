import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin';

// Check if Firebase credentials are available
const hasFirebaseCredentials = process.env.DOMAIN_FIREBASE_PROJECT_ID && 
  process.env.DOMAIN_FIREBASE_PRIVATE_KEY && 
  process.env.DOMAIN_FIREBASE_CLIENT_EMAIL;

let firebaseApp;
let auth;

if (hasFirebaseCredentials) {
  const serviceAccount = {
    type: process.env.DOMAIN_FIREBASE_TYPE,
    project_id: process.env.DOMAIN_FIREBASE_PROJECT_ID,
    private_key_id: process.env.DOMAIN_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.DOMAIN_FIREBASE_PRIVATE_KEY
      ? process.env.DOMAIN_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n') // Replace escaped newlines
      : undefined,
    client_email: process.env.DOMAIN_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.DOMAIN_FIREBASE_CLIENT_ID,
    auth_uri: process.env.DOMAIN_FIREBASE_AUTH_URI,
    token_uri: process.env.DOMAIN_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.DOMAIN_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.DOMAIN_FIREBASE_CLIENT_X509_CERT_URL,
  };

  try {
    firebaseApp = initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
    auth = getAuth(firebaseApp);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error instanceof Error ? error.message : 'Unknown error');
    auth = null;
  }
} else {
  console.warn('⚠️ Firebase credentials not found. Firebase features will be disabled.');
  auth = null;
}

export { auth };