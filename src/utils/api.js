/**
 * api.js — Frontend API client for The BrandHelper server
 * Place this in src/utils/api.js
 *
 * Set VITE_API_URL in your .env:
 *   VITE_API_URL=https://your-server.onrender.com
 *   (for local dev: VITE_API_URL=http://localhost:4000)
 *
 * Set VITE_ADMIN_SECRET in your .env (keep private, never commit):
 *   VITE_ADMIN_SECRET=your_very_long_secret_key_here
 */

const BASE_URL    = import.meta.env.VITE_API_URL    || 'http://localhost:4000';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '';

// ── Shared fetch helper ───────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }

  return data;
}

// ── Admin header helper ───────────────────────────────────────────────────────
function adminHeaders() {
  return { 'X-Admin-Secret': ADMIN_SECRET };
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch all projects — public */
export async function getProjects() {
  const res = await apiFetch('/api/projects');
  return res.data;
}

/** Create a project — admin */
export async function createProject(project) {
  return apiFetch('/api/projects', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(project),
  });
}

/** Update a project — admin */
export async function updateProject(id, fields) {
  return apiFetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(fields),
  });
}

/** Delete a project — admin */
export async function deleteProject(id) {
  return apiFetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// LEADS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Submit a lead — called from all three forms
 * Works alongside EmailJS + Google Sheets (all three fire together)
 */
export async function submitLead(payload) {
  return apiFetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Get all leads — admin */
export async function getLeads(status = null) {
  const qs = status ? `?status=${status}` : '';
  return apiFetch(`/api/leads${qs}`, {
    headers: adminHeaders(),
  });
}

/** Update lead status — admin */
export async function updateLeadStatus(id, status) {
  return apiFetch(`/api/leads/${id}/status`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  });
}

/** Delete a lead — admin */
export async function deleteLead(id) {
  return apiFetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════════

export async function getStats() {
  return apiFetch('/api/stats', { headers: adminHeaders() });
}