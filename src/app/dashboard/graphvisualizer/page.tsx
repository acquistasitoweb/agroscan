"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer, 
  Legend,
} from "recharts";
import { useRgpStore } from "@/store/useRgpStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GraphVisualizer() {
  const router = useRouter();
  const { parsedData, fileName, objectData } = useRgpStore();
  const exportRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (!parsedData?.length) router.push("/dashboard/upload");
  }, [parsedData, router]);

  if (!parsedData?.length) return null;


const handleDownloadPdf = async () => {
  if (!exportRef.current) return;

  // 1. Salva le vecchie variabili
  const root = document.documentElement;
  const oldVars: Record<string, string> = {};

  // 2. Cicla TUTTE le variabili e sostituisci le oklch
  for (const style of Array.from(root.style)) {
    oldVars[style] = root.style.getPropertyValue(style);
    // Sostituisci tutte le variabili che contengono "oklch" con #fff o #111
    if (root.style.getPropertyValue(style).includes("oklch")) {
      root.style.setProperty(style, "#fff");
    }
  }
  // In ogni caso, setta anche i classici
  root.style.setProperty('--background', '#fff');
  root.style.setProperty('--foreground', '#111');
  root.style.setProperty('--muted', '#e5e7eb');
  root.style.setProperty('--card', '#fff');
  root.style.setProperty('--primary', '#111');
  root.style.setProperty('--primary-foreground', '#fff');
  root.style.setProperty('--secondary', '#ccc');
  root.style.setProperty('--secondary-foreground', '#111');
  
  exportRef.current.classList.add("export-pdf-forced");
  await new Promise((resolve) => setTimeout(resolve, 20));

  try {
    const canvas = await html2canvas(exportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("report.pdf");
  } finally {
    // Ripristina le vecchie variabili di root
    for (const style in oldVars) {
      root.style.setProperty(style, oldVars[style]);
    }
    exportRef.current.classList.remove("export-pdf-forced");
  }
};

  return (
    <div ref={exportRef} style={{ background: "#fff", color: "#111" }}>
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-2">

      {/* TABELLA DATI E BOTTONI */}
      <div className="w-full max-w-5xl mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Misurazione / Dati oggetto</h1>
          <Button variant="default" onClick={handleDownloadPdf}>
            Scarica PDF
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-2 border p-4 rounded bg-gray-50 text-sm">
          <div><b>Measurement no.</b>: {objectData?.measurementNo}</div>
          <div><b>Speed</b>: {objectData?.speed}</div>
          <div><b>Diameter</b>: {objectData?.diameter}</div>
          <div><b>ID number</b>: {objectData?.idNumber}</div>
          <div><b>Drilling depth</b>: {objectData?.drillingDepth}</div>
          <div><b>Level</b>: {objectData?.level}</div>
          <div><b>Date</b>: {objectData?.date}</div>
          <div><b>Direction</b>: {objectData?.direction}</div>
          <div><b>Time</b>: {objectData?.time}</div>
          <div><b>Species</b>: {objectData?.species}</div>
          <div><b>Feed</b>: {objectData?.feed}</div>
          <div><b>Location</b>: {objectData?.location}</div>
          <div><b>Needle state</b>: {objectData?.needleState}</div>
          <div><b>Name</b>: {objectData?.name}</div>
          <div><b>Tilt</b>: {objectData?.tilt}</div>
          <div><b>Offset</b>: {objectData?.offset}</div>
          <div><b>Avg. curve</b>: {objectData?.avgCurve}</div>
        </div>
      </div>

      


      {/* GRAFICO */}
<Card className="w-full max-w-7xl shadow border mt-4">
  <CardHeader>
    <CardTitle>Profilo Penetrazione: Resistenza & Feed</CardTitle>
    {fileName && (
      <div className="text-xs text-gray-500 mb-1">
        <b>File:</b> {fileName}
      </div>
    )}
  </CardHeader>
  <CardContent className="h-[340px] bg-white">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={parsedData}
        margin={{ top: 10, right: 40, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="depth"
          type="number"
          domain={[0, 40]}
          ticks={[...Array(21).keys()].map(i => i * 2)}
          label={{
            value: "Profondità di penetrazione [cm]",
            position: "insideBottomRight",
            offset: -10,
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
        <YAxis
          domain={[0, 100]}
          label={{
            value: "Resistenza [%] / Feed",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "Resistenza (drill)") return [`${value} %`, "Resistenza"];
            if (name === "Feed") return [value, "Feed"];
            return [value, name];
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Area
          type="monotone"
          dataKey="amplitude"
          name="Resistenza (drill)"
          stroke="#2563eb"
          fill="#60a5fa"
          fillOpacity={0.22}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="feed"
          name="Feed"
          stroke="#f59e42"
          fill="#fbbf24"
          fillOpacity={0.17}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


      </div>
    </div>
  );
}
