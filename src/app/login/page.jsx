'use client';

// Questa direttiva dice a Next.js che questo componente va renderizzato SOLO lato client.
// Serve perché usi hook React e manipoli lo stato (non puoi farlo nei componenti "server").

import { useState } from "react"; // Importa l'hook "useState" di React, che serve a gestire stato locale del componente.
import { signInWithEmailAndPassword } from "firebase/auth";// Importa la funzione di Firebase Auth che esegue il login usando email e password.
import { auth } from "@/firebaseConfig";// Importa l'oggetto di autenticazione Firebase, già inizializzato nella tua config.




// Definisci il componente React "LoginPage".
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");




// Funzione che gestisce il login quando l'utente invia il form.
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };
  


  // Render della pagina:
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="mb-4 text-xl font-bold">Login</h2>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border w-full rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border w-full rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
      </form>
    </div>
  );
}
