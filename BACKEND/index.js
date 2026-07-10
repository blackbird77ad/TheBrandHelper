/**
 * The BrandHelper  -  Full CRM API Server
 * Models: Lead, Client, Project, Milestone, Meeting, Note, Quote, Reminder, Portfolio
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const {
  connect, Lead, Client, Project,
  Milestone, Meeting, Note, Quote,
  Reminder, Portfolio, Product, Phase2Request,
  Auth, Prospect,
  getDatabaseStatus,
} = require('./db');

const app    = express();
const PORT   = process.env.PORT || 4000;
const SECRET = (process.env.ADMIN_SECRET || 'change_this_secret').trim();
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.ADMIN_RESET_NOTIFY_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);
const RESET_NOTIFY_EMAILS = (process.env.ADMIN_RESET_NOTIFY_EMAILS || process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim())
  .filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_MASTER_PIN = process.env.ADMIN_MASTER_PIN || '';
const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM_EMAIL = (process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || '').trim();
const CLOUDINARY_CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const CLOUDINARY_API_KEY = (process.env.CLOUDINARY_API_KEY || '').trim();
const CLOUDINARY_API_SECRET = (process.env.CLOUDINARY_API_SECRET || '').trim();
const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 6000);
const ADMIN_NOTIFY_EMAILS = (
  process.env.ADMIN_NOTIFY_EMAILS ||
  process.env.ADMIN_RESET_NOTIFY_EMAILS ||
  process.env.ADMIN_EMAILS ||
  ''
)
  .split(',')
  .map(email => email.trim())
  .filter(Boolean);
// -- CORS ----------------------------------------------------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

function isAllowedLocalOrigin(origin = '') {
  try {
    const { hostname } = new URL(origin);
    return ['localhost', '127.0.0.1', '::1'].includes(hostname);
  } catch {
    return false;
  }
}

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin)) return cb(null, true);
    if (isAllowedLocalOrigin(cleanOrigin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Secret', 'X-Admin-Token'],
}));

app.use(express.json({ limit: '15mb' }));

app.use((e, _req, res, next) => {
  if (e instanceof SyntaxError && e.status === 400 && 'body' in e) {
    return res.status(400).json({ success: false, status: 400, error: 'Invalid JSON request body' });
  }
  next(e);
});

// -- Auth middleware -----------------------------------------------------------
function auth(req, res, next) {
  const headerSecret = String(req.headers['x-admin-secret'] || '').trim();
  const headerToken = String(req.headers['x-admin-token'] || '').trim();
  if (headerSecret !== SECRET && !verifyAdminToken(headerToken)) {
    return res.status(401).json({ success: false, status: 401, error: 'Unauthorised' });
  }
  next();
}

// -- Helper --------------------------------------------------------------------
const ok  = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, status, e, extra = {}) => res.status(status).json({
  success: false,
  status,
  error: e?.message || String(e || 'Request failed'),
  ...extra,
});
const err = (res, e, status = 500)    => fail(res, status, e);
const toArray = (value) => Array.isArray(value)
  ? value
  : String(value || '').split(',').map(item => item.trim()).filter(Boolean);
const isAdminEmail = (email) => ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());

async function isAdminPassword(password) {
  if (!password) return false;
  if (ADMIN_PASSWORD_HASH) return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  return Boolean(ADMIN_PASSWORD && password === ADMIN_PASSWORD);
}

function createAdminToken() {
  const now = Date.now();
  const payload = {
    scope: 'admin',
    iat: now,
    exp: now + (Number(process.env.ADMIN_TOKEN_TTL_HOURS || 12) * 60 * 60 * 1000),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyAdminToken(token = '') {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature) return false;

  try {
    const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.scope === 'admin' && Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function compactLines(lines) {
  return lines.filter(line => String(line || '').trim());
}

function recordLines(title, fields) {
  return compactLines([
    title,
    '',
    ...fields.map(([label, value]) => value ? `${label}: ${value}` : ''),
  ]);
}

async function sendEmail({ to, subject, text, html, replyTo }) {
  const recipients = (Array.isArray(to) ? to : [to]).map(email => String(email || '').trim()).filter(Boolean);
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || recipients.length === 0) {
    return { sent: false, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: recipients,
        subject,
        text,
        html: html || `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(text)}</pre>`,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      console.warn('Resend email failed:', response.status, details);
      return { sent: false, error: details || `Resend ${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.warn('Resend email error:', error.message);
    return { sent: false, error: error.name === 'AbortError' ? 'Resend request timed out' : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function queueEmail(label, task) {
  Promise.resolve()
    .then(task)
    .then((result) => {
      if (result?.error) console.warn(`${label}:`, result.error);
    })
    .catch((error) => console.warn(`${label}:`, error.message));
}

async function notifyAdmins(subject, lines, options = {}) {
  return sendEmail({
    to: options.to || ADMIN_NOTIFY_EMAILS,
    subject,
    text: compactLines(lines).join('\n'),
    replyTo: options.replyTo,
  });
}

async function acknowledgeLead(lead) {
  if (!lead?.email) return { sent: false, skipped: true };
  return sendEmail({
    to: lead.email,
    subject: `We received your ${lead.form_type || 'request'} - The BrandHelper`,
    text: compactLines([
      `Hello ${lead.client_name || lead.business_name || 'there'},`,
      '',
      'Thank you for contacting The BrandHelper. We have received your request and a team member will follow up with you.',
      '',
      lead.service ? `Interest: ${lead.service}` : '',
      lead.message ? `Message: ${lead.message}` : '',
      '',
      'The BrandHelper Team',
    ]).join('\n'),
  });
}

function isImageDataUrl(value = '') {
  return /^data:image\/(png|jpe?g|webp|gif|avif);base64,/i.test(String(value));
}

function cloudinarySignature(params) {
  const payload = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto
    .createHash('sha1')
    .update(`${payload}${CLOUDINARY_API_SECRET}`)
    .digest('hex');
}

function safeCloudinaryFolder(folder = '') {
  const clean = String(folder || '')
    .replace(/\\/g, '/')
    .replace(/[^a-zA-Z0-9/_-]/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '');
  return clean || 'thebrandhelper/uploads';
}

async function uploadImageToCloudinary(dataUrl, options = {}) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured on the backend');
  }
  if (!isImageDataUrl(dataUrl)) throw new Error('Only base64 image uploads are supported');

  const base64 = String(dataUrl).split(',')[1] || '';
  const bytes = Buffer.byteLength(base64, 'base64');
  const maxBytes = Number(process.env.CLOUDINARY_MAX_UPLOAD_MB || 8) * 1024 * 1024;
  if (bytes > maxBytes) throw new Error(`Image is too large. Max ${Math.round(maxBytes / 1024 / 1024)}MB`);

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = safeCloudinaryFolder(options.folder);
  const params = { folder, timestamp };
  const signature = cloudinarySignature(params);
  const form = new FormData();
  form.append('file', dataUrl);
  form.append('api_key', CLOUDINARY_API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || `Cloudinary upload failed (${response.status})`);

  return {
    url: result.secure_url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

async function normalizeImageField(value, folder) {
  if (!isImageDataUrl(value)) return value || '';
  const uploaded = await uploadImageToCloudinary(value, { folder });
  return uploaded.secure_url;
}

// -- Health --------------------------------------------------------------------
async function healthPayload() {
  const database = getDatabaseStatus();
  const payload = {
    service: 'TBH CRM API',
    status: database.connected ? 'running' : 'degraded',
    database,
    time: new Date().toISOString(),
  };

  if (database.connected) {
    const [leads, clients, projects, portfolio] = await Promise.all([
      Lead.countDocuments(), Client.countDocuments(),
      Project.countDocuments(), Portfolio.countDocuments(),
    ]);
    Object.assign(payload, { leads, clients, projects, portfolio });
  }

  return payload;
}

function requireDb(req, res, next) {
  const database = getDatabaseStatus();
  if (!database.connected) {
    return res.status(503).json({
      error: 'Database unavailable',
      database,
      path: req.path,
    });
  }
  next();
}

app.get('/', async (_req, res) => {
  res.json(await healthPayload());
});

app.get('/health', async (_req, res) => {
  res.status(getDatabaseStatus().connected ? 200 : 503).json(await healthPayload());
});

app.use('/api', requireDb);

app.post('/api/admin/uploads/image', auth, async (req, res) => {
  try {
    const uploaded = await uploadImageToCloudinary(req.body.file || req.body.dataUrl, {
      folder: req.body.folder || 'thebrandhelper/uploads',
    });
    ok(res, uploaded, 201);
  } catch (e) { err(res, e, 400); }
});

// ══════════════════════════════════════════════════════════════════════════════
// LEADS  -  public POST (from forms), admin for everything else
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/admin/email/test', auth, async (req, res) => {
  try {
    const result = await sendEmail({
      to: req.body.to || ADMIN_NOTIFY_EMAILS,
      subject: 'The BrandHelper Resend test',
      text: compactLines([
        'Resend is connected for The BrandHelper backend.',
        `Sent: ${new Date().toISOString()}`,
        `Environment: ${process.env.NODE_ENV || 'development'}`,
      ]).join('\n'),
    });

    if (!result.sent) {
      return res.status(result.skipped ? 400 : 502).json({
        error: result.skipped ? 'Resend is not configured on the backend' : (result.error || 'Resend email failed'),
      });
    }
    ok(res, { message: 'Resend test email sent' });
  } catch (e) { err(res, e); }
});

// Create lead from form (public) OR manually (admin)
const LEAD_SOURCES = new Set(['website', 'manual', 'referral', 'social', 'other']);

function cleanLeadSource(source, fallback = 'website') {
  const value = String(source || '').trim().toLowerCase();
  return LEAD_SOURCES.has(value) ? value : fallback;
}

function isBlueprintLead(body = {}) {
  return /blueprint/i.test(`${body.form_type || ''} ${body.source_detail || ''}`);
}

function hasAcceptedPaymentTerms(body = {}) {
  return body.payment_consent === true || body.payment_consent === 'true' || body.payment_terms_accepted === true || body.payment_terms_accepted === 'true';
}

app.post('/api/leads', async (req, res) => {
  try {
    const isAdmin = req.headers['x-admin-secret'] === SECRET || verifyAdminToken(req.headers['x-admin-token']);
    const body    = req.body;
    if (!isAdmin && isBlueprintLead(body)) {
      const missing = [];
      if (!String(body.client_name || '').trim()) missing.push('name');
      if (!String(body.email || '').trim()) missing.push('email');
      if (!String(body.phone || '').trim()) missing.push('phone');
      if (!hasAcceptedPaymentTerms(body)) missing.push('payment agreement');
      if (missing.length) {
        return fail(res, 400, `Blueprint submission requires ${missing.join(', ')}`);
      }
    }
    const source = isAdmin ? cleanLeadSource(body.source, 'manual') : cleanLeadSource(body.source, 'website');
    const sourceDetail = String(body.source_detail || body.form_type || (source === 'website' ? 'Website' : source)).trim();
    const lead    = await Lead.create({
      source,
      source_detail: sourceDetail,
      form_type:     body.form_type     || (isAdmin ? 'Manual Entry' : 'Unknown'),
      client_name:   body.client_name   || '',
      business_name: body.business_name || '',
      email:         body.email         || '',
      phone:         body.phone         || '',
      industry:      body.industry      || '',
      location:      body.location      || '',
      service:       body.service       || '',
      tier:          body.tier          || '',
      budget:        body.budget        || '',
      timeline:      body.timeline      || '',
      message:       body.message       || '',
      full_brief:    body.full_brief    || '',
      payment_consent: hasAcceptedPaymentTerms(body),
      payment_consent_text: body.payment_consent_text || '',
      notes:         body.notes         || '',
      follow_up_date: body.follow_up_date || null,
      submitted_at:  body.submitted_at  || new Date().toISOString(),
      status:        isAdmin ? (body.status || 'new') : 'new',
    });
    ok(res, lead, 201);
    queueEmail('Lead admin notification', () => notifyAdmins(
      `${isAdmin ? 'CRM lead created' : 'New website lead'}: ${lead.form_type || 'Lead'}`,
      recordLines('Lead details', [
        ['Name', lead.client_name],
        ['Origin', lead.source_detail || lead.form_type || lead.source],
        ['Business', lead.business_name],
        ['Email', lead.email],
        ['Phone', lead.phone],
        ['Service', lead.service],
        ['Budget', lead.budget],
        ['Timeline', lead.timeline],
        ['Payment agreement', lead.payment_consent ? 'Accepted' : 'Not recorded'],
        ['Message', lead.message],
      ]),
      { replyTo: lead.email }
    ));
    if (!isAdmin) queueEmail('Lead acknowledgement', () => acknowledgeLead(lead));
  } catch (e) { err(res, e); }
});

app.get('/api/leads',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: leads, count: leads.length });
  } catch (e) { err(res, e); }
});

app.get('/api/leads/:id',    auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Not found' });
    ok(res, lead);
  } catch (e) { err(res, e); }
});

app.put('/api/leads/:id',    auth, async (req, res) => {
  try {
    const before = await Lead.findById(req.params.id);
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ error: 'Not found' });
    if (before && (
      before.status !== lead.status ||
      String(before.follow_up_date || '') !== String(lead.follow_up_date || '')
    )) {
      queueEmail('Lead update notification', () => notifyAdmins(
        `Lead updated: ${lead.client_name || lead.business_name || lead.email || lead._id}`,
        recordLines('Lead update', [
          ['Name', lead.client_name],
          ['Business', lead.business_name],
          ['Old status', before.status],
          ['New status', lead.status],
          ['Follow up', lead.follow_up_date],
          ['Notes', lead.notes],
        ]),
        { replyTo: lead.email }
      ));
    }
    ok(res, lead);
  } catch (e) { err(res, e); }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// Convert lead → client
app.post('/api/leads/:id/convert', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const client = await Client.create({
      lead_id:       lead._id,
      source:        lead.source || 'website',
      name:          lead.client_name,
      business_name: lead.business_name,
      email:         lead.email,
      phone:         lead.phone,
      industry:      lead.industry,
      location:      lead.location || '',
      notes:         lead.notes || '',
    });

    // Mark lead as won and link to client
    await Lead.findByIdAndUpdate(lead._id, {
      status: 'won',
      converted_to_client: client._id,
    });

    ok(res, client, 201);
    queueEmail('Lead conversion notification', () => notifyAdmins(
      `Lead converted to client: ${client.name || client.business_name}`,
      recordLines('Converted lead', [
        ['Client', client.name],
        ['Business', client.business_name],
        ['Email', client.email],
        ['Phone', client.phone],
        ['Industry', client.industry],
      ]),
      { replyTo: client.email }
    ));
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// CLIENTS
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/clients',        auth, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    ok(res, client, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/clients',         auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const clients = await Client.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: clients, count: clients.length });
  } catch (e) { err(res, e); }
});

app.get('/api/clients/:id',     auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Not found' });
    // Also fetch related projects, meetings, notes
    const [projects, notes, meetings] = await Promise.all([
      Project.find({ client_id: req.params.id }).sort({ createdAt: -1 }),
      Note.find({ client_id: req.params.id }).sort({ createdAt: -1 }),
      Meeting.find({ client_id: req.params.id }).sort({ date: -1 }),
    ]);
    ok(res, { ...client.toObject(), projects, notes, meetings });
  } catch (e) { err(res, e); }
});

app.put('/api/clients/:id',     auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ error: 'Not found' });
    ok(res, client);
  } catch (e) { err(res, e); }
});

app.delete('/api/clients/:id',  auth, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/projects',        auth, async (req, res) => {
  try {
    const project = await Project.create(await prepareProjectPayload(req.body));
    ok(res, project, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/projects',         auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status)    filter.status    = req.query.status;
    if (req.query.client_id) filter.client_id = req.query.client_id;
    const projects = await Project.find(filter)
      .populate('client_id', 'name business_name email phone')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects, count: projects.length });
  } catch (e) { err(res, e); }
});

app.get('/api/projects/:id',     auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client_id', 'name business_name email phone');
    if (!project) return res.status(404).json({ error: 'Not found' });
    const [milestones, meetings, notes] = await Promise.all([
      Milestone.find({ project_id: req.params.id }).sort({ order: 1 }),
      Meeting.find({ project_id: req.params.id }).sort({ date: 1 }),
      Note.find({ project_id: req.params.id }).sort({ createdAt: -1 }),
    ]);
    ok(res, { ...project.toObject(), milestones, meetings, notes });
  } catch (e) { err(res, e); }
});

app.put('/api/projects/:id',     auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, await prepareProjectPayload(req.body), { new: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    ok(res, project);
  } catch (e) { err(res, e); }
});

app.delete('/api/projects/:id',  auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Milestone.deleteMany({ project_id: req.params.id });
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// -- Milestones ----------------------------------------------------------------
app.post('/api/projects/:id/milestones',           auth, async (req, res) => {
  try {
    const m = await Milestone.create({ ...req.body, project_id: req.params.id });
    ok(res, m, 201);
  } catch (e) { err(res, e); }
});

app.put('/api/milestones/:id',                     auth, async (req, res) => {
  try {
    const m = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ok(res, m);
  } catch (e) { err(res, e); }
});

app.delete('/api/milestones/:id',                  auth, async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// -- Toggle milestone complete -------------------------------------------------
app.patch('/api/milestones/:id/toggle',            auth, async (req, res) => {
  try {
    const m = await Milestone.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    m.completed    = !m.completed;
    m.completed_at = m.completed ? new Date() : null;
    await m.save();
    ok(res, m);
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// MEETINGS
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/meetings',       auth, async (req, res) => {
  try {
    const meeting = await Meeting.create(cleanIds(req.body));
    ok(res, meeting, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/meetings',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.client_id)  filter.client_id  = req.query.client_id;
    if (req.query.project_id) filter.project_id = req.query.project_id;
    const meetings = await Meeting.find(filter).sort({ date: 1 }).lean();
    res.json({ success: true, data: meetings, count: meetings.length });
  } catch (e) { err(res, e); }
});

app.put('/api/meetings/:id',    auth, async (req, res) => {
  try {
    const m = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ok(res, m);
  } catch (e) { err(res, e); }
});

app.delete('/api/meetings/:id', auth, async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// NOTES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/notes',       auth, async (req, res) => {
  try {
    const note = await Note.create(cleanIds(req.body));
    ok(res, note, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/notes',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.lead_id)    filter.lead_id    = req.query.lead_id;
    if (req.query.client_id)  filter.client_id  = req.query.client_id;
    if (req.query.project_id) filter.project_id = req.query.project_id;
    const notes = await Note.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: notes, count: notes.length });
  } catch (e) { err(res, e); }
});

app.delete('/api/notes/:id', auth, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// QUOTES
// ══════════════════════════════════════════════════════════════════════════════

// Auto-generate quote number
async function nextQuoteNumber() {
  const count = await Quote.countDocuments();
  return `TBH-${String(count + 1).padStart(4, '0')}`;
}

function quoteTotals(body = {}) {
  const subtotal = (Array.isArray(body.items) ? body.items : [])
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const discount = Number(body.discount) || 0;
  const depositPercent = Number(body.deposit_percent) || 30;
  const total = subtotal - discount;
  return {
    subtotal,
    total,
    deposit_amount: Math.round(total * (depositPercent / 100)),
  };
}

function cleanQuotePayload(body = {}) {
  const payload = { ...body };
  ['_id', '__v', 'createdAt', 'updatedAt', 'quote_number', 'subtotal', 'total', 'deposit_amount']
    .forEach((field) => { delete payload[field]; });
  return payload;
}

function quoteEmailText(quote = {}) {
  const items = (Array.isArray(quote.items) ? quote.items : [])
    .map((item) => `- ${item.description || 'Item'}: ${quote.currency || 'USD'} ${Number(item.amount || 0).toLocaleString()}`);

  return compactLines([
    `Hello ${quote.client_name || quote.business_name || 'there'},`,
    '',
    `Here is your quote from The BrandHelper: ${quote.quote_number || ''}`,
    '',
    'Scope:',
    ...items,
    '',
    `Total: ${quote.currency || 'USD'} ${Number(quote.total || 0).toLocaleString()}`,
    `Deposit (${quote.deposit_percent || 30}%): ${quote.currency || 'USD'} ${Number(quote.deposit_amount || 0).toLocaleString()}`,
    quote.valid_days ? `Valid for: ${quote.valid_days} days` : '',
    quote.notes ? `Notes: ${quote.notes}` : '',
    '',
    'Reply to this email and we will help you move the project forward.',
    '',
    'The BrandHelper Team',
  ]).join('\n');
}

app.post('/api/quotes',        auth, async (req, res) => {
  try {
    const body = cleanQuotePayload(req.body);

    const quote = await Quote.create({
      ...body,
      quote_number: await nextQuoteNumber(),
      ...quoteTotals(body),
    });
    ok(res, quote, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/quotes',         auth, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: quotes, count: quotes.length });
  } catch (e) { err(res, e); }
});

app.get('/api/quotes/:id',     auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Not found' });
    ok(res, quote);
  } catch (e) { err(res, e); }
});

app.put('/api/quotes/:id',     auth, async (req, res) => {
  try {
    const existing = await Quote.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const payload = cleanQuotePayload(req.body);
    if (
      payload.items !== undefined ||
      payload.discount !== undefined ||
      payload.deposit_percent !== undefined
    ) {
      Object.assign(payload, quoteTotals({ ...existing.toObject(), ...payload }));
    }

    const quote = await Quote.findByIdAndUpdate(req.params.id, payload, { new: true });
    ok(res, quote);
  } catch (e) { err(res, e); }
});

app.post('/api/quotes/:id/send-email', auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Not found' });
    if (!quote.client_email) return res.status(400).json({ error: 'Quote has no client email' });

    const result = await sendEmail({
      to: quote.client_email,
      subject: `Quote ${quote.quote_number} from The BrandHelper`,
      text: quoteEmailText(quote.toObject()),
      replyTo: ADMIN_NOTIFY_EMAILS[0],
    });

    if (!result.sent) {
      return res.status(result.skipped ? 400 : 502).json({
        error: result.skipped ? 'Resend is not configured on the backend' : (result.error || 'Resend email failed'),
      });
    }

    if (quote.status === 'draft') quote.status = 'sent';
    await quote.save();
    ok(res, { message: 'Quote email sent', data: quote });
  } catch (e) { err(res, e); }
});

app.delete('/api/quotes/:id',  auth, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// REMINDERS
// ══════════════════════════════════════════════════════════════════════════════

// Helper  -  converts empty string IDs to null to avoid ObjectId cast errors
function cleanIds(body) {
  const fields = ['lead_id','client_id','project_id','meeting_id'];
  const cleaned = { ...body };
  fields.forEach(f => { if (cleaned[f] === '' || cleaned[f] === undefined) cleaned[f] = null; });
  return cleaned;
}

async function prepareProjectPayload(body = {}) {
  const cleaned = cleanIds(body);
  const manualName = String(cleaned.client_name_manual || '').trim();
  delete cleaned.client_name_manual;

  if (!cleaned.client_id && manualName) {
    const client = await Client.create({
      name: manualName,
      source: 'manual',
      notes: cleaned.title ? `Created from project: ${cleaned.title}` : 'Created from project form',
    });
    cleaned.client_id = client._id;
  }

  return cleaned;
}

app.post('/api/reminders',        auth, async (req, res) => {
  try {
    const r = await Reminder.create(cleanIds(req.body));
    ok(res, r, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/reminders',         auth, async (req, res) => {
  try {
    const filter = { completed: false };
    if (req.query.all === 'true') delete filter.completed;
    const reminders = await Reminder.find(filter).sort({ due_date: 1 }).lean();
    res.json({ success: true, data: reminders, count: reminders.length });
  } catch (e) { err(res, e); }
});

app.put('/api/reminders/:id',     auth, async (req, res) => {
  try {
    const r = await Reminder.findByIdAndUpdate(req.params.id, cleanIds(req.body), { new: true });
    ok(res, r);
  } catch (e) { err(res, e); }
});

app.patch('/api/reminders/:id/complete', auth, async (req, res) => {
  try {
    const r = await Reminder.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    ok(res, r);
  } catch (e) { err(res, e); }
});

app.delete('/api/reminders/:id',  auth, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO (public read, admin write)
// ══════════════════════════════════════════════════════════════════════════════

async function cleanPortfolioPayload(body = {}) {
  const payload = { ...body };
  ['_id', '__v', 'createdAt', 'updatedAt'].forEach((field) => { delete payload[field]; });
  if (payload.tags !== undefined) payload.tags = toArray(payload.tags);
  if (payload.image !== undefined) payload.image = await normalizeImageField(payload.image, 'thebrandhelper/portfolio');
  const rawGallery = payload.gallery || payload.page_images || payload.images || [];
  if (payload.gallery !== undefined || payload.page_images !== undefined || payload.images !== undefined) {
    const gallery = Array.isArray(rawGallery) ? rawGallery : [];
    payload.gallery = await Promise.all(gallery.slice(0, 5).map(async (entry = {}, index) => ({
      title: String(entry.title || '').trim(),
      description: String(entry.description || '').trim(),
      image: await normalizeImageField(entry.image, 'thebrandhelper/portfolio/pages'),
      alt: String(entry.alt || entry.title || '').trim(),
      order: Number.isFinite(Number(entry.order)) ? Number(entry.order) : index,
    })));
    payload.gallery = payload.gallery
      .filter((entry) => entry.image || entry.title || entry.description)
      .sort((a, b) => a.order - b.order);
  }
  delete payload.page_images;
  delete payload.images;
  return payload;
}

const LEGACY_PORTFOLIO_IMAGES = {
  '/images/og-image.jpg.svg': '/images/belle-kreyashon.svg',
  '/images/Screenshot 2026-03-25 164016.png': '/images/faith-and-grace-catering.jpg',
};

function normalizePortfolioItem(item = {}) {
  const normalizePortfolioImage = (value = '') => {
    const image = String(value || '').trim();
    if (image.startsWith('data:image/')) return '/images/c2-drone-consult.jpg';
    return LEGACY_PORTFOLIO_IMAGES[image] || image;
  };
  const gallery = Array.isArray(item.gallery)
    ? item.gallery
      .map((entry = {}, index) => ({
        title: String(entry.title || '').trim(),
        description: String(entry.description || '').trim(),
        image: normalizePortfolioImage(entry.image),
        alt: String(entry.alt || entry.title || item.title || '').trim(),
        order: Number.isFinite(Number(entry.order)) ? Number(entry.order) : index,
      }))
      .filter((entry) => entry.image || entry.title || entry.description)
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
    : [];
  const image = normalizePortfolioImage(item.image) || gallery.find((entry) => entry.image)?.image || '';
  return {
    ...item,
    image,
    gallery,
  };
}

app.get('/api/portfolio',          async (_req, res) => {
  try {
    const items = await Portfolio.find().sort({ featured: -1, createdAt: -1 }).lean();
    const visible = items
      .filter((item) => item.published !== false)
      .map(normalizePortfolioItem);
    res.json({ success: true, data: visible, count: visible.length });
  } catch (e) { err(res, e); }
});

app.get('/api/admin/portfolio', auth, async (_req, res) => {
  try {
    const items = (await Portfolio.find().sort({ published: -1, featured: -1, createdAt: -1 }).lean())
      .map(normalizePortfolioItem);
    res.json({ success: true, data: items, count: items.length });
  } catch (e) { err(res, e); }
});

app.post('/api/portfolio',         auth, async (req, res) => {
  try {
    const item = await Portfolio.create(await cleanPortfolioPayload(req.body));
    ok(res, item, 201);
  } catch (e) { err(res, e); }
});

app.put('/api/portfolio/:id',      auth, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, await cleanPortfolioPayload(req.body), { new: true });
    ok(res, item);
  } catch (e) { err(res, e); }
});

app.delete('/api/portfolio/:id',   auth, async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════════════════════════════
// STATS & ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/stats', auth, async (_req, res) => {
  try {
    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalLeads, newLeads, wonLeads, lostLeads,
      leadsThisMonth, leadsLastMonth,
      totalClients, activeClients,
      totalProjects, activeProjects,
      projectsByStatus,
      totalRevenue, pendingRevenue,
      upcomingReminders, upcomingMeetings,
      totalPortfolio,
      leadsByForm, leadsByStatus,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'won' }),
      Lead.countDocuments({ status: 'lost' }),
      Lead.countDocuments({ createdAt: { $gte: monthStart } }),
      Lead.countDocuments({ createdAt: { $gte: lastMonth, $lt: monthStart } }),
      Client.countDocuments(),
      Client.countDocuments({ status: 'active' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'in_progress' }),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: null, total: { $sum: '$agreed_price' } } }]),
      Project.aggregate([{ $match: { balance_paid: false } }, { $group: { _id: null, total: { $sum: '$balance_amount' } } }]),
      Reminder.countDocuments({ completed: false, due_date: { $lte: new Date(now.getTime() + 7 * 86400000) } }),
      Meeting.countDocuments({ completed: false, date: { $gte: now } }),
      Portfolio.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$form_type', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$status',    count: { $sum: 1 } } }]),
    ]);

    ok(res, {
      leads: {
        total: totalLeads, new: newLeads, won: wonLeads, lost: lostLeads,
        this_month: leadsThisMonth, last_month: leadsLastMonth,
        conversion_rate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
        by_form:   Object.fromEntries(leadsByForm.map(x   => [x._id, x.count])),
        by_status: Object.fromEntries(leadsByStatus.map(x => [x._id, x.count])),
      },
      clients:  { total: totalClients,  active: activeClients  },
      projects: {
        total: totalProjects, active: activeProjects,
        by_status: Object.fromEntries(projectsByStatus.map(x => [x._id, x.count])),
      },
      revenue: {
        total:   totalRevenue[0]?.total   || 0,
        pending: pendingRevenue[0]?.total || 0,
      },
      upcoming: { reminders: upcomingReminders, meetings: upcomingMeetings },
      portfolio: { total: totalPortfolio },
    });
  } catch (e) { err(res, e); }
});


// ══════════════════════════════════════════════════════════════════════════════
// AUTH  -  PIN setup and verification (no ADMIN_SECRET needed  -  uses hashed PINs)
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/auth/status  -  check if PINs are configured */
app.get('/api/auth/status', async (_req, res) => {
  try {
    const auth = await Auth.findOne();
    res.json({
      configured: !!auth,
      password_enabled: Boolean((ADMIN_PASSWORD || ADMIN_PASSWORD_HASH) && ADMIN_EMAILS.length),
      admin_emails_configured: Boolean(ADMIN_EMAILS.length),
    });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/setup  -  first time setup, save both hashes */
app.post('/api/auth/setup', async (req, res) => {
  try {
    const existing = await Auth.findOne();
    if (existing) return res.status(400).json({ error: 'Already configured. Use reset to change.' });
    const { pin_hash, master_hash } = req.body;
    if (!pin_hash || !master_hash) return res.status(400).json({ error: 'Both hashes required' });
    const auth = await Auth.create({ pin_hash, master_hash });
    res.status(201).json({ success: true, token: createAdminToken() });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/verify  -  verify a PIN, returns type if matched */
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'PIN required' });
    const auth = await Auth.findOne();
    if (!auth) return res.status(404).json({ error: 'Not configured' });
    const envMasterMatch = Boolean(ADMIN_MASTER_PIN && pin === ADMIN_MASTER_PIN);
    const [pinMatch, masterMatch] = await Promise.all([
      bcrypt.compare(pin, auth.pin_hash),
      bcrypt.compare(pin, auth.master_hash),
    ]);
    if (pinMatch)    return res.json({ success: true, type: 'pin', token: createAdminToken() });
    if (masterMatch || envMasterMatch) return res.json({ success: true, type: 'master', token: createAdminToken() });
    res.status(401).json({ success: false, error: 'Incorrect PIN' });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/password-login  -  admin email + password login */
app.post('/api/auth/password-login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return fail(res, 400, 'Email and password required');
    if (!ADMIN_EMAILS.length) return fail(res, 503, 'Admin email login is not configured on the server');
    if (!ADMIN_PASSWORD && !ADMIN_PASSWORD_HASH) return fail(res, 503, 'Admin password login is not configured on the server');
    const emailOk = isAdminEmail(email);
    const passwordOk = await isAdminPassword(password);
    if (!emailOk || !passwordOk) return fail(res, 401, 'Invalid admin login');
    res.json({ success: true, type: 'password', token: createAdminToken() });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/request-reset  -  log a PIN reset request for admin follow-up */
app.post('/api/auth/request-reset', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const requestedBy = email || 'Unknown';
    const allowed = isAdminEmail(email);
    if (allowed) {
      const lead = await Lead.create({
        source: 'manual',
        form_type: 'Admin PIN Reset Request',
        client_name: requestedBy,
        email,
        service: 'Admin access',
        message: `Admin PIN reset requested by ${requestedBy}`,
        full_brief: [
          'Admin PIN reset request',
          `Requested by: ${requestedBy}`,
          `Time: ${new Date().toISOString()}`,
          `Notify: ${RESET_NOTIFY_EMAILS.join(', ') || 'No notify emails configured'}`,
        ].join('\n'),
        submitted_at: new Date().toISOString(),
        status: 'new',
      });
      queueEmail('Admin reset request notification', () => notifyAdmins(
        `Admin PIN reset request: ${requestedBy}`,
        recordLines('Admin reset request', [
          ['Requested by', requestedBy],
          ['Email', email],
          ['Time', new Date().toISOString()],
        ]),
        {
          to: RESET_NOTIFY_EMAILS.length ? RESET_NOTIFY_EMAILS : ADMIN_NOTIFY_EMAILS,
          replyTo: email,
        }
      ));
      return res.json({
        success: true,
        message: 'If this is an admin email, the reset request has been logged.',
        email_sent: false,
        email_queued: true,
      });
    }
    res.json({
      success: true,
      message: 'If this is an admin email, the reset request has been logged.',
      email_sent: false,
    });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/reset-pin  -  use master hash to set new admin PIN hash */
app.post('/api/auth/reset-pin', async (req, res) => {
  try {
    const { master_pin, new_pin_hash } = req.body;
    if (!master_pin || !new_pin_hash) return res.status(400).json({ error: 'master_pin and new_pin_hash required' });
    const auth = await Auth.findOne();
    if (!auth) return res.status(404).json({ error: 'Not configured' });
    const match = await bcrypt.compare(master_pin, auth.master_hash);
    const envMasterMatch = Boolean(ADMIN_MASTER_PIN && master_pin === ADMIN_MASTER_PIN);
    if (!match && !envMasterMatch) return res.status(401).json({ error: 'Incorrect master PIN' });
    auth.pin_hash = new_pin_hash;
    await auth.save();
    res.json({ success: true, token: createAdminToken() });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/full-reset  -  wipe all PINs, requires ADMIN_SECRET header */
app.post('/api/auth/full-reset', auth, async (req, res) => {
  try {
    await Auth.deleteMany({});
    res.json({ success: true, message: 'Auth cleared. Setup required on next visit.' });
  } catch (e) { err(res, e); }
});


// ══════════════════════════════════════════════════════════════════════════════
// PROSPECTS  -  Google Maps research leads with full outreach tracking
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/prospects', auth, async (req, res) => {
  try {
    const p = await Prospect.create(req.body);
    ok(res, p, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/prospects', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status)  filter.outreach_status = req.query.status;
    if (req.query.tag)     filter.tag             = req.query.tag;
    if (req.query.country) filter.country         = req.query.country;
    if (req.query.website_status) filter.website_status = req.query.website_status;
    const prospects = await Prospect.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: prospects, count: prospects.length });
  } catch (e) { err(res, e); }
});

app.get('/api/prospects/:id', auth, async (req, res) => {
  try {
    const p = await Prospect.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    ok(res, p);
  } catch (e) { err(res, e); }
});

app.put('/api/prospects/:id', auth, async (req, res) => {
  try {
    const p = await Prospect.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    ok(res, p);
  } catch (e) { err(res, e); }
});

app.delete('/api/prospects/:id', auth, async (req, res) => {
  try {
    await Prospect.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

// Bulk import prospects from CSV/JSON array
app.post('/api/prospects/bulk', auth, async (req, res) => {
  try {
    const { prospects } = req.body;
    if (!Array.isArray(prospects) || prospects.length === 0) {
      return res.status(400).json({ error: 'prospects array required' });
    }
    const inserted = await Prospect.insertMany(prospects, { ordered: false });
    ok(res, { inserted: inserted.length }, 201);
  } catch (e) { err(res, e); }
});

// Convert prospect to lead
app.post('/api/prospects/:id/convert', auth, async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id);
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
    const lead = await Lead.create({
      source:        'manual',
      form_type:     'Prospect Conversion',
      client_name:   prospect.business_name,
      business_name: prospect.business_name,
      email:         prospect.email,
      phone:         prospect.phone,
      industry:      prospect.niche,
      location:      prospect.location,
      service:       'Website Design',
      budget:        prospect.estimated_value,
      notes:         prospect.comment,
      status:        'new',
    });
    await Prospect.findByIdAndUpdate(req.params.id, {
      outreach_status: 'converted',
      lead_id: lead._id,
    });
    ok(res, lead, 201);
  } catch (e) { err(res, e); }
});

// -- 404 -----------------------------------------------------------------------
async function cleanProductPayload(body = {}) {
  const payload = { ...body };
  ['_id', '__v', 'createdAt', 'updatedAt'].forEach((field) => { delete payload[field]; });
  if (payload.applications !== undefined) payload.applications = toArray(payload.applications);
  if (payload.features !== undefined) payload.features = toArray(payload.features);
  if (payload.tags !== undefined) payload.tags = toArray(payload.tags);
  if (payload.image !== undefined) payload.image = await normalizeImageField(payload.image, 'thebrandhelper/products');
  return payload;
}

app.get('/api/phase2/products', async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.type) filter.product_type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).lean();
    ok(res, products);
  } catch (e) { err(res, e); }
});

app.get('/api/admin/phase2/products', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.product_type = req.query.type;
    if (req.query.published) filter.published = req.query.published === 'true';
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products, count: products.length });
  } catch (e) { err(res, e); }
});

