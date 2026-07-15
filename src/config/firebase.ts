import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Substitua com suas credenciais do Firebase Console
// 1. Vá para https://console.firebase.google.com/
// 2. Crie um novo projeto
// 3. Adicione um app web
// 4. Copie as credenciais aqui
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Adicione o scope do Google Calendar
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
