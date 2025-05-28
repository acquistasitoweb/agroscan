"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-12 flex flex-col items-center max-w-xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 tracking-tight">
          AgroScan
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Analizza in pochi secondi la densità e la salute del legno.<br />
          Carica i dati delle tue misurazioni, visualizza grafici e scarica report professionali in PDF.<br />
          <span className="font-semibold text-blue-600">Accedi e prova ora!</span>
        </p>
        <button
          className="px-8 py-3 rounded-lg bg-blue-700 text-white text-lg font-semibold shadow hover:bg-blue-800 transition"
          onClick={() => router.push("/login")}
        >
          Accedi
        </button>
      </div>
    </div>
  );
}
