import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  getProjects, createProject, updateProject, deleteProject,
  getLeads, updateLeadStatus, deleteLead, getStats,
} from "../utils/api";

const CATEGORIES = ["Website Design", "Brand Strategy", "Ads Management", "Technical Support", "Other"];
const EMPTY_FORM = { title: "", category: "Website Design", description: "", image: "", link: "", tags: "", featured: false };

const LEAD_STATUSES = ["new", "contacted", "in_progress", "closed"];
const STATUS_COLORS = {
  new:         "bg-blue-100 text-blue-700",
  contacted:   "bg-yellow-100 text-yellow-700",
  in_progress: "bg-purple-100 text-purple-700",
  closed:      "bg-green-100 text-green-700",
};

export default function Admin() {
  const [tab,      setTab]      = useState("portfolio"); // portfolio | leads | stats
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // Portfolio state
  const [projects, setProjects] = useState([]);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  // Leads state
  const [leads,        setLeads]        = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [expandedLead, setExpandedLead] = useState(null);

  // Stats state
  const [stats, setStats] = useState(null);

  // ── Load projects on mount ──────────────────────────────────────────────────
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (tab === 'leads' && leads.length === 0) loadLeads();
    if (tab === 'stats') loadStats();
  }, [tab]);

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      setError(`Could not load projects: ${e.message}. Is the server running?`);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await getLeads();
      setLeads(res.data);
    } catch (e) {
      setError(`Could not load leads: ${e.message}`);
    } finally {
      setLeadsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (e) {
      setError(`Could not load stats: ${e.message}`);
    }
  };

  // ── Portfolio actions ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await updateProject(editing, { ...form, tags: parseTags(form.tags) });
        setProjects(p => p.map(x => x.id === editing ? res.data : x));
      } else {
        const res = await createProject({ ...form, tags: parseTags(form.tags) });
        setProjects(p => [res.data, ...p]);
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setForm({ ...project, tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '' });
    setEditing(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(p => p.filter(x => x.id !== id));
      setConfirmDel(null);
    } catch (e) {
      setError(`Delete failed: ${e.message}`);
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const res = await updateProject(project.id, { featured: !project.featured });
      setProjects(p => p.map(x => x.id === project.id ? res.data : x));
    } catch (e) {
      setError(`Update failed: ${e.message}`);
    }
  };

  // ── Lead actions ───────────────────────────────────────────────────────────
  const handleLeadStatus = async (id, status) => {
    try {
      const res = await updateLeadStatus(id, status);
      setLeads(l => l.map(x => x.id === id ? res.data : x));
    } catch (e) {
      setError(`Status update failed: ${e.message}`);
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      await deleteLead(id);
      setLeads(l => l.filter(x => x.id !== id));
    } catch (e) {
      setError(`Delete failed: ${e.message}`);
    }
  };

  const parseTags = (str) =>
    typeof str === 'string' ? str.split(',').map(t => t.trim()).filter(Boolean) : str || [];

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white";

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black">
      <Helmet>
        <title>Admin Dashboard — The BrandHelper</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="bg-black text-white px-6 py-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-0.5">Private</p>
            <h1 className="text-2xl font-extrabold">BrandHelper Admin</h1>
          </div>
          <div className="flex gap-2">
            {['portfolio', 'leads', 'stats'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition
                  ${tab === t ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 font-bold text-xs">Dismiss</button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ══ PORTFOLIO TAB ══ */}
        {tab === 'portfolio' && (
          <div>
            {/* Form */}
            <div className="bg-white rounded-2xl p-7 shadow-sm mb-10">
              <h2 className="text-xl font-extrabold mb-6">{editing ? '✏️ Edit Project' : '➕ Add New Project'}</h2>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2">Title <span className="text-red-500">*</span></label>
                    <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Kofi's Restaurant Website" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="What was built, for who, what outcome it delivered..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2">Preview Image URL</label>
                    <input className={inputClass} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://... (direct image link)" />
                    <p className="text-xs text-gray-400 mt-1">Imgur, Cloudinary, or any direct image URL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Live Site Link</label>
                    <input className={inputClass} value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://clientsite.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tags <span className="text-gray-400 font-normal text-xs">(comma separated)</span></label>
                  <input className={inputClass} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. React, E-commerce, Payments" />
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => set('featured', !form.featured)}
                    className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${form.featured ? 'bg-red-600' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.featured ? 'left-6' : 'left-0.5'}`} />
                  </button>
                  <label className="text-sm font-bold">Featured <span className="text-gray-400 font-normal">(shows on Home page + Portfolio featured section)</span></label>
                </div>
                {form.image && (
                  <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={!form.title || !form.description || saving}
                    className="flex-1 py-4 rounded-2xl bg-black text-white font-extrabold text-sm hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : editing ? 'Save Changes' : 'Add Project'}
                  </button>
                  {editing && (
                    <button onClick={() => { setForm(EMPTY_FORM); setEditing(null); }}
                      className="px-6 py-4 rounded-2xl border-2 border-gray-200 font-bold text-sm hover:border-gray-400 transition">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Project list */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">Projects ({projects.length})</h2>
              <button onClick={loadProjects} className="text-xs text-gray-400 hover:text-black font-bold uppercase tracking-widest transition">↻ Refresh</button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Loading from server...</div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-300">
                <span className="text-5xl block mb-3">📂</span>
                <p className="font-semibold text-gray-400">No projects yet — add one above</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-20 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {project.image
                        ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        : <span className="text-2xl">🖥️</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                          <h3 className="text-sm font-semibold mt-0.5">{project.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          {project.featured && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>}
                          {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-bold">Live ↗</a>}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-1">{project.description}</p>
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button onClick={() => handleEdit(project)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold hover:border-black transition">Edit</button>
                      <button onClick={() => handleToggleFeatured(project)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${project.featured ? 'border-red-200 text-red-500 hover:border-red-400' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                        {project.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      {confirmDel === project.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(project.id)} className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">Yes</button>
                          <button onClick={() => setConfirmDel(null)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDel(project.id)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-red-400 hover:border-red-400 hover:text-red-600 transition">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ LEADS TAB ══ */}
        {tab === 'leads' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-xl font-extrabold">Leads ({leads.length})</h2>
              <button onClick={loadLeads} className="text-xs text-gray-400 hover:text-black font-bold uppercase tracking-widest transition">↻ Refresh</button>
            </div>

            {leadsLoading ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Loading leads from server...</div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-300">
                <span className="text-5xl block mb-3">📬</span>
                <p className="font-semibold text-gray-400">No leads yet — form submissions will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {leads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Lead header */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                            {lead.status}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{lead.form_type}</span>
                          <span className="text-xs text-gray-300">{new Date(lead.server_time).toLocaleDateString('en-GB')}</span>
                        </div>
                        <h3 className="text-sm font-semibold">{lead.client_name || 'Anonymous'} {lead.business_name ? `— ${lead.business_name}` : ''}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{lead.email} {lead.phone ? `· ${lead.phone}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition">
                            📧 Reply
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-bold hover:bg-green-100 transition">
                            💬 WA
                          </a>
                        )}
                        <span className="text-gray-300 text-xs">{expandedLead === lead.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expanded lead details */}
                    {expandedLead === lead.id && (
                      <div className="border-t border-gray-50 p-5">
                        {/* Status updater */}
                        <div className="mb-5">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Update Status</p>
                          <div className="flex flex-wrap gap-2">
                            {LEAD_STATUSES.map(s => (
                              <button key={s} onClick={() => handleLeadStatus(lead.id, s)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition border
                                  ${lead.status === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Brief */}
                        {lead.full_brief && (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Brief</p>
                            <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-x-auto max-h-64 overflow-y-auto">
                              {lead.full_brief}
                            </pre>
                          </div>
                        )}

                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleDeleteLead(lead.id)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:border-red-400 hover:text-red-600 transition">
                            Delete Lead
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ STATS TAB ══ */}
        {tab === 'stats' && (
          <div>
            <h2 className="text-xl font-extrabold mb-6">Overview</h2>
            {!stats ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Loading stats...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Projects</p>
                  <p className="text-4xl font-extrabold text-black">{stats.projects.total}</p>
                  <p className="text-sm text-gray-400 mt-1">{stats.projects.featured} featured</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Leads</p>
                  <p className="text-4xl font-extrabold text-black">{stats.leads.total}</p>
                  <p className="text-sm text-green-600 mt-1">{stats.leads.by_status?.new || 0} new</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Leads by Status</p>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {Object.entries(stats.leads.by_status || {}).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leads by Form</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(stats.leads.by_form || {}).map(([form, count]) => (
                      <div key={form} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">{form}</p>
                        <p className="text-2xl font-extrabold">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}