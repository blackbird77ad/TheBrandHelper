/**
 * api.js  -  Frontend API client for The BrandHelper CRM
 * Place in: src/utils/api.js
 *
 * .env.local:
 *   VITE_API_URL=https://your-server.onrender.com
 *   VITE_ADMIN_SECRET=your_secret
 */

const RAW_BASE = (import.meta.env.VITE_API_URL || '').trim();
const DEFAULT_BASE = import.meta.env.PROD ? 'https://thebrandhelper.onrender.com' : 'http://localhost:4000';
const BASE    = (RAW_BASE || DEFAULT_BASE).replace(/\/+$/, '');
const SECRET  = (import.meta.env.VITE_ADMIN_SECRET || '').trim();

export const API_BASE = BASE;
export const SUPPORT_PHONE = '+233 50 165 7205';
export const SUPPORT_EMAIL = 'davida@thebrandhelper.com';
export const SUPPORT_WHATSAPP = 'https://wa.me/233501657205';
export const SERVER_FALLBACK_TEXT = `The request could not reach The BrandHelper API. Please use WhatsApp (${SUPPORT_PHONE}) or email ${SUPPORT_EMAIL} while we check it.`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiRequestError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = details.status ?? null;
    this.statusText = details.statusText || '';
    this.url = details.url || API_BASE;
    this.method = details.method || 'GET';
    this.data = details.data || null;
    this.code = details.code || (details.isNetwork ? 'NETWORK_ERROR' : 'API_ERROR');
    this.isNetwork = Boolean(details.isNetwork);
    this.cause = details.cause;
  }
}

async function readResponseBody(res) {
  const text = await res.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function responseMessage(data, fallback) {
  return data?.error || data?.message || data?.raw || fallback;
}

export function describeApiError(error) {
  const statusCode = Number.isFinite(Number(error?.status)) ? Number(error.status) : null;
  const status = statusCode
    ? `HTTP ${statusCode}${error?.statusText ? ` ${error.statusText}` : ''}`
    : 'No response';

  return {
    status,
    statusCode,
    message: error?.message || SERVER_FALLBACK_TEXT,
    url: error?.url || API_BASE,
    method: error?.method || 'GET',
    code: error?.code || (error?.isNetwork ? 'NETWORK_ERROR' : 'API_ERROR'),
  };
}

export function isReportableApiIssue(error) {
  if (!error) return false;
  if (error.isNetwork) return true;
  const status = Number(error.status);
  return Number.isFinite(status) && status >= 500;
}

export function buildErrorReportText(context = 'Website request', error) {
  const details = describeApiError(error);
  const page = typeof window !== 'undefined' ? window.location.href : '';
  return [
    'The BrandHelper error report',
    `Context: ${context}`,
    `Status: ${details.status}`,
    `Code: ${details.code}`,
    `Message: ${details.message}`,
    `API: ${details.url}`,
    page ? `Page: ${page}` : '',
    `Time: ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n');
}

export function getWhatsAppReportHref(context, error, extraText = '') {
  const text = [extraText, buildErrorReportText(context, error)].filter(Boolean).join('\n\n');
  return `${SUPPORT_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function getEmailReportHref(context, error, extraText = '') {
  const details = describeApiError(error);
  const text = [extraText, buildErrorReportText(context, error)].filter(Boolean).join('\n\n');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Website API issue: ${details.status}`)}&body=${encodeURIComponent(text)}`;
}

export async function apiRequest(path, options = {}) {
  let res;
  const url = `${BASE}${path}`;
  const method = options.method || 'GET';
  const request = () => fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  try {
    res = await request();
  } catch {
    await wait(700);
    try {
      res = await request();
    } catch (error) {
      throw new ApiRequestError(SERVER_FALLBACK_TEXT, {
        isNetwork: true,
        url,
        method,
        cause: error,
      });
    }
  }
  const data = await readResponseBody(res);
  if (!res.ok) {
    let message = responseMessage(data, `API ${res.status}`);
    if (res.status === 401 && options.headers?.['X-Admin-Token'] !== undefined) {
      clearAdminSession();
      message = 'Admin session expired or was rejected. Please sign in again.';
    } else if (res.status === 401 && options.headers?.['X-Admin-Secret'] !== undefined) {
      message = SECRET
        ? 'Admin secret was rejected - check VITE_ADMIN_SECRET matches the backend ADMIN_SECRET'
        : 'Admin secret is missing - set VITE_ADMIN_SECRET for admin CRUD';
    }
    throw new ApiRequestError(message, {
      status: res.status,
      statusText: res.statusText,
      url,
      method,
      data,
      code: `HTTP_${res.status}`,
    });
  }
  return data;
}

async function req(path, options = {}) {
  return apiRequest(path, options);
}

export const ADMIN_TOKEN_KEY = 'tbh_admin_token';
const ADMIN_SESSION_KEYS = ['tbh_admin_session_v2', 'tbh_admin_session'];

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  ADMIN_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
}

function getAdminToken() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

const A = () => {
  const token = getAdminToken();
  if (token) return { 'X-Admin-Token': token };
  return { 'X-Admin-Secret': SECRET };
}; // admin headers

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });
}

