/**
 * db.js — MongoDB models via Mongoose
 * Replaces the JSON file database entirely
 */

const mongoose = require('mongoose');

// ── Connect ───────────────────────────────────────────────────────────────────
async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set in environment variables');

  await mongoose.connect(uri, {
    dbName: 'thebrandhelperdb',
  });

  console.log('✅ MongoDB connected');
}

// ── Project Schema ────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  category:    { type: String, default: 'Other' },
  description: { type: String, required: true, trim: true },
  image:       { type: String, default: '' },
  link:        { type: String, default: '' },
  tags:        { type: [String], default: [] },
  featured:    { type: Boolean, default: false },
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

// ── Lead Schema ───────────────────────────────────────────────────────────────
const leadSchema = new mongoose.Schema({
  form_type:     { type: String, default: 'Unknown' },
  client_name:   { type: String, default: '' },
  business_name: { type: String, default: '' },
  email:         { type: String, default: '' },
  phone:         { type: String, default: '' },
  industry:      { type: String, default: '' },
  service:       { type: String, default: '' },
  tier:          { type: String, default: '' },
  budget:        { type: String, default: '' },
  timeline:      { type: String, default: '' },
  message:       { type: String, default: '' },
  full_brief:    { type: String, default: '' },
  submitted_at:  { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'closed'],
    default: 'new',
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
const Lead    = mongoose.model('Lead',    leadSchema);

module.exports = { connect, Project, Lead };