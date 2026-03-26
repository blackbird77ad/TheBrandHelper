/**
 * The BrandHelper — Express API Server
 * Storage: MongoDB Atlas via Mongoose
 */

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const { connect, Project, Lead } = require('./db');

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
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return cb(null, true);
    }
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Secret'],
}));

app.use(express.json({ limit: '2mb' }));

// ── Admin auth ────────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== SECRET) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  next();
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', async (_req, res) => {
  const projects = await Project.countDocuments();
  const leads    = await Lead.countDocuments();
  res.json({
    service:  'The BrandHelper API',
    status:   'running',
    storage:  'MongoDB Atlas',
    projects,
    leads,
    time:     new Date().toISOString(),
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/projects — public */
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects, count: projects.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/projects/:id — public */
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST /api/projects — admin only */
app.post('/api/projects', requireAdmin, async (req, res) => {
  try {
    const { title, category, description, image, link, tags, featured } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }
    const project = await Project.create({
      title:       title.trim(),
      category:    category || 'Other',
      description: description.trim(),
      image:       image    || '',
      link:        link     || '',
      tags:        Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
      featured:    Boolean(featured),
    });
    res.status(201).json({ success: true, data: project });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** PUT /api/projects/:id — admin only */
app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const { title, category, description, image, link, tags, featured } = req.body;
    const update = {
      ...(title       !== undefined && { title:       title.trim()       }),
      ...(category    !== undefined && { category                        }),
      ...(description !== undefined && { description: description.trim() }),
      ...(image       !== undefined && { image                           }),
      ...(link        !== undefined && { link                            }),
      ...(tags        !== undefined && { tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean) }),
      ...(featured    !== undefined && { featured: Boolean(featured)     }),
    };
    const project = await Project.findByIdAndUpdate(
      req.params.id, update, { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** DELETE /api/projects/:id — admin only */
app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// LEADS
// ══════════════════════════════════════════════════════════════════════════════

/** POST /api/leads — public, called from all three forms */
app.post('/api/leads', async (req, res) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'Empty submission' });
    }
    const lead = await Lead.create({
      form_type:     body.form_type     || 'Unknown',
      client_name:   body.client_name   || '',
      business_name: body.business_name || '',
      email:         body.email         || '',
      phone:         body.phone         || '',
      industry:      body.industry      || '',
      service:       body.service       || '',
      tier:          body.tier          || '',
      budget:        body.budget        || '',
      timeline:      body.timeline      || '',
      message:       body.message       || '',
      full_brief:    body.full_brief    || '',
      submitted_at:  body.submitted_at  || new Date().toISOString(),
      status:        'new',
    });
    res.status(201).json({ success: true, id: lead._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/leads — admin only */
app.get('/api/leads', requireAdmin, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const leads  = await Lead.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: leads, count: leads.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/leads/:id — admin only */
app.get('/api/leads/:id', requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** PUT /api/leads/:id/status — admin only */
app.put('/api/leads/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['new', 'contacted', 'in_progress', 'closed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
    }
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** DELETE /api/leads/:id — admin only */
app.delete('/api/leads/:id', requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/stats — admin only */
app.get('/api/stats', requireAdmin, async (_req, res) => {
  try {
    const [totalProjects, featuredProjects, totalLeads, leadsByStatus, leadsByForm] =
      await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ featured: true }),
        Lead.countDocuments(),
        Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Lead.aggregate([{ $group: { _id: '$form_type', count: { $sum: 1 } } }]),
      ]);

    res.json({
      success: true,
      data: {
        projects: {
          total:    totalProjects,
          featured: featuredProjects,
        },
        leads: {
          total:     totalLeads,
          by_status: Object.fromEntries(leadsByStatus.map(x => [x._id, x.count])),
          by_form:   Object.fromEntries(leadsByForm.map(x => [x._id, x.count])),
        },
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start — connect to MongoDB first, then listen ────────────────────────────
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 TBH Server running on port ${PORT}`);
      console.log(`   Storage: MongoDB Atlas`);
      console.log(`   ENV:     ${process.env.NODE_ENV || 'development'}\n`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;