import { create } from "zustand";
import { RgpPoint, RgpMeta, ObjectData } from "./parseRgpFile";

type RgpState = {
  fileName: string | null;
  fileContent: string | null;
  parsedData: RgpPoint[] | null;
  meta: RgpMeta | null;
  objectData: ObjectData | null; // <-- AGGIUNGI QUI
  setRgpData: (
    fileName: string,
    fileContent: string,
    parsedData: RgpPoint[],
    meta: RgpMeta,
    objectData: ObjectData // <-- AGGIUNGI QUI
  ) => void;
  clearRgp: () => void;
};

export const useRgpStore = create<RgpState>((set) => ({
  fileName: null,
  fileContent: null,
  parsedData: null,
  meta: null,
  objectData: null, // <-- AGGIUNGI QUI
  setRgpData: (fileName, fileContent, parsedData, meta, objectData) =>
    set({ fileName, fileContent, parsedData, meta, objectData }),
  clearRgp: () =>
    set({ fileName: null, fileContent: null, parsedData: null, meta: null, objectData: null }),
}));
