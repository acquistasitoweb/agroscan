"use client";

import { useRef, useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { parseRgpFile } from "@/store/parseRgpFile";
import { useRgpStore } from "@/store/useRgpStore";

export default function DashboardUpload() {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Gestione drag and drop
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseRgpFile(content);
        useRgpStore.getState().setRgpData(
          file.name,
          content,
          parsed.data,
          parsed.meta,
          parsed.objectData // <--- AGGIUNGI QUESTO!

        );
        router.push("/dashboard/graphvisualizer");
      } catch {
        alert("Errore nel parsing. File non valido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">AgroScan</h1>
      <p className="mb-8 text-lg text-center max-w-lg">
        Carica il file <b>.rgp</b> generato dal tuo strumento di misura per visualizzare le informazioni.
      </p>
      <div
        className={`w-full max-w-md p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition ${
          dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        tabIndex={0}
      >
        <IconUpload className="w-10 h-10 text-blue-600 mb-3" />
        <span className="font-semibold mb-2">
          Trascina qui il file .rgp oppure clicca per selezionarlo
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".rgp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
