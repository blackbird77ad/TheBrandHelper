/**
 * db.js — All MongoDB models for The BrandHelper CRM
 */

const mongoose = require('mongoose');

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables');
  await mongoose.connect(uri, {
    dbName: 'thebrandhelperdb',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  });
  console.log('✅ MongoDB connected');
}

// ── LEAD ─────────────────────────────────────────────────────────────────────
const leadSchema = new mongoose.Schema({
  // Source
  source:        { type: String, enum: ['website', 'manual', 'referral', 'social', 'other'], default: 'website' },
  form_type:     { type: String, default: 'Unknown' },

  // Contact
  client_name:   { type: String, default: '' },
  business_name: { type: String, default: '' },
  email:         { type: String, default: '' },
  phone:         { type: String, default: '' },
  industry:      { type: String, default: '' },
  location:      { type: String, default: '' },

  // Project interest
  service:       { type: String, default: '' },
  tier:          { type: String, default: '' },
  budget:        { type: String, default: '' },
  timeline:      { type: String, default: '' },
  message:       { type: String, default: '' },
  full_brief:    { type: String, default: '' },

  // Pipeline status
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'negotiating', 'won', 'lost'],
    default: 'new',
  },

  // Notes + follow-up
  notes:          { type: String, default: '' },
  follow_up_date: { type: Date, default: null },
  follow_up_sent: { type: Boolean, default: false },

  // Link to client if converted
  converted_to_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },

  submitted_at: { type: String, default: '' },
}, { timestamps: true });

// ── CLIENT ────────────────────────────────────────────────────────────────────
const clientSchema = new mongoose.Schema({
  // Origin
  lead_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
  source:        { type: String, enum: ['website', 'manual', 'referral', 'social', 'other'], default: 'manual' },

  // Profile
  name:          { type: String, required: true, trim: true },
  business_name: { type: String, default: '', trim: true },
  email:         { type: String, default: '' },
  phone:         { type: String, default: '' },
  location:      { type: String, default: '' },
  industry:      { type: String, default: '' },
  website:       { type: String, default: '' },
  social:        { type: String, default: '' },
  notes:         { type: String, default: '' },

  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'archived'],
    default: 'active',
  },
}, { timestamps: true });

// ── PROJECT ───────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  client_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  lead_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },

  // Details
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  service_type: { type: String, default: '' },

  // Financials
  agreed_price:   { type: Number, default: 0 },
  deposit_amount: { type: Number, default: 0 },
  deposit_paid:   { type: Boolean, default: false },
  deposit_date:   { type: Date, default: null },
  balance_amount: { type: Number, default: 0 },
  balance_paid:   { type: Boolean, default: false },
  balance_date:   { type: Date, default: null },
  currency:       { type: String, default: 'USD' },

  // Timeline
  start_date:    { type: Date, default: null },
  deadline:      { type: Date, default: null },
  delivered_date:{ type: Date, default: null },

  // Status
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'review', 'revision', 'delivered', 'completed', 'paused', 'cancelled'],
    default: 'not_started',
  },

  // Progress 0-100
  progress:     { type: Number, default: 0, min: 0, max: 100 },

  // Notes
  notes:        { type: String, default: '' },
}, { timestamps: true });

// ── MILESTONE ─────────────────────────────────────────────────────────────────
const milestoneSchema = new mongoose.Schema({
  project_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  due_date:    { type: Date, default: null },
  completed:   { type: Boolean, default: false },
  completed_at:{ type: Date, default: null },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

// ── MEETING ───────────────────────────────────────────────────────────────────
const meetingSchema = new mongoose.Schema({
  // Can be linked to lead or project or client
  lead_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Lead',    default: null },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  client_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Client',  default: null },

  title:       { type: String, required: true },
  date:        { type: Date,   required: true },
  duration_min:{ type: Number, default: 30 },
  type:        { type: String, enum: ['call', 'video', 'in_person', 'whatsapp'], default: 'call' },
  link:        { type: String, default: '' }, // Calendly/Zoom link
  notes:       { type: String, default: '' },
  completed:   { type: Boolean, default: false },
  outcome:     { type: String, default: '' },
}, { timestamps: true });

// ── NOTE ──────────────────────────────────────────────────────────────────────
const noteSchema = new mongoose.Schema({
  lead_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Lead',    default: null },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  client_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Client',  default: null },
  text:       { type: String, required: true },
  type:       { type: String, enum: ['note', 'call', 'email', 'whatsapp', 'meeting', 'other'], default: 'note' },
}, { timestamps: true });

// ── QUOTE ─────────────────────────────────────────────────────────────────────
const quoteSchema = new mongoose.Schema({
  lead_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Lead',   default: null },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },

  quote_number: { type: String, required: true, unique: true },

  // Client info (snapshot at time of quote)
  client_name:   { type: String, default: '' },
  client_email:  { type: String, default: '' },
  client_phone:  { type: String, default: '' },
  business_name: { type: String, default: '' },

  // Line items
  items: [{
    description: { type: String, required: true },
    amount:      { type: Number, required: true },
  }],

  // Totals
  subtotal:        { type: Number, default: 0 },
  discount:        { type: Number, default: 0 }, // amount off
  total:           { type: Number, default: 0 },
  deposit_percent: { type: Number, default: 30 },
  deposit_amount:  { type: Number, default: 0 },

  currency:    { type: String, default: 'USD' },
  valid_days:  { type: Number, default: 14 },
  notes:       { type: String, default: '' },

  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'declined', 'expired'],
    default: 'draft',
  },
}, { timestamps: true });

// ── REMINDER ─────────────────────────────────────────────────────────────────
const reminderSchema = new mongoose.Schema({
  lead_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Lead',    default: null },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  client_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Client',  default: null },

  title:     { type: String, required: true },
  note:      { type: String, default: '' },
  due_date:  { type: Date,   required: true },
  completed: { type: Boolean, default: false },
  sent:      { type: Boolean, default: false },
}, { timestamps: true });

// ── PORTFOLIO PROJECT (existing) ──────────────────────────────────────────────
const portfolioSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  category:    { type: String, default: 'Other' },
  description: { type: String, required: true, trim: true },
  image:       { type: String, default: '' },
  link:        { type: String, default: '' },
  tags:        { type: [String], default: [] },
  featured:    { type: Boolean, default: false },
}, { timestamps: true });


// ── AUTH (PIN hashes — one document, singleton) ───────────────────────────────
const authSchema = new mongoose.Schema({
  pin_hash:    { type: String, required: true },
  master_hash: { type: String, required: true },
}, { timestamps: true });

// ── Export all models ─────────────────────────────────────────────────────────
module.exports = {
  connect,
  Lead:      mongoose.model('Lead',      leadSchema),
  Client:    mongoose.model('Client',    clientSchema),
  Project:   mongoose.model('Project',   projectSchema),
  Milestone: mongoose.model('Milestone', milestoneSchema),
  Meeting:   mongoose.model('Meeting',   meetingSchema),
  Note:      mongoose.model('Note',      noteSchema),
  Quote:     mongoose.model('Quote',     quoteSchema),
  Reminder:  mongoose.model('Reminder',  reminderSchema),
  Portfolio: mongoose.model('Portfolio', portfolioSchema),
  Auth:      mongoose.model('Auth',      authSchema),
};