// lib/resultsSaver.ts
import { db, auth } from "./firebase"; // adjust the path if needed: "../firebase"
import {
  collection, addDoc, serverTimestamp,
  doc, getDoc, query, where, orderBy, getDocs
} from "firebase/firestore";

export type SavedResult = {
  id: string;
  userId: string;
  takenAt: Date;
  scorePercentage: number;
  level: string;
  riskLevelText: string;
  version: string;
  userName?: string | null;
  sex?: string | null;
  dob?: string | null;
};

// -------- local fallback --------
const LS_KEY = "adhd_results_history_v1";
function saveLocal(item: SavedResult) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(LS_KEY);
  const arr: SavedResult[] = raw ? JSON.parse(raw) : [];
  if (!arr.find(x => x.id === item.id)) {
    arr.push(item);
    arr.sort((a,b) => +new Date(b.takenAt) - +new Date(a.takenAt));
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }
}
function getLocalById(id: string): SavedResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  const arr: SavedResult[] = JSON.parse(raw);
  return arr.find(x => x.id === id) ?? null;
}

// -------- save one --------
export async function saveReportCapture(
  input: Omit<SavedResult, "id" | "userId">
): Promise<{ id: string; usedLocal: boolean }> {
  const user = auth.currentUser;
  const takenAt = input.takenAt ?? new Date();
  const version = input.version ?? "v1.0";

  if (user?.uid) {
    const colRef = collection(db, "users", user.uid, "results");
    const docRef = await addDoc(colRef, {
      userId: user.uid,
      takenAt, // Date is fine; SDK converts to Timestamp
      scorePercentage: input.scorePercentage,
      level: input.level,
      riskLevelText: input.riskLevelText,
      version,
      userName: input.userName ?? null,
      sex: input.sex ?? null,
      dob: input.dob ?? null,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, usedLocal: false };
  }

  const localId = `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  saveLocal({
    id: localId,
    userId: "local",
    takenAt,
    scorePercentage: input.scorePercentage,
    level: input.level,
    riskLevelText: input.riskLevelText,
    version,
    userName: input.userName ?? null,
    sex: input.sex ?? null,
    dob: input.dob ?? null,
  });
  return { id: localId, usedLocal: true };
}

// -------- fetch one (for /results/[id]) --------
export async function fetchResultById(id: string): Promise<SavedResult | null> {
  const user = auth.currentUser;
  if (user?.uid) {
    const ref = doc(db, "users", user.uid, "results", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data: any = snap.data();
    return {
      id: snap.id,
      userId: data.userId,
      takenAt: data.takenAt?.toDate?.() ?? new Date(data.takenAt),
      scorePercentage: data.scorePercentage,
      level: data.level,
      riskLevelText: data.riskLevelText,
      version: data.version,
      userName: data.userName ?? null,
      sex: data.sex ?? null,
      dob: data.dob ?? null,
    };
  }
  return getLocalById(id);
}

// -------- fetch by day (for history) --------
export async function fetchResultsByDay(start: Date, end: Date): Promise<SavedResult[]> {
  const user = auth.currentUser;
  if (user?.uid) {
    const colRef = collection(db, "users", user.uid, "results");
    const q = query(
      colRef,
      where("takenAt", ">=", start),
      where("takenAt", "<=", end),
      orderBy("takenAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data: any = d.data();
      return {
        id: d.id,
        userId: data.userId,
        takenAt: data.takenAt?.toDate?.() ?? new Date(data.takenAt),
        scorePercentage: data.scorePercentage,
        level: data.level,
        riskLevelText: data.riskLevelText,
        version: data.version,
        userName: data.userName ?? null,
        sex: data.sex ?? null,
        dob: data.dob ?? null,
      };
    });
  }

  // local fallback
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return [];
  const arr: SavedResult[] = JSON.parse(raw);
  return arr.filter(r => {
    const t = new Date(r.takenAt).getTime();
    return t >= start.getTime() && t <= end.getTime();
  }).sort((a,b) => +new Date(b.takenAt) - +new Date(a.takenAt));
}
