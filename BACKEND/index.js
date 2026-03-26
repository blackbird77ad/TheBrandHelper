/**
 * The BrandHelper — Full CRM API Server
 * Models: Lead, Client, Project, Milestone, Meeting, Note, Quote, Reminder, Portfolio
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const {
  connect, Lead, Client, Project,
  Milestone, Meeting, Note, Quote,
  Reminder, Portfolio, Auth,
} = require('./db');

const app    = express();
const PORT   = process.env.PORT || 4000;
const SECRET = process.env.ADMIN_SECRET || 'change_this_secret';

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV !== 'production' && origin?.includes('localhost')) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Secret'],
}));

app.use(express.json({ limit: '5mb' }));

// ── Auth middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  if (req.headers['x-admin-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  next();
}

// ── Helper ────────────────────────────────────────────────────────────────────
const ok  = (res, data, status = 200) => res.status(status).json({ success: true, data });
const err = (res, e, status = 500)    => res.status(status).json({ error: e?.message || e });

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/', async (_req, res) => {
  const [leads, clients, projects, portfolio] = await Promise.all([
    Lead.countDocuments(), Client.countDocuments(),
    Project.countDocuments(), Portfolio.countDocuments(),
  ]);
  res.json({ service: 'TBH CRM API', status: 'running', leads, clients, projects, portfolio, time: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════════════════════════
// LEADS — public POST (from forms), admin for everything else
// ══════════════════════════════════════════════════════════════════════════════

// Create lead from form (public) OR manually (admin)
app.post('/api/leads', async (req, res) => {
  try {
    const isAdmin = req.headers['x-admin-secret'] === SECRET;
    const body    = req.body;
    const lead    = await Lead.create({
      source:        isAdmin ? (body.source || 'manual') : 'website',
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
      notes:         body.notes         || '',
      follow_up_date: body.follow_up_date || null,
      submitted_at:  body.submitted_at  || new Date().toISOString(),
      status:        isAdmin ? (body.status || 'new') : 'new',
    });
    ok(res, lead, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/leads',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
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
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ error: 'Not found' });
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
    const clients = await Client.find(filter).sort({ createdAt: -1 });
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
    const project = await Project.create(req.body);
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
      .sort({ createdAt: -1 });
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
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

// ── Milestones ────────────────────────────────────────────────────────────────
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

// ── Toggle milestone complete ─────────────────────────────────────────────────
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
    const meeting = await Meeting.create(req.body);
    ok(res, meeting, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/meetings',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.client_id)  filter.client_id  = req.query.client_id;
    if (req.query.project_id) filter.project_id = req.query.project_id;
    const meetings = await Meeting.find(filter).sort({ date: 1 });
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
    const note = await Note.create(req.body);
    ok(res, note, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/notes',        auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.lead_id)    filter.lead_id    = req.query.lead_id;
    if (req.query.client_id)  filter.client_id  = req.query.client_id;
    if (req.query.project_id) filter.project_id = req.query.project_id;
    const notes = await Note.find(filter).sort({ createdAt: -1 });
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

app.post('/api/quotes',        auth, async (req, res) => {
  try {
    const body     = req.body;
    const subtotal = (body.items || []).reduce((s, i) => s + (i.amount || 0), 0);
    const discount = body.discount || 0;
    const total    = subtotal - discount;
    const deposit  = Math.round(total * ((body.deposit_percent || 30) / 100));

    const quote = await Quote.create({
      ...body,
      quote_number:    await nextQuoteNumber(),
      subtotal,
      total,
      deposit_amount:  deposit,
    });
    ok(res, quote, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/quotes',         auth, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
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
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ok(res, quote);
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

app.post('/api/reminders',        auth, async (req, res) => {
  try {
    const r = await Reminder.create(req.body);
    ok(res, r, 201);
  } catch (e) { err(res, e); }
});

app.get('/api/reminders',         auth, async (req, res) => {
  try {
    const filter = { completed: false };
    if (req.query.all === 'true') delete filter.completed;
    const reminders = await Reminder.find(filter).sort({ due_date: 1 });
    res.json({ success: true, data: reminders, count: reminders.length });
  } catch (e) { err(res, e); }
});

app.put('/api/reminders/:id',     auth, async (req, res) => {
  try {
    const r = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

app.get('/api/portfolio',          async (_req, res) => {
  try {
    const items = await Portfolio.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items, count: items.length });
  } catch (e) { err(res, e); }
});

app.post('/api/portfolio',         auth, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    ok(res, item, 201);
  } catch (e) { err(res, e); }
});

app.put('/api/portfolio/:id',      auth, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
// AUTH — PIN setup and verification (no ADMIN_SECRET needed — uses hashed PINs)
// ══════════════════════════════════════════════════════════════════════════════

/** GET /api/auth/status — check if PINs are configured */
app.get('/api/auth/status', async (_req, res) => {
  try {
    const auth = await Auth.findOne();
    res.json({ configured: !!auth });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/setup — first time setup, save both hashes */
app.post('/api/auth/setup', async (req, res) => {
  try {
    const existing = await Auth.findOne();
    if (existing) return res.status(400).json({ error: 'Already configured. Use reset to change.' });
    const { pin_hash, master_hash } = req.body;
    if (!pin_hash || !master_hash) return res.status(400).json({ error: 'Both hashes required' });
    const auth = await Auth.create({ pin_hash, master_hash });
    res.status(201).json({ success: true });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/verify — verify a PIN, returns type if matched */
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'PIN required' });
    const auth = await Auth.findOne();
    if (!auth) return res.status(404).json({ error: 'Not configured' });
    const [pinMatch, masterMatch] = await Promise.all([
      bcrypt.compare(pin, auth.pin_hash),
      bcrypt.compare(pin, auth.master_hash),
    ]);
    if (pinMatch)    return res.json({ success: true, type: 'pin'    });
    if (masterMatch) return res.json({ success: true, type: 'master' });
    res.status(401).json({ success: false, error: 'Incorrect PIN' });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/reset-pin — use master hash to set new admin PIN hash */
app.post('/api/auth/reset-pin', async (req, res) => {
  try {
    const { master_pin, new_pin_hash } = req.body;
    if (!master_pin || !new_pin_hash) return res.status(400).json({ error: 'master_pin and new_pin_hash required' });
    const auth = await Auth.findOne();
    if (!auth) return res.status(404).json({ error: 'Not configured' });
    const match = await bcrypt.compare(master_pin, auth.master_hash);
    if (!match) return res.status(401).json({ error: 'Incorrect master PIN' });
    auth.pin_hash = new_pin_hash;
    await auth.save();
    res.json({ success: true });
  } catch (e) { err(res, e); }
});

/** POST /api/auth/full-reset — wipe all PINs, requires ADMIN_SECRET header */
app.post('/api/auth/full-reset', auth, async (req, res) => {
  try {
    await Auth.deleteMany({});
    res.json({ success: true, message: 'Auth cleared. Setup required on next visit.' });
  } catch (e) { err(res, e); }
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.path} not found` }));
app.use((e, _req, res, _next) => { console.error(e.message); res.status(500).json({ error: e.message }); });

// ── Start ─────────────────────────────────────────────────────────────────────
connect()
  .then(() => app.listen(PORT, () => {
    console.log(`\n🚀 TBH CRM Server — port ${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
  }))
  .catch(e => { console.error('❌ MongoDB:', e.message); process.exit(1); });

module.exports = app;