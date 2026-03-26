/**
 * api.js — Frontend API client for The BrandHelper CRM
 * Place in: src/utils/api.js
 *
 * .env.local:
 *   VITE_API_URL=https://your-server.onrender.com
 *   VITE_ADMIN_SECRET=your_secret
 */

const BASE    = import.meta.env.VITE_API_URL     || 'http://localhost:4000';
const SECRET  = import.meta.env.VITE_ADMIN_SECRET || '';

async function req(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API ${res.status}`);
  return data;
}

const A = () => ({ 'X-Admin-Secret': SECRET }); // admin headers

// ── LEADS ─────────────────────────────────────────────────────────────────────
export const getLeads        = (status)  => req(`/api/leads${status ? `?status=${status}` : ''}`, { headers: A() });
export const getLead         = (id)      => req(`/api/leads/${id}`, { headers: A() });
export const createLead      = (body)    => req('/api/leads', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const submitLead      = (body)    => req('/api/leads', { method: 'POST', body: JSON.stringify(body) }); // public
export const updateLead      = (id, b)   => req(`/api/leads/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteLead      = (id)      => req(`/api/leads/${id}`, { method: 'DELETE', headers: A() });
export const convertLead     = (id)      => req(`/api/leads/${id}/convert`, { method: 'POST', headers: A() });
export const updateLeadStatus = (id, status) => updateLead(id, { status });

// ── CLIENTS ───────────────────────────────────────────────────────────────────
export const getClients   = (status) => req(`/api/clients${status ? `?status=${status}` : ''}`, { headers: A() });
export const getClient    = (id)     => req(`/api/clients/${id}`, { headers: A() });
export const createClient = (body)   => req('/api/clients', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateClient = (id, b)  => req(`/api/clients/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteClient = (id)     => req(`/api/clients/${id}`, { method: 'DELETE', headers: A() });

// ── PROJECTS ──────────────────────────────────────────────────────────────────
export const getProjects    = (params) => req(`/api/projects${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const getProject     = (id)     => req(`/api/projects/${id}`, { headers: A() });
export const createProject  = (body)   => req('/api/projects', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateProject  = (id, b)  => req(`/api/projects/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteProject  = (id)     => req(`/api/projects/${id}`, { method: 'DELETE', headers: A() });

// ── MILESTONES ────────────────────────────────────────────────────────────────
export const addMilestone    = (projectId, body) => req(`/api/projects/${projectId}/milestones`, { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateMilestone = (id, b)           => req(`/api/milestones/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const toggleMilestone = (id)              => req(`/api/milestones/${id}/toggle`, { method: 'PATCH', headers: A() });
export const deleteMilestone = (id)              => req(`/api/milestones/${id}`, { method: 'DELETE', headers: A() });

// ── MEETINGS ──────────────────────────────────────────────────────────────────
export const getMeetings   = (params) => req(`/api/meetings${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const createMeeting = (body)   => req('/api/meetings', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateMeeting = (id, b)  => req(`/api/meetings/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteMeeting = (id)     => req(`/api/meetings/${id}`, { method: 'DELETE', headers: A() });

// ── NOTES ─────────────────────────────────────────────────────────────────────
export const getNotes   = (params) => req(`/api/notes${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const createNote = (body)   => req('/api/notes', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const deleteNote = (id)     => req(`/api/notes/${id}`, { method: 'DELETE', headers: A() });

// ── QUOTES ────────────────────────────────────────────────────────────────────
export const getQuotes   = ()       => req('/api/quotes', { headers: A() });
export const getQuote    = (id)     => req(`/api/quotes/${id}`, { headers: A() });
export const createQuote = (body)   => req('/api/quotes', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateQuote = (id, b)  => req(`/api/quotes/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteQuote = (id)     => req(`/api/quotes/${id}`, { method: 'DELETE', headers: A() });

// ── REMINDERS ─────────────────────────────────────────────────────────────────
export const getReminders      = (all)  => req(`/api/reminders${all ? '?all=true' : ''}`, { headers: A() });
export const createReminder    = (body) => req('/api/reminders', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateReminder    = (id,b) => req(`/api/reminders/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const completeReminder  = (id)   => req(`/api/reminders/${id}/complete`, { method: 'PATCH', headers: A() });
export const deleteReminder    = (id)   => req(`/api/reminders/${id}`, { method: 'DELETE', headers: A() });

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
export const getPortfolio      = ()      => req('/api/portfolio');  // public
export const createPortfolio   = (body)  => req('/api/portfolio', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updatePortfolio   = (id, b) => req(`/api/portfolio/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deletePortfolio   = (id)    => req(`/api/portfolio/${id}`, { method: 'DELETE', headers: A() });

// ── STATS ─────────────────────────────────────────────────────────────────────
export const getStats = () => req('/api/stats', { headers: A() });