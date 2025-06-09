export interface ObjectData {
  measurementNo?: string;
  idNumber?: string;
  drillingDepth?: string;
  date?: string;
  time?: string;
  feed?: string;
  speed?: string;
  diameter?: string;
  needleState?: string;
  tilt?: string;
  offset?: string;
  avgCurve?: string;
  level?: string;
  direction?: string;
  species?: string;
  location?: string;
  name?: string;
}

export interface RgpMeta {
  drillingDepth: number; // in cm
}

export interface RgpPoint {
  depth: number;        // in cm
  amplitude: number;    // drill value (resistenza/ampiezza)
  feed?: number;        // valore feed associato (può essere opzionale)
}

export interface RgpParsed {
  meta: RgpMeta;
  data: RgpPoint[];
  objectData?: ObjectData;
}



export function parseRgpFile(fileContent: string) {
  let drillingDepthCm = 0;
  let json: any = {};

  try {
    json = JSON.parse(fileContent);
  } catch {
    // Se non è JSON, lascia json vuoto (fall-back regex sotto)
  }

  // Prima, prova dal JSON (preferito)
  drillingDepthCm =
    json?.header?.depthMsmt ??
    json?.header?.deviceLength ??
    json?.header?.depthPresel ??
    drillingDepthCm;

  // Poi (solo se non trovato) fallback regex su testo puro:
  if (!drillingDepthCm) {
    const keys = [
      /"deviceLength"\s*:\s*([0-9.,]+)/i,
      /"depthMsmt"\s*:\s*([0-9.,]+)/i,
      /"depthPresel"\s*:\s*([0-9.,]+)/i,
      /Drilling depth\s*:\s*([0-9.,]+)/i,
    ];
    for (const regex of keys) {
      const match = fileContent.match(regex);
      if (match) {
        drillingDepthCm = parseFloat(match[1].replace(",", "."));
        break;
      }
    }
  }

  // *** Estrai drill dal JSON (meglio) ***
  let drillArray: number[] = [];
  let feedArray: number[] = []; // <--- AGGIUNGI QUESTA RIGA

  if (json?.profile?.drill && Array.isArray(json.profile.drill)) {
    drillArray = json.profile.drill;

    if (json.profile.feed && Array.isArray(json.profile.feed)) {
      feedArray = json.profile.feed;
    }

  } else {
    // fallback per file non JSON (usa regex come prima)
    const drillMatch = fileContent.match(/"drill"\s*:\s*\[([\s\S]*?)\]/);
    drillArray = drillMatch
      ? drillMatch[1]
          .replace(/\s+/g, "")
          .split(",")
          .filter((v) => v.length > 0)
          .map((v) => parseFloat(v.replace(",", ".")))
          .filter((v) => !isNaN(v))
      : [];

       // feed fallback
    const feedMatch = fileContent.match(/"feed"\s*:\s*\[([\s\S]*?)\]/);
    feedArray = feedMatch
      ? feedMatch[1]
          .replace(/\s+/g, "")
          .split(",")
          .filter((v) => v.length > 0)
          .map((v) => parseFloat(v.replace(",", ".")))
          .filter((v) => !isNaN(v))
      : [];
  }

  const n = drillArray.length;
  const data = drillArray.map((amplitude, i) => ({
    depth: n > 1 ? parseFloat(((drillingDepthCm * i) / (n - 1)).toFixed(2)) : 0,
    amplitude,    feed: feedArray[i] ?? null, // feed per ogni punto, null se mancante

  }));

  // DEBUG: log profondità trovata
  console.log("drillingDepthCm estratto:", drillingDepthCm);

  return {
    meta: { drillingDepth: drillingDepthCm },
    data,
    objectData: extractObjectData(fileContent, json),
  };
}

function extractObjectData(fileContent: string, json: any): ObjectData {
  const h = json?.header || {};

  // Componi date e time in formato leggibile
  const date =
    h.dateYear && h.dateMonth && h.dateDay
      ? `${h.dateYear}-${String(h.dateMonth).padStart(2, "0")}-${String(h.dateDay).padStart(2, "0")}`
      : "";
  const time =
    h.timeHour !== undefined && h.timeMinute !== undefined && h.timeSecond !== undefined
      ? `${String(h.timeHour).padStart(2, "0")}:${String(h.timeMinute).padStart(2, "0")}:${String(h.timeSecond).padStart(2, "0")}`
      : "";

  return {
    measurementNo: h.number?.toString() ?? "",
    idNumber: h.idNumber ?? "",
    drillingDepth: h.depthMsmt?.toString() ?? h.deviceLength?.toString() ?? h.depthPresel?.toString() ?? "",
    date,
    time,
    feed: h.speedFeed?.toString() ?? "",
    speed: h.speedDrill?.toString() ?? "",
    diameter: h.diameter?.toString() ?? "",
    needleState: "", // non presente nella porzione, puoi aggiungere se c'è
    tilt: h.tiltAngle?.toString() ?? "",
    offset: h.offsetDrill?.toString() ?? "",
    avgCurve: "", // aggiungi se hai una chiave per questa
    level: "",    // aggiungi se hai una chiave per questa
    direction: "", // aggiungi se hai una chiave per questa
    species: "", // aggiungi se hai una chiave per questa
    location: h.remark ?? "",
    name: "", // aggiungi se hai una chiave per questa
  };
}