app.post('/api/admin/phase2/products', auth, async (req, res) => {
  try {
    const product = await Product.create(await cleanProductPayload(req.body));
    ok(res, product, 201);
  } catch (e) { err(res, e); }
});

app.put('/api/admin/phase2/products/:id', auth, async (req, res) => {
  try {
    const update = await cleanProductPayload(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    ok(res, product);
  } catch (e) { err(res, e); }
});

app.delete('/api/admin/phase2/products/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

app.post('/api/phase2/requests', async (req, res) => {
  try {
    const body = req.body || {};
    const request = await Phase2Request.create({
      ...body,
      languages: toArray(body.languages),
      countries: toArray(body.countries),
      skills: toArray(body.skills),
      submitted_at: body.submitted_at || new Date().toISOString(),
    });

    const lead = await Lead.create({
      source: 'website',
      form_type: `Platform - ${request.request_type}`,
      client_name: request.contact_name,
      business_name: request.company,
      email: request.email,
      phone: request.phone || request.whatsapp,
      industry: request.project_type || request.data_type,
      service: request.source_product || request.request_type,
      budget: request.budget,
      timeline: request.timeline,
      message: request.message,
      full_brief: JSON.stringify(body, null, 2),
      submitted_at: request.submitted_at,
      status: 'new',
    });

    ok(res, request, 201);
    queueEmail('Platform request admin notification', () => notifyAdmins(
      `New platform request: ${request.request_type}`,
      recordLines('Platform request details', [
        ['Company', request.company],
        ['Contact', request.contact_name],
        ['Email', request.email],
        ['Phone', request.phone || request.whatsapp],
        ['Project type', request.project_type || request.data_type],
        ['Source product', request.source_product],
        ['Budget', request.budget],
        ['Timeline', request.timeline],
        ['Message', request.message],
      ]),
      { replyTo: request.email }
    ));
    queueEmail('Platform request acknowledgement', () => acknowledgeLead(lead));
  } catch (e) { err(res, e); }
});

app.get('/api/admin/phase2/requests', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.request_type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    const requests = await Phase2Request.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: requests, count: requests.length });
  } catch (e) { err(res, e); }
});

app.put('/api/admin/phase2/requests/:id', auth, async (req, res) => {
  try {
    const request = await Phase2Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ error: 'Not found' });
    ok(res, request);
  } catch (e) { err(res, e); }
});

app.delete('/api/admin/phase2/requests/:id', auth, async (req, res) => {
  try {
    await Phase2Request.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Deleted' });
  } catch (e) { err(res, e); }
});

app.use((req, res) => fail(res, 404, `${req.method} ${req.path} not found`));
app.use((e, _req, res, _next) => {
  const status = e?.message?.startsWith('CORS:') ? 403 : Number(e?.status || e?.statusCode || 500);
  console.error(e.message);
  fail(res, Number.isFinite(status) ? status : 500, e);
});

// -- Start ---------------------------------------------------------------------
/* Legacy crash-on-connect startup disabled.
false && connect()
  .then(() => app.listen(PORT, () => {
    console.log(`\n🚀 TBH CRM Server  -  port ${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
  }))
  .catch(e => { console.error('❌ MongoDB:', e.message); process.exit(1); });

*/
app.listen(PORT, () => {
  console.log(`\nTBH CRM Server - port ${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
});

connect().catch(e => {
  console.error('MongoDB unavailable at startup:', e.message);
});

module.exports = app;
