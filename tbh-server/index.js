/**
 * The BrandHelper — Express API Server
 * Routes:
 *   Public:  GET  /api/projects
 *            GET  /api/projects/:id
 *            POST /api/leads          (form submissions — no auth needed)
 *
 *   Admin:   POST   /api/projects     (requires X-Admin-Secret header)
 *            PUT    /api/projects/:id
 *            DELETE /api/projects/:id
 *            GET    /api/leads        (view all leads)
 *            GET    /api/stats        (counts per collection)
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');
const db      = require('./db');

const app    = express();
const PORT   = process.env.PORT || 4000;
const SECRET = process.env.ADMIN_SECRET || 'change_this_secret';

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. Postman, curl, same-origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // In development allow localhost on any port
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return cb(null, true);
    }
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Secret'],
}));

app.use(express.json({ limit: '2mb' }));

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────

/** Timestamp every incoming request */
app.use((req, _res, next) => {
  req.receivedAt = new Date().toISOString();
  next();
});

/** Admin auth — checks X-Admin-Secret header */
function requireAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== SECRET) {
    return res.status(401).json({ error: 'Unauthorised — invalid or missing admin secret' });
  }
  next();
}

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'The BrandHelper API',
    status:  'running',
    time:    new Date().toISOString(),
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO ROUTES
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/projects — public, returns all projects newest first */
app.get('/api/projects', (_req, res) => {
  const projects = db.readAll('projects');
  res.json({ success: true, data: projects, count: projects.length });
});

/** GET /api/projects/:id — public */
app.get('/api/projects/:id', (req, res) => {
  const project = db.findById('projects', req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, data: project });
});

/** POST /api/projects — admin only */
app.post('/api/projects', requireAdmin, (req, res) => {
  const { title, category, description, image, link, tags, featured } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'title and description are required' });
  }

  const project = {
    id:          uuidv4(),
    title:       title.trim(),
    category:    category || 'Other',
    description: description.trim(),
    image:       image  || '',
    link:        link   || '',
    tags:        Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
    featured:    Boolean(featured),
    created_at:  new Date().toISOString(),
    updated_at:  new Date().toISOString(),
  };

  db.insert('projects', project);
  res.status(201).json({ success: true, data: project });
});

/** PUT /api/projects/:id — admin only */
app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const existing = db.findById('projects', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const { title, category, description, image, link, tags, featured } = req.body;

  const updated = db.update('projects', req.params.id, {
    ...(title       !== undefined && { title:       title.trim()       }),
    ...(category    !== undefined && { category                        }),
    ...(description !== undefined && { description: description.trim() }),
    ...(image       !== undefined && { image                           }),
    ...(link        !== undefined && { link                            }),
    ...(tags        !== undefined && { tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean) }),
    ...(featured    !== undefined && { featured: Boolean(featured)     }),
  });

  res.json({ success: true, data: updated });
});

/** DELETE /api/projects/:id — admin only */
app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const deleted = db.remove('projects', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
});

// ══════════════════════════════════════════════════════════════════════════════
// LEADS ROUTES (form submissions)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/leads — public, no auth
 * Called from: ClientRequirements, WebsiteCalc, Contact inquiry form
 * Stores the full submission alongside EmailJS + Sheets
 */
app.post('/api/leads', (req, res) => {
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Empty submission' });
  }

  const lead = {
    id:           uuidv4(),
    form_type:    body.form_type    || 'Unknown',
    client_name:  body.client_name  || '',
    business_name: body.business_name || '',
    email:        body.email        || '',
    phone:        body.phone        || '',
    industry:     body.industry     || '',
    service:      body.service      || '',
    tier:         body.tier         || '',
    budget:       body.budget       || '',
    timeline:     body.timeline     || '',
    message:      body.message      || '',
    full_brief:   body.full_brief   || '',
    submitted_at: body.submitted_at || new Date().toISOString(),
    server_time:  new Date().toISOString(),
    status:       'new', // new | contacted | in_progress | closed
  };

  db.insert('leads', lead);
  res.status(201).json({ success: true, id: lead.id });
});

/** GET /api/leads — admin only, returns all leads newest first */
app.get('/api/leads', requireAdmin, (req, res) => {
  const leads  = db.readAll('leads');
  const status = req.query.status; // optional filter: ?status=new
  const filtered = status ? leads.filter(l => l.status === status) : leads;
  res.json({ success: true, data: filtered, count: filtered.length });
});

/** GET /api/leads/:id — admin only */
app.get('/api/leads/:id', requireAdmin, (req, res) => {
  const lead = db.findById('leads', req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

/** PUT /api/leads/:id/status — admin only — update lead status */
app.put('/api/leads/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'contacted', 'in_progress', 'closed'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
  }
  const updated = db.update('leads', req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, data: updated });
});

/** DELETE /api/leads/:id — admin only */
app.delete('/api/leads/:id', requireAdmin, (req, res) => {
  const deleted = db.remove('leads', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
});

// ══════════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/stats — admin only */
app.get('/api/stats', requireAdmin, (_req, res) => {
  const leads    = db.readAll('leads');
  const projects = db.readAll('projects');

  const leadsByStatus = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const leadsByForm = leads.reduce((acc, l) => {
    acc[l.form_type] = (acc[l.form_type] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      projects:    { total: projects.length, featured: projects.filter(p => p.featured).length },
      leads:       { total: leads.length, by_status: leadsByStatus, by_form: leadsByForm },
    },
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 TBH Server running on port ${PORT}`);
  console.log(`   Projects: ${db.count('projects')}`);
  console.log(`   Leads:    ${db.count('leads')}`);
  console.log(`   ENV:      ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