// -- LEADS ---------------------------------------------------------------------
export const getLeads        = (status)  => req(`/api/leads${status ? `?status=${status}` : ''}`, { headers: A() });
export const getLead         = (id)      => req(`/api/leads/${id}`, { headers: A() });
export const createLead      = (body)    => req('/api/leads', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const submitLead      = (body)    => req('/api/leads', { method: 'POST', body: JSON.stringify(body) }); // public
export const updateLead      = (id, b)   => req(`/api/leads/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteLead      = (id)      => req(`/api/leads/${id}`, { method: 'DELETE', headers: A() });
export const convertLead     = (id)      => req(`/api/leads/${id}/convert`, { method: 'POST', headers: A() });
export const updateLeadStatus = (id, status) => updateLead(id, { status });

// -- CLIENTS -------------------------------------------------------------------
export const getClients   = (status) => req(`/api/clients${status ? `?status=${status}` : ''}`, { headers: A() });
export const getClient    = (id)     => req(`/api/clients/${id}`, { headers: A() });
export const createClient = (body)   => req('/api/clients', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateClient = (id, b)  => req(`/api/clients/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteClient = (id)     => req(`/api/clients/${id}`, { method: 'DELETE', headers: A() });

// -- PROJECTS ------------------------------------------------------------------
export const getProjects    = (params) => req(`/api/projects${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const getProject     = (id)     => req(`/api/projects/${id}`, { headers: A() });
export const createProject  = (body)   => req('/api/projects', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateProject  = (id, b)  => req(`/api/projects/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteProject  = (id)     => req(`/api/projects/${id}`, { method: 'DELETE', headers: A() });

// -- MILESTONES ----------------------------------------------------------------
export const addMilestone    = (projectId, body) => req(`/api/projects/${projectId}/milestones`, { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateMilestone = (id, b)           => req(`/api/milestones/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const toggleMilestone = (id)              => req(`/api/milestones/${id}/toggle`, { method: 'PATCH', headers: A() });
export const deleteMilestone = (id)              => req(`/api/milestones/${id}`, { method: 'DELETE', headers: A() });

// -- MEETINGS ------------------------------------------------------------------
export const getMeetings   = (params) => req(`/api/meetings${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const createMeeting = (body)   => req('/api/meetings', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateMeeting = (id, b)  => req(`/api/meetings/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteMeeting = (id)     => req(`/api/meetings/${id}`, { method: 'DELETE', headers: A() });

// -- NOTES ---------------------------------------------------------------------
export const getNotes   = (params) => req(`/api/notes${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const createNote = (body)   => req('/api/notes', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const deleteNote = (id)     => req(`/api/notes/${id}`, { method: 'DELETE', headers: A() });

// -- QUOTES --------------------------------------------------------------------
export const getQuotes   = ()       => req('/api/quotes', { headers: A() });
export const getQuote    = (id)     => req(`/api/quotes/${id}`, { headers: A() });
export const createQuote = (body)   => req('/api/quotes', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateQuote = (id, b)  => req(`/api/quotes/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const sendQuoteEmail = (id)  => req(`/api/quotes/${id}/send-email`, { method: 'POST', headers: A() });
export const deleteQuote = (id)     => req(`/api/quotes/${id}`, { method: 'DELETE', headers: A() });

// -- REMINDERS -----------------------------------------------------------------
export const getReminders      = (all)  => req(`/api/reminders${all ? '?all=true' : ''}`, { headers: A() });
export const createReminder    = (body) => req('/api/reminders', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateReminder    = (id,b) => req(`/api/reminders/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const completeReminder  = (id)   => req(`/api/reminders/${id}/complete`, { method: 'PATCH', headers: A() });
export const deleteReminder    = (id)   => req(`/api/reminders/${id}`, { method: 'DELETE', headers: A() });

// -- PORTFOLIO -----------------------------------------------------------------
export const getPortfolio      = ()      => req('/api/portfolio');  // public
export const getAdminPortfolio = ()      => req('/api/admin/portfolio', { headers: A() });
export const createPortfolio   = (body)  => req('/api/portfolio', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updatePortfolio   = (id, b) => req(`/api/portfolio/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deletePortfolio   = (id)    => req(`/api/portfolio/${id}`, { method: 'DELETE', headers: A() });
export const uploadImage       = async (file, folder = 'thebrandhelper/uploads') => req('/api/admin/uploads/image', {
  method: 'POST',
  headers: A(),
  body: JSON.stringify({
    file: await readFileAsDataUrl(file),
    folder,
    filename: file?.name || 'upload',
  }),
});
export const sendTestEmail     = (to)    => req('/api/admin/email/test', { method: 'POST', headers: A(), body: JSON.stringify({ to }) });

// -- STATS ---------------------------------------------------------------------
export const getPhase2Products = (params) => req(`/api/phase2/products${params ? `?${new URLSearchParams(params)}` : ''}`);
export const submitPhase2Request = (body) => req('/api/phase2/requests', { method: 'POST', body: JSON.stringify(body) });
export const getPhase2Requests = (params) => req(`/api/admin/phase2/requests${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const updatePhase2Request = (id, b) => req(`/api/admin/phase2/requests/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deletePhase2Request = (id) => req(`/api/admin/phase2/requests/${id}`, { method: 'DELETE', headers: A() });
export const getAdminPhase2Products = (params) => req(`/api/admin/phase2/products${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const createPhase2Product = (body) => req('/api/admin/phase2/products', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updatePhase2Product = (id, b) => req(`/api/admin/phase2/products/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deletePhase2Product = (id) => req(`/api/admin/phase2/products/${id}`, { method: 'DELETE', headers: A() });

export const getStats = () => req('/api/stats', { headers: A() });

// -- PROSPECTS -----------------------------------------------------------------
export const getProspects       = (params) => req(`/api/prospects${params ? `?${new URLSearchParams(params)}` : ''}`, { headers: A() });
export const getProspect        = (id)     => req(`/api/prospects/${id}`, { headers: A() });
export const createProspect     = (body)   => req('/api/prospects', { method: 'POST', headers: A(), body: JSON.stringify(body) });
export const updateProspect     = (id, b)  => req(`/api/prospects/${id}`, { method: 'PUT', headers: A(), body: JSON.stringify(b) });
export const deleteProspect     = (id)     => req(`/api/prospects/${id}`, { method: 'DELETE', headers: A() });
export const bulkImportProspects= (arr)    => req('/api/prospects/bulk', { method: 'POST', headers: A(), body: JSON.stringify({ prospects: arr }) });
export const convertProspect    = (id)     => req(`/api/prospects/${id}/convert`, { method: 'POST', headers: A() });
