import { classes } from "./data.js";

const config = window.SPORT_DAY_CONFIG || {};
const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
const supabaseAnonKey = String(config.supabaseAnonKey || "");
const syncTimers = new Map();

export function cloudIsConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function headers(extra = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function revisionKey(classId) {
  return `sport-day-cloud-revision-${classId}`;
}

function collectState(classId) {
  const classData = classes[classId];
  const results = {};
  const stationTimers = {};
  for (const stationId of classData.route) {
    const result = readJson(`sport-day-result-${classId}-${stationId}`, null);
    const stationTimer = readJson(`sport-day-station-timer-${classId}-${stationId}`, null);
    if (result !== null) results[stationId] = result;
    if (stationTimer !== null) stationTimers[stationId] = stationTimer;
  }
  return {
    progress: Number(localStorage.getItem(`sport-day-progress-${classId}`) || 0),
    complete: localStorage.getItem(`sport-day-complete-${classId}`) === "true",
    timer: readJson(`sport-day-timer-${classId}`, { running: false, startedAt: null, elapsed: 0 }),
    results,
    stationTimers
  };
}

function applyState(classId, state) {
  localStorage.setItem(`sport-day-progress-${classId}`, String(state.progress || 0));
  localStorage.setItem(`sport-day-complete-${classId}`, String(Boolean(state.complete)));
  localStorage.setItem(`sport-day-timer-${classId}`, JSON.stringify(state.timer || { running: false, startedAt: null, elapsed: 0 }));
  for (const stationId of classes[classId].route) {
    const result = state.results?.[stationId];
    const stationTimer = state.stationTimers?.[stationId];
    if (result === undefined) localStorage.removeItem(`sport-day-result-${classId}-${stationId}`);
    else localStorage.setItem(`sport-day-result-${classId}-${stationId}`, JSON.stringify(result));
    if (stationTimer === undefined) localStorage.removeItem(`sport-day-station-timer-${classId}-${stationId}`);
    else localStorage.setItem(`sport-day-station-timer-${classId}-${stationId}`, JSON.stringify(stationTimer));
  }
}

async function fetchRemote(classId) {
  if (!cloudIsConfigured()) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/sport_day_state?class_id=eq.${encodeURIComponent(classId)}&select=state,saved_at`, { headers: headers() });
  if (!response.ok) throw new Error(`Supabase read failed: ${response.status}`);
  const rows = await response.json();
  return rows[0] || null;
}

export async function pushClassState(classId) {
  if (!cloudIsConfigured() || !classes[classId]) return false;
  const revision = Number(localStorage.getItem(revisionKey(classId)) || Date.now());
  const response = await fetch(`${supabaseUrl}/rest/v1/sport_day_state?on_conflict=class_id`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({ class_id: classId, state: collectState(classId), saved_at: new Date(revision).toISOString() })
  });
  if (!response.ok) throw new Error(`Supabase write failed: ${response.status}`);
  return true;
}

export function markClassChanged(classId) {
  if (!classes[classId]) return;
  localStorage.setItem(revisionKey(classId), String(Date.now()));
  if (!cloudIsConfigured()) return;
  clearTimeout(syncTimers.get(classId));
  syncTimers.set(classId, setTimeout(() => pushClassState(classId).catch(console.error), 350));
}

export async function hydrateClass(classId) {
  if (!cloudIsConfigured() || !classes[classId]) return false;
  const remote = await fetchRemote(classId);
  const localRevision = Number(localStorage.getItem(revisionKey(classId)) || 0);
  if (!remote) {
    markClassChanged(classId);
    return false;
  }
  const remoteRevision = Date.parse(remote.saved_at) || 0;
  if (localRevision > remoteRevision) {
    await pushClassState(classId);
    return false;
  }
  applyState(classId, remote.state || {});
  localStorage.setItem(revisionKey(classId), String(remoteRevision));
  return true;
}

export async function refreshClassFromCloud(classId) {
  if (!cloudIsConfigured() || !classes[classId]) return false;
  const remote = await fetchRemote(classId);
  if (!remote) return false;
  const remoteRevision = Date.parse(remote.saved_at) || 0;
  const localRevision = Number(localStorage.getItem(revisionKey(classId)) || 0);
  if (remoteRevision <= localRevision) return false;
  applyState(classId, remote.state || {});
  localStorage.setItem(revisionKey(classId), String(remoteRevision));
  return true;
}
