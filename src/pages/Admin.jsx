import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import AdminAuth, { LogoutButton } from "../components/AdminAuth";
import * as api from "../utils/api";

// ── Constants ─────────────────────────────────────────────────────────────────
const PIPELINE_COLS = [
  { key: 'new',         label: 'New',         color: 'bg-blue-500'   },
  { key: 'contacted',   label: 'Contacted',   color: 'bg-yellow-500' },
  { key: 'quoted',      label: 'Quoted',      color: 'bg-purple-500' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-orange-500' },
  { key: 'won',         label: 'Won ✓',       color: 'bg-green-500'  },
  { key: 'lost',        label: 'Lost',        color: 'bg-red-400'    },
];

const PROJECT_STATUSES = ['not_started','in_progress','review','revision','delivered','completed','paused','cancelled'];
const CLIENT_STATUSES  = ['active','completed','paused','archived'];
const QUOTE_STATUSES   = ['draft','sent','accepted','declined','expired'];
const NOTE_TYPES       = ['note','call','email','whatsapp','meeting','other'];
const MEETING_TYPES    = ['call','video','in_person','whatsapp'];
const LEAD_SOURCES     = ['website','manual','referral','social','other'];
const CATEGORIES       = ['Website Design','Brand Strategy','Ads Management','Technical Support','Other'];

const STATUS_COLOR = {
  new:         'bg-blue-100 text-blue-700',
  contacted:   'bg-yellow-100 text-yellow-700',
  quoted:      'bg-purple-100 text-purple-700',
  negotiating: 'bg-orange-100 text-orange-700',
  won:         'bg-green-100 text-green-700',
  lost:        'bg-red-100 text-red-600',
  active:      'bg-green-100 text-green-700',
  completed:   'bg-gray-100 text-gray-600',
  paused:      'bg-yellow-100 text-yellow-700',
  cancelled:   'bg-red-100 text-red-600',
  in_progress: 'bg-blue-100 text-blue-700',
  not_started: 'bg-gray-100 text-gray-500',
  review:      'bg-purple-100 text-purple-700',
  revision:    'bg-orange-100 text-orange-700',
  delivered:   'bg-teal-100 text-teal-700',
  archived:    'bg-gray-100 text-gray-400',
  draft:       'bg-gray-100 text-gray-500',
  sent:        'bg-blue-100 text-blue-700',
  accepted:    'bg-green-100 text-green-700',
  declined:    'bg-red-100 text-red-600',
  expired:     'bg-gray-100 text-gray-400',
};

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white";
const sel = `${inp} cursor-pointer`;

// ── Tiny shared components ────────────────────────────────────────────────────
const Badge = ({ status }) => (
  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[status] || 'bg-gray-100 text-gray-500'}`}>
    {status?.replace(/_/g,' ')}
  </span>
);

const Lbl = ({ children, req }) => (
  <label className="block text-xs font-bold text-gray-600 mb-1.5">
    {children}{req && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Btn = ({ onClick, children, variant='primary', disabled, small }) => {
  const base = `font-bold transition rounded-xl ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`;
  const v = {
    primary: 'bg-black text-white hover:bg-red-600',
    outline: 'border border-gray-200 text-gray-600 hover:border-black',
    danger:  'border border-red-200 text-red-500 hover:bg-red-50',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} ${v[variant]} disabled:opacity-40 disabled:cursor-not-allowed`}>
      {children}
    </button>
  );
};

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    style={{background:'rgba(0,0,0,0.7)'}} onClick={onClose}>
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?'max-w-3xl':'max-w-lg'} max-h-[90vh] overflow-y-auto`}
      onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
        <h3 className="font-extrabold text-base">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black text-xl font-bold">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-GB') : '—';
const fmtMoney = (n, c='USD') => n ? `${c} ${Number(n).toLocaleString()}` : '—';

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN INNER — rendered only after auth
// ══════════════════════════════════════════════════════════════════════════════
function AdminInner({ onLogout }) {
  const [tab,     setTab]     = useState('pipeline');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const [leads,     setLeads]     = useState([]);
  const [clients,   setClients]   = useState([]);
  const [projects,  setProjects]  = useState([]);
  const [quotes,    setQuotes]    = useState([]);
  const [reminders, setReminders] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [stats,     setStats]     = useState(null);
  const [meetings,  setMeetings]  = useState([]);
  const [modal,     setModal]     = useState(null);

  const closeModal = () => setModal(null);

  const load = useCallback(async (which) => {
    setLoading(true);
    try {
      if (which === 'leads'     || which === 'all') setLeads((await api.getLeads()).data);
      if (which === 'clients'   || which === 'all') setClients((await api.getClients()).data);
      if (which === 'projects'  || which === 'all') setProjects((await api.getProjects()).data);
      if (which === 'quotes'    || which === 'all') setQuotes((await api.getQuotes()).data);
      if (which === 'reminders' || which === 'all') setReminders((await api.getReminders()).data);
      if (which === 'portfolio' || which === 'all') setPortfolio((await api.getPortfolio()).data);
      if (which === 'stats'     || which === 'all') setStats((await api.getStats()).data);
      if (which === 'meetings'  || which === 'all') setMeetings((await api.getMeetings()).data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load('all'); }, []);
  useEffect(() => {
    const map = { pipeline:'leads', leads:'leads', clients:'clients', projects:'projects', quotes:'quotes', reminders:'reminders', portfolio:'portfolio', stats:'stats' };
    if (map[tab]) load(map[tab]);
  }, [tab]);

  const E = (msg) => setError(msg);

  const TABS = [
    { key:'pipeline',  icon:'⚡', label:'Pipeline'  },
    { key:'leads',     icon:'📬', label:'Leads'     },
    { key:'clients',   icon:'👥', label:'Clients'   },
    { key:'projects',  icon:'🔧', label:'Projects'  },
    { key:'quotes',    icon:'📄', label:'Quotes'    },
    { key:'reminders', icon:'🔔', label:'Reminders' },
    { key:'portfolio', icon:'🖥️', label:'Portfolio' },
    { key:'stats',     icon:'📊', label:'Stats'     },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black">
      <Helmet><title>Admin — TBH CRM</title><meta name="robots" content="noindex,nofollow"/></Helmet>

      {/* Header */}
      <div className="bg-black text-white px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Private</p>
            <h1 className="text-lg font-extrabold">
              The Brand<span className="text-red-600">Helper</span> CRM
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition
                  ${tab === t.key ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                {t.icon} {t.label}
              </button>
            ))}
            {/* Logout button */}
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between">
            <p className="text-red-700 text-sm">⚠️ {error}</p>
            <button onClick={() => setError('')} className="text-red-400 font-bold text-xs">✕</button>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <>
          {modal.type === 'lead_form'     && <LeadForm     data={modal.data} onClose={closeModal} onSave={() => { load('leads');     closeModal(); }} onError={E} />}
          {modal.type === 'lead_view'     && <LeadView     data={modal.data} onClose={closeModal} onConvert={async id => { try { await api.convertLead(id); load('all'); closeModal(); } catch(e){E(e.message);} }} onUpdate={() => load('leads')} onError={E} />}
          {modal.type === 'client_form'   && <ClientForm   data={modal.data} onClose={closeModal} onSave={() => { load('clients');   closeModal(); }} onError={E} />}
          {modal.type === 'client_view'   && <ClientView   data={modal.data} onClose={closeModal} onUpdate={() => load('clients')} onError={E} />}
          {modal.type === 'project_form'  && <ProjectForm  data={modal.data} clients={clients} onClose={closeModal} onSave={() => { load('projects');  closeModal(); }} onError={E} />}
          {modal.type === 'project_view'  && <ProjectView  data={modal.data} onClose={closeModal} onUpdate={() => load('projects')} onError={E} />}
          {modal.type === 'quote_form'    && <QuoteForm    data={modal.data} leads={leads} clients={clients} onClose={closeModal} onSave={() => { load('quotes');    closeModal(); }} onError={E} />}
          {modal.type === 'quote_view'    && <QuoteView    data={modal.data} onClose={closeModal} />}
          {modal.type === 'reminder_form' && <ReminderForm data={modal.data} leads={leads} clients={clients} projects={projects} onClose={closeModal} onSave={() => { load('reminders'); closeModal(); }} onError={E} />}
          {modal.type === 'portfolio_form'&& <PortfolioForm data={modal.data} onClose={closeModal} onSave={() => { load('portfolio'); closeModal(); }} onError={E} />}
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'pipeline'  && <PipelineTab  leads={leads} onMove={async (id,s) => { try { await api.updateLead(id,{status:s}); load('leads'); } catch(e){E(e.message);} }} onView={l => setModal({type:'lead_view',data:l})} onAdd={() => setModal({type:'lead_form',data:null})} />}
        {tab === 'leads'     && <LeadsTab     leads={leads} onView={l => setModal({type:'lead_view',data:l})} onAdd={() => setModal({type:'lead_form',data:null})} onEdit={l => setModal({type:'lead_form',data:l})} onDelete={async id => { try { await api.deleteLead(id); load('leads'); } catch(e){E(e.message);} }} onConvert={async id => { try { await api.convertLead(id); load('all'); } catch(e){E(e.message);} }} />}
        {tab === 'clients'   && <ClientsTab   clients={clients} onView={c => setModal({type:'client_view',data:c})} onAdd={() => setModal({type:'client_form',data:null})} onEdit={c => setModal({type:'client_form',data:c})} onDelete={async id => { try { await api.deleteClient(id); load('clients'); } catch(e){E(e.message);} }} />}
        {tab === 'projects'  && <ProjectsTab  projects={projects} onView={p => setModal({type:'project_view',data:p})} onAdd={() => setModal({type:'project_form',data:null})} onEdit={p => setModal({type:'project_form',data:p})} onDelete={async id => { try { await api.deleteProject(id); load('projects'); } catch(e){E(e.message);} }} />}
        {tab === 'quotes'    && <QuotesTab    quotes={quotes} onView={q => setModal({type:'quote_view',data:q})} onAdd={() => setModal({type:'quote_form',data:null})} onDelete={async id => { try { await api.deleteQuote(id); load('quotes'); } catch(e){E(e.message);} }} onStatus={async (id,s) => { try { await api.updateQuote(id,{status:s}); load('quotes'); } catch(e){E(e.message);} }} />}
        {tab === 'reminders' && <RemindersTab reminders={reminders} onAdd={() => setModal({type:'reminder_form',data:null})} onComplete={async id => { try { await api.completeReminder(id); load('reminders'); } catch(e){E(e.message);} }} onDelete={async id => { try { await api.deleteReminder(id); load('reminders'); } catch(e){E(e.message);} }} />}
        {tab === 'portfolio' && <PortfolioTab items={portfolio} onAdd={() => setModal({type:'portfolio_form',data:null})} onEdit={p => setModal({type:'portfolio_form',data:p})} onDelete={async id => { try { await api.deletePortfolio(id); load('portfolio'); } catch(e){E(e.message);} }} onToggleFeatured={async item => { try { await api.updatePortfolio(item._id,{featured:!item.featured}); load('portfolio'); } catch(e){E(e.message);} }} />}
        {tab === 'stats'     && <StatsTab     stats={stats} />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — wraps AdminInner with auth
// ══════════════════════════════════════════════════════════════════════════════
export default function Admin() {
  return (
    <AdminAuth>
      {({ onLogout }) => <AdminInner onLogout={onLogout} />}
    </AdminAuth>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PIPELINE TAB
// ══════════════════════════════════════════════════════════════════════════════
function PipelineTab({ leads, onMove, onView, onAdd }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-extrabold">Pipeline</h2>
        <Btn onClick={onAdd}>+ Add Lead</Btn>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLS.map(col => {
          const colLeads = leads.filter(l => l.status === col.key);
          return (
            <div key={col.key} className="shrink-0 w-64 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className={`${col.color} px-4 py-2 flex items-center justify-between`}>
                <span className="text-white text-xs font-extrabold uppercase tracking-widest">{col.label}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              <div className="p-3 flex flex-col gap-2 min-h-[120px]">
                {colLeads.map(lead => (
                  <div key={lead._id}
                    className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                    onClick={() => onView(lead)}>
                    <p className="text-sm font-bold truncate">{lead.client_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 truncate">{lead.business_name || lead.service || '—'}</p>
                    {lead.budget && <p className="text-xs text-green-600 font-bold mt-1">{lead.budget}</p>}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {PIPELINE_COLS.filter(c => c.key !== col.key).slice(0,2).map(c => (
                        <button key={c.key}
                          onClick={e => { e.stopPropagation(); onMove(lead._id, c.key); }}
                          className="text-xs text-gray-400 hover:text-black border border-gray-200 px-2 py-0.5 rounded-full transition">
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && <p className="text-xs text-gray-300 text-center py-4">Empty</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LEADS TAB
// ══════════════════════════════════════════════════════════════════════════════
function LeadsTab({ leads, onView, onAdd, onEdit, onDelete, onConvert }) {
  const [search, setSearch] = useState('');
  const filtered = leads.filter(l =>
    `${l.client_name} ${l.business_name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Leads ({leads.length})</h2>
        <div className="flex gap-2">
          <input className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-gray-800 bg-white"
            placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <Btn onClick={onAdd}>+ Add Lead</Btn>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map(lead => (
          <div key={lead._id}
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:shadow-md transition"
            onClick={() => onView(lead)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge status={lead.status} />
                <span className="text-xs text-gray-400">{lead.source}</span>
                <span className="text-xs text-gray-300">{fmtDate(lead.createdAt)}</span>
              </div>
              <p className="font-semibold text-sm">{lead.client_name || 'Unknown'}{lead.business_name ? ` — ${lead.business_name}` : ''}</p>
              <p className="text-xs text-gray-400">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
              {lead.budget && <p className="text-xs text-green-600 font-bold mt-0.5">{lead.budget} · {lead.service || lead.form_type}</p>}
            </div>
            <div className="flex gap-2 flex-wrap shrink-0" onClick={e => e.stopPropagation()}>
              {lead.email && <a href={`mailto:${lead.email}`} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition">📧</a>}
              {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg font-bold hover:bg-green-100 transition">💬</a>}
              {lead.status !== 'won' && <Btn small variant="success" onClick={() => onConvert(lead._id)}>Convert</Btn>}
              <Btn small variant="outline" onClick={() => onEdit(lead)}>Edit</Btn>
              <Btn small variant="danger"  onClick={() => onDelete(lead._id)}>Del</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">📬</p><p className="text-gray-400 font-semibold">No leads yet</p></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function ClientsTab({ clients, onView, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Clients ({clients.length})</h2>
        <Btn onClick={onAdd}>+ Add Client</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <div key={client._id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => onView(client)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-lg shrink-0">
                {(client.name || '?')[0].toUpperCase()}
              </div>
              <Badge status={client.status} />
            </div>
            <p className="font-bold text-sm mb-0.5">{client.name}</p>
            {client.business_name && <p className="text-xs text-gray-500 mb-1">{client.business_name}</p>}
            <p className="text-xs text-gray-400">{client.email}</p>
            <p className="text-xs text-gray-400">{client.phone}</p>
            <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
              <Btn small variant="outline" onClick={() => onEdit(client)}>Edit</Btn>
              <Btn small variant="danger"  onClick={() => onDelete(client._id)}>Delete</Btn>
            </div>
          </div>
        ))}
        {clients.length === 0 && <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">👥</p><p className="text-gray-400 font-semibold">No clients yet</p></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function ProjectsTab({ projects, onView, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Projects ({projects.length})</h2>
        <Btn onClick={onAdd}>+ New Project</Btn>
      </div>
      <div className="flex flex-col gap-4">
        {projects.map(proj => {
          const client = proj.client_id;
          return (
            <div key={proj._id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => onView(proj)}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <Badge status={proj.status} />
                  <h3 className="font-bold text-sm mt-1">{proj.title}</h3>
                  {client && <p className="text-xs text-gray-400">{client.name}{client.business_name ? ` — ${client.business_name}` : ''}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-extrabold text-green-600">{fmtMoney(proj.agreed_price, proj.currency)}</p>
                  <p className="text-xs text-gray-400">{proj.deadline ? `Due ${fmtDate(proj.deadline)}` : 'No deadline'}</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{proj.progress}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full transition-all" style={{width:`${proj.progress}%`}} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${proj.deposit_paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Deposit {proj.deposit_paid ? '✓ Paid' : 'Pending'}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${proj.balance_paid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Balance {proj.balance_paid ? '✓ Paid' : 'Pending'}
                </span>
              </div>
              <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                <Btn small variant="outline" onClick={() => onEdit(proj)}>Edit</Btn>
                <Btn small variant="danger"  onClick={() => onDelete(proj._id)}>Delete</Btn>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">🔧</p><p className="text-gray-400 font-semibold">No projects yet</p></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// QUOTES TAB
// ══════════════════════════════════════════════════════════════════════════════
function QuotesTab({ quotes, onView, onAdd, onDelete, onStatus }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Quotes ({quotes.length})</h2>
        <Btn onClick={onAdd}>+ New Quote</Btn>
      </div>
      <div className="flex flex-col gap-3">
        {quotes.map(q => (
          <div key={q._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-3 flex-wrap">
            <div className="cursor-pointer flex-1" onClick={() => onView(q)}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-extrabold text-gray-500">{q.quote_number}</span>
                <Badge status={q.status} />
                <span className="text-xs text-gray-300">{fmtDate(q.createdAt)}</span>
              </div>
              <p className="font-bold text-sm">{q.client_name || q.business_name || 'Unknown Client'}</p>
              <p className="text-base font-extrabold text-green-600 mt-1">{fmtMoney(q.total, q.currency)}</p>
              <p className="text-xs text-gray-400">Deposit: {fmtMoney(q.deposit_amount, q.currency)} ({q.deposit_percent}%)</p>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              <select className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none bg-white cursor-pointer"
                value={q.status} onChange={e => onStatus(q._id, e.target.value)}>
                {QUOTE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Btn small variant="danger" onClick={() => onDelete(q._id)}>Del</Btn>
            </div>
          </div>
        ))}
        {quotes.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">📄</p><p className="text-gray-400 font-semibold">No quotes yet</p></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REMINDERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function RemindersTab({ reminders, onAdd, onComplete, onDelete }) {
  const overdue  = reminders.filter(r => new Date(r.due_date) < new Date());
  const upcoming = reminders.filter(r => new Date(r.due_date) >= new Date());
  const Row = ({ r }) => (
    <div className={`bg-white rounded-xl p-4 flex items-center gap-3 ${new Date(r.due_date) < new Date() ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-400'}`}>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{r.title}</p>
        {r.note && <p className="text-xs text-gray-400 mt-0.5">{r.note}</p>}
        <p className={`text-xs font-bold mt-1 ${new Date(r.due_date) < new Date() ? 'text-red-500' : 'text-yellow-600'}`}>
          {new Date(r.due_date) < new Date() ? '⚠️ Overdue · ' : '📅 '}{fmtDate(r.due_date)}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Btn small variant="success" onClick={() => onComplete(r._id)}>Done ✓</Btn>
        <Btn small variant="danger"  onClick={() => onDelete(r._id)}>Del</Btn>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Reminders ({reminders.length})</h2>
        <Btn onClick={onAdd}>+ Add Reminder</Btn>
      </div>
      {overdue.length > 0 && <div className="mb-6"><p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">⚠️ Overdue ({overdue.length})</p><div className="flex flex-col gap-2">{overdue.map(r=><Row key={r._id} r={r}/>)}</div></div>}
      {upcoming.length > 0 && <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Upcoming</p><div className="flex flex-col gap-2">{upcoming.map(r=><Row key={r._id} r={r}/>)}</div></div>}
      {reminders.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">🔔</p><p className="text-gray-400 font-semibold">No reminders</p></div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO TAB
// ══════════════════════════════════════════════════════════════════════════════
function PortfolioTab({ items, onAdd, onEdit, onDelete, onToggleFeatured }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">Portfolio ({items.length})</h2>
        <Btn onClick={onAdd}>+ Add Project</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <span className="text-4xl">🖥️</span>}
              {item.featured && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>}
            </div>
            <div className="p-4">
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest">{item.category}</p>
              <h3 className="font-semibold text-sm mt-1 mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.description}</p>
              <div className="flex gap-2 flex-wrap">
                <Btn small variant="outline" onClick={() => onEdit(item)}>Edit</Btn>
                <Btn small variant={item.featured ? 'danger' : 'outline'} onClick={() => onToggleFeatured(item)}>{item.featured ? 'Unfeature' : 'Feature'}</Btn>
                <Btn small variant="danger" onClick={() => onDelete(item._id)}>Del</Btn>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition">Live ↗</a>}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-300"><p className="text-5xl mb-3">🖥️</p><p className="text-gray-400 font-semibold">No portfolio items</p></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS TAB
// ══════════════════════════════════════════════════════════════════════════════
function StatsTab({ stats }) {
  if (!stats) return <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading stats...</div>;
  const s = stats;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-extrabold">Analytics Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Leads',     value:s.leads.total,     sub:`${s.leads.this_month} this month`,       color:'text-blue-600'   },
          { label:'Won Leads',       value:s.leads.won,       sub:`${s.leads.conversion_rate}% conversion`, color:'text-green-600'  },
          { label:'Active Clients',  value:s.clients.active,  sub:`${s.clients.total} total`,               color:'text-purple-600' },
          { label:'Active Projects', value:s.projects.active, sub:`${s.projects.total} total`,              color:'text-red-600'    },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p><p className="text-3xl font-extrabold text-green-600">${s.revenue.total.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pending Balance</p><p className="text-3xl font-extrabold text-yellow-600">${s.revenue.pending.toLocaleString()}</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leads by Status</p>
          <div className="flex flex-col gap-2">{Object.entries(s.leads.by_status||{}).map(([status,count])=><div key={status} className="flex items-center justify-between"><Badge status={status}/><span className="font-extrabold text-sm">{count}</span></div>)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leads by Form</p>
          <div className="flex flex-col gap-2">{Object.entries(s.leads.by_form||{}).map(([form,count])=><div key={form} className="flex items-center justify-between text-sm"><span className="text-gray-600 truncate max-w-[70%]">{form}</span><span className="font-extrabold">{count}</span></div>)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Due Reminders</p><p className={`text-4xl font-extrabold ${s.upcoming.reminders>0?'text-red-600':'text-gray-300'}`}>{s.upcoming.reminders}</p><p className="text-xs text-gray-400 mt-1">next 7 days</p></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upcoming Meetings</p><p className={`text-4xl font-extrabold ${s.upcoming.meetings>0?'text-blue-600':'text-gray-300'}`}>{s.upcoming.meetings}</p><p className="text-xs text-gray-400 mt-1">scheduled</p></div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FORMS
// ══════════════════════════════════════════════════════════════════════════════

function LeadForm({ data, onClose, onSave, onError }) {
  const [f, setF] = useState({ client_name:'', business_name:'', email:'', phone:'', industry:'', location:'', service:'', budget:'', timeline:'', message:'', source:'manual', status:'new', notes:'', follow_up_date:'', ...data });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = async () => {
    if (!f.client_name) return;
    setSaving(true);
    try { if (data?._id) await api.updateLead(data._id,f); else await api.createLead(f); onSave(); }
    catch(e) { onError(e.message); } finally { setSaving(false); }
  };
  return (
    <Modal title={data?'Edit Lead':'Add Lead'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl req>Full Name</Lbl><input className={inp} value={f.client_name} onChange={e=>set('client_name',e.target.value)} placeholder="Kofi Mensah"/></div>
          <div><Lbl>Business</Lbl><input className={inp} value={f.business_name} onChange={e=>set('business_name',e.target.value)} placeholder="Kofi's Store"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Email</Lbl><input className={inp} type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
          <div><Lbl>Phone/WhatsApp</Lbl><input className={inp} value={f.phone} onChange={e=>set('phone',e.target.value)} placeholder="+233 xx xxx xxxx"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Source</Lbl><select className={sel} value={f.source} onChange={e=>set('source',e.target.value)}>{LEAD_SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><Lbl>Status</Lbl><select className={sel} value={f.status} onChange={e=>set('status',e.target.value)}>{PIPELINE_COLS.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Service</Lbl><input className={inp} value={f.service} onChange={e=>set('service',e.target.value)} placeholder="Website Design"/></div>
          <div><Lbl>Budget</Lbl><input className={inp} value={f.budget} onChange={e=>set('budget',e.target.value)} placeholder="$300-$500"/></div>
        </div>
        <div><Lbl>Message</Lbl><textarea className={`${inp} resize-none`} rows={3} value={f.message} onChange={e=>set('message',e.target.value)} placeholder="What they need..."/></div>
        <div><Lbl>Internal Notes</Lbl><textarea className={`${inp} resize-none`} rows={2} value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
        <div><Lbl>Follow-up Date</Lbl><input className={inp} type="date" value={f.follow_up_date?f.follow_up_date.split('T')[0]:''} onChange={e=>set('follow_up_date',e.target.value)}/></div>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={!f.client_name||saving}>{saving?'Saving...':'Save Lead'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function LeadView({ data, onClose, onConvert, onUpdate, onError }) {
  const [notes, setNotes] = useState([]);
  const [note,  setNote]  = useState('');
  const [type,  setType]  = useState('note');
  useEffect(() => { api.getNotes({ lead_id: data._id }).then(r=>setNotes(r.data)).catch(()=>{}); }, [data._id]);
  const addNote = async () => {
    if (!note) return;
    try { await api.createNote({ lead_id:data._id, text:note, type }); const r = await api.getNotes({ lead_id:data._id }); setNotes(r.data); setNote(''); }
    catch(e) { onError(e.message); }
  };
  return (
    <Modal title="Lead Details" onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div><p className="text-xl font-extrabold">{data.client_name}</p>{data.business_name&&<p className="text-gray-500">{data.business_name}</p>}<div className="flex gap-2 mt-2 flex-wrap"><Badge status={data.status}/><span className="text-xs text-gray-400">{data.source} · {fmtDate(data.createdAt)}</span></div></div>
          {data.status !== 'won' && <Btn variant="success" onClick={() => onConvert(data._id)}>🎉 Convert to Client</Btn>}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[['Email',data.email],['Phone',data.phone],['Budget',data.budget],['Timeline',data.timeline],['Service',data.service],['Industry',data.industry]].map(([k,v])=>v?(<div key={k}><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{k}</p><p className="font-medium">{v}</p></div>):null)}
        </div>
        {data.full_brief&&<div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Brief</p><pre className="bg-gray-50 rounded-xl p-4 text-xs whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{data.full_brief}</pre></div>}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Activity Log</p>
          <div className="flex gap-2 mb-3">
            <select className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none bg-white shrink-0" value={type} onChange={e=>setType(e.target.value)}>{NOTE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
            <input className={inp} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..." onKeyDown={e=>e.key==='Enter'&&addNote()}/>
            <Btn onClick={addNote} disabled={!note}>Add</Btn>
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {notes.map(n=><div key={n._id} className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3"><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold shrink-0">{n.type}</span><div className="flex-1 min-w-0"><p className="text-sm">{n.text}</p><p className="text-xs text-gray-400 mt-0.5">{fmtDate(n.createdAt)}</p></div></div>)}
            {notes.length===0&&<p className="text-xs text-gray-300 text-center py-4">No activity yet</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ClientForm({ data, onClose, onSave, onError }) {
  const [f, setF] = useState({ name:'', business_name:'', email:'', phone:'', location:'', industry:'', website:'', notes:'', status:'active', source:'manual', ...data });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = async () => {
    if (!f.name) return;
    setSaving(true);
    try { if (data?._id) await api.updateClient(data._id,f); else await api.createClient(f); onSave(); }
    catch(e) { onError(e.message); } finally { setSaving(false); }
  };
  return (
    <Modal title={data?'Edit Client':'Add Client'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl req>Full Name</Lbl><input className={inp} value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Kofi Mensah"/></div>
          <div><Lbl>Business</Lbl><input className={inp} value={f.business_name} onChange={e=>set('business_name',e.target.value)}/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Email</Lbl><input className={inp} type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
          <div><Lbl>Phone</Lbl><input className={inp} value={f.phone} onChange={e=>set('phone',e.target.value)}/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Location</Lbl><input className={inp} value={f.location} onChange={e=>set('location',e.target.value)} placeholder="Accra, Ghana"/></div>
          <div><Lbl>Status</Lbl><select className={sel} value={f.status} onChange={e=>set('status',e.target.value)}>{CLIENT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <div><Lbl>Notes</Lbl><textarea className={`${inp} resize-none`} rows={3} value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={!f.name||saving}>{saving?'Saving...':'Save Client'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function ClientView({ data, onClose, onUpdate, onError }) {
  const [client, setClient] = useState(data);
  const [projects, setProjects] = useState([]);
  const [notes,    setNotes]    = useState([]);
  const [note,     setNote]     = useState('');
  const [noteType, setNoteType] = useState('note');
  useEffect(() => { api.getClient(data._id).then(r=>{ setClient(r.data); setProjects(r.data.projects||[]); setNotes(r.data.notes||[]); }).catch(()=>{}); }, [data._id]);
  const addNote = async () => {
    if (!note) return;
    try { await api.createNote({ client_id:data._id, text:note, type:noteType }); const r=await api.getClient(data._id); setNotes(r.data.notes||[]); setNote(''); }
    catch(e) { onError(e.message); }
  };
  return (
    <Modal title="Client Profile" onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-2xl shrink-0">{(client.name||'?')[0].toUpperCase()}</div>
          <div><p className="text-xl font-extrabold">{client.name}</p>{client.business_name&&<p className="text-gray-500 text-sm">{client.business_name}</p>}<Badge status={client.status}/></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[['Email',client.email],['Phone',client.phone],['Location',client.location],['Industry',client.industry]].map(([k,v])=>v?(<div key={k}><p className="text-xs font-bold text-gray-400 uppercase">{k}</p><p className="font-medium truncate">{v}</p></div>):null)}
        </div>
        {projects.length>0&&<div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Projects</p><div className="flex flex-col gap-2">{projects.map(p=><div key={p._id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between"><div><p className="text-sm font-bold">{p.title}</p><Badge status={p.status}/></div><div className="text-right"><p className="text-sm font-extrabold text-green-600">{fmtMoney(p.agreed_price)}</p><p className="text-xs text-gray-400">{p.progress}% done</p></div></div>)}</div></div>}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Activity</p>
          <div className="flex gap-2 mb-3">
            <select className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none bg-white shrink-0" value={noteType} onChange={e=>setNoteType(e.target.value)}>{NOTE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
            <input className={inp} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..." onKeyDown={e=>e.key==='Enter'&&addNote()}/>
            <Btn onClick={addNote} disabled={!note}>Add</Btn>
          </div>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {notes.map(n=><div key={n._id} className="bg-gray-50 rounded-xl px-4 py-2 flex items-start gap-2"><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold shrink-0">{n.type}</span><div><p className="text-sm">{n.text}</p><p className="text-xs text-gray-400">{fmtDate(n.createdAt)}</p></div></div>)}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ProjectForm({ data, clients, onClose, onSave, onError }) {
  const [f, setF] = useState({ client_id:'', title:'', description:'', service_type:'', agreed_price:0, deposit_amount:0, deposit_paid:false, balance_amount:0, balance_paid:false, currency:'USD', start_date:'', deadline:'', status:'not_started', progress:0, notes:'', ...data, client_id: data?.client_id?._id||data?.client_id||'' });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  useEffect(()=>{ const dep=Math.round(f.agreed_price*0.3); setF(p=>({...p,deposit_amount:dep,balance_amount:f.agreed_price-dep})); },[f.agreed_price]);
  const save = async () => {
    if (!f.client_id||!f.title) return;
    setSaving(true);
    try { if (data?._id) await api.updateProject(data._id,f); else await api.createProject(f); onSave(); }
    catch(e) { onError(e.message); } finally { setSaving(false); }
  };
  return (
    <Modal title={data?'Edit Project':'New Project'} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl req>Client</Lbl><select className={sel} value={f.client_id} onChange={e=>set('client_id',e.target.value)}><option value="">Select client...</option>{clients.map(c=><option key={c._id} value={c._id}>{c.name}{c.business_name?` — ${c.business_name}`:''}</option>)}</select></div>
          <div><Lbl req>Project Title</Lbl><input className={inp} value={f.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Website Design"/></div>
        </div>
        <div><Lbl>Description</Lbl><textarea className={`${inp} resize-none`} rows={2} value={f.description} onChange={e=>set('description',e.target.value)}/></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Lbl>Agreed Price</Lbl><input className={inp} type="number" value={f.agreed_price} onChange={e=>set('agreed_price',Number(e.target.value))}/></div>
          <div><Lbl>Deposit (30%)</Lbl><input className={inp} type="number" value={f.deposit_amount} onChange={e=>set('deposit_amount',Number(e.target.value))}/></div>
          <div><Lbl>Balance</Lbl><input className={inp} type="number" value={f.balance_amount} onChange={e=>set('balance_amount',Number(e.target.value))}/></div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={f.deposit_paid} onChange={e=>set('deposit_paid',e.target.checked)} className="w-4 h-4 accent-green-500"/>Deposit Paid</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={f.balance_paid} onChange={e=>set('balance_paid',e.target.checked)} className="w-4 h-4 accent-green-500"/>Balance Paid</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Start Date</Lbl><input className={inp} type="date" value={f.start_date?f.start_date.split('T')[0]:''} onChange={e=>set('start_date',e.target.value)}/></div>
          <div><Lbl>Deadline</Lbl><input className={inp} type="date" value={f.deadline?f.deadline.split('T')[0]:''} onChange={e=>set('deadline',e.target.value)}/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Lbl>Status</Lbl><select className={sel} value={f.status} onChange={e=>set('status',e.target.value)}>{PROJECT_STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}</select></div>
          <div><Lbl>Progress ({f.progress}%)</Lbl><input type="range" min={0} max={100} value={f.progress} onChange={e=>set('progress',Number(e.target.value))} className="w-full mt-3 accent-red-600"/></div>
        </div>
        <div><Lbl>Notes</Lbl><textarea className={`${inp} resize-none`} rows={2} value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={!f.client_id||!f.title||saving}>{saving?'Saving...':'Save Project'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function ProjectView({ data, onClose, onUpdate, onError }) {
  const [project,    setProject]    = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [meetings,   setMeetings]   = useState([]);
  const [notes,      setNotes]      = useState([]);
  const [newMs,      setNewMs]      = useState('');
  const [note,       setNote]       = useState('');
  const [noteType,   setNoteType]   = useState('note');
  const [newMeeting, setNewMeeting] = useState({ title:'', date:'', type:'call', duration_min:30 });
  const [showMtg,    setShowMtg]    = useState(false);
  const refresh = useCallback(async () => {
    try { const r=await api.getProject(data._id); setProject(r.data); setMilestones(r.data.milestones||[]); setMeetings(r.data.meetings||[]); setNotes(r.data.notes||[]); }
    catch(e) { onError(e.message); }
  }, [data._id]);
  useEffect(()=>{ refresh(); },[refresh]);
  const addMs  = async () => { if(!newMs) return; try { await api.addMilestone(data._id,{title:newMs}); setNewMs(''); refresh(); } catch(e){onError(e.message);} };
  const toggleMs = async id => { try { await api.toggleMilestone(id); refresh(); onUpdate(); } catch(e){onError(e.message);} };
  const deleteMs = async id => { try { await api.deleteMilestone(id); refresh(); } catch(e){onError(e.message);} };
  const addNote  = async () => { if(!note) return; try { await api.createNote({project_id:data._id,text:note,type:noteType}); setNote(''); refresh(); } catch(e){onError(e.message);} };
  const addMtg   = async () => { if(!newMeeting.title||!newMeeting.date) return; try { await api.createMeeting({...newMeeting,project_id:data._id}); setNewMeeting({title:'',date:'',type:'call',duration_min:30}); setShowMtg(false); refresh(); } catch(e){onError(e.message);} };
  if (!project) return <Modal title="Project" onClose={onClose}><p className="text-gray-400 text-center py-8">Loading...</p></Modal>;
  const client = project.client_id;
  return (
    <Modal title={project.title} onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between flex-wrap gap-3">
          <div><Badge status={project.status}/>{client&&<p className="text-sm text-gray-500 mt-1">{client.name}{client.business_name?` — ${client.business_name}`:''}</p>}</div>
          <div className="text-right"><p className="text-2xl font-extrabold text-green-600">{fmtMoney(project.agreed_price)}</p><p className={`text-xs font-bold ${project.deposit_paid?'text-green-600':'text-yellow-600'}`}>{project.deposit_paid?'✓ Deposit paid':'⏳ Deposit pending'}</p><p className={`text-xs font-bold ${project.balance_paid?'text-green-600':'text-gray-400'}`}>{project.balance_paid?'✓ Balance paid':'Balance pending'}</p></div>
        </div>
        <div><div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{project.progress}%</span></div><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-600 rounded-full" style={{width:`${project.progress}%`}}/></div></div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Milestones ({milestones.filter(m=>m.completed).length}/{milestones.length})</p>
          <div className="flex flex-col gap-2 mb-3">
            {milestones.map(m=>(
              <div key={m._id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${m.completed?'bg-green-50 border-green-200':'bg-gray-50 border-gray-100'}`}>
                <button onClick={()=>toggleMs(m._id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${m.completed?'bg-green-500 border-green-500 text-white':'border-gray-300'}`}>{m.completed&&<span className="text-xs font-bold">✓</span>}</button>
                <p className={`flex-1 text-sm ${m.completed?'line-through text-gray-400':''}`}>{m.title}</p>
                <button onClick={()=>deleteMs(m._id)} className="text-gray-300 hover:text-red-500 text-xs font-bold shrink-0">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2"><input className={inp} value={newMs} onChange={e=>setNewMs(e.target.value)} placeholder="Add milestone..." onKeyDown={e=>e.key==='Enter'&&addMs()}/><Btn onClick={addMs} disabled={!newMs}>Add</Btn></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meetings</p><Btn small variant="outline" onClick={()=>setShowMtg(!showMtg)}>+ Meeting</Btn></div>
          {showMtg&&<div className="bg-gray-50 rounded-xl p-4 mb-3 flex flex-col gap-3"><div className="grid grid-cols-2 gap-2"><input className={inp} value={newMeeting.title} onChange={e=>setNewMeeting(p=>({...p,title:e.target.value}))} placeholder="Meeting title"/><input className={inp} type="datetime-local" value={newMeeting.date} onChange={e=>setNewMeeting(p=>({...p,date:e.target.value}))}/></div><div className="flex gap-2"><select className={sel} value={newMeeting.type} onChange={e=>setNewMeeting(p=>({...p,type:e.target.value}))}>{MEETING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select><Btn onClick={addMtg} disabled={!newMeeting.title||!newMeeting.date}>Save</Btn></div></div>}
          <div className="flex flex-col gap-2">{meetings.map(m=><div key={m._id} className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3"><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold shrink-0">{m.type}</span><p className="flex-1 text-sm font-medium">{m.title}</p><span className="text-xs text-gray-400 shrink-0">{new Date(m.date).toLocaleString('en-GB',{dateStyle:'short',timeStyle:'short'})}</span></div>)}{meetings.length===0&&<p className="text-xs text-gray-300 text-center py-3">No meetings scheduled</p>}</div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
          <div className="flex gap-2 mb-3"><select className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none bg-white shrink-0" value={noteType} onChange={e=>setNoteType(e.target.value)}>{NOTE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select><input className={inp} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add note..." onKeyDown={e=>e.key==='Enter'&&addNote()}/><Btn onClick={addNote} disabled={!note}>Add</Btn></div>
          <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">{notes.map(n=><div key={n._id} className="bg-gray-50 rounded-xl px-4 py-2 flex items-start gap-2"><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold shrink-0">{n.type}</span><div><p className="text-sm">{n.text}</p><p className="text-xs text-gray-400">{fmtDate(n.createdAt)}</p></div></div>)}</div>
        </div>
      </div>
    </Modal>
  );
}

function QuoteForm({ data, leads, clients, onClose, onSave, onError }) {
  const [f, setF] = useState({ client_name:'', client_email:'', client_phone:'', business_name:'', items:[{description:'',amount:0}], discount:0, deposit_percent:30, currency:'USD', valid_days:14, notes:'', status:'draft', ...data });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const setItem = (i,k,v) => setF(p=>{ const items=[...p.items]; items[i]={...items[i],[k]:k==='amount'?Number(v):v}; return {...p,items}; });
  const addItem = () => setF(p=>({...p,items:[...p.items,{description:'',amount:0}]}));
  const delItem = i => setF(p=>({...p,items:p.items.filter((_,idx)=>idx!==i)}));
  const subtotal = f.items.reduce((s,i)=>s+(i.amount||0),0);
  const total    = subtotal-(f.discount||0);
  const deposit  = Math.round(total*(f.deposit_percent/100));
  const fillFrom = id => { const c=clients.find(x=>x._id===id); if(c){set('client_name',c.name);set('business_name',c.business_name||'');set('client_email',c.email||'');set('client_phone',c.phone||'');} };
  const save = async () => { setSaving(true); try { if(data?._id) await api.updateQuote(data._id,f); else await api.createQuote(f); onSave(); } catch(e){onError(e.message);} finally{setSaving(false);} };
  return (
    <Modal title={data?'Edit Quote':'New Quote'} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div><Lbl>Fill from client</Lbl><select className={sel} onChange={e=>fillFrom(e.target.value)} defaultValue=""><option value="">Select client to autofill...</option>{clients.map(c=><option key={c._id} value={c._id}>{c.name}{c.business_name?` — ${c.business_name}`:''}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3"><div><Lbl>Client Name</Lbl><input className={inp} value={f.client_name} onChange={e=>set('client_name',e.target.value)}/></div><div><Lbl>Business</Lbl><input className={inp} value={f.business_name} onChange={e=>set('business_name',e.target.value)}/></div></div>
        <div className="grid grid-cols-2 gap-3"><div><Lbl>Email</Lbl><input className={inp} value={f.client_email} onChange={e=>set('client_email',e.target.value)}/></div><div><Lbl>Phone</Lbl><input className={inp} value={f.client_phone} onChange={e=>set('client_phone',e.target.value)}/></div></div>
        <div><Lbl>Line Items</Lbl><div className="flex flex-col gap-2 mb-2">{f.items.map((item,i)=><div key={i} className="flex gap-2"><input className={inp} value={item.description} onChange={e=>setItem(i,'description',e.target.value)} placeholder="e.g. Website Design"/><input className="border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none w-28 bg-white" type="number" value={item.amount} onChange={e=>setItem(i,'amount',e.target.value)}/>{f.items.length>1&&<button onClick={()=>delItem(i)} className="text-red-400 hover:text-red-600 font-bold px-2">✕</button>}</div>)}</div><Btn small variant="outline" onClick={addItem}>+ Add Line</Btn></div>
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">${subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-500">Discount</span><input className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm w-24 text-right outline-none bg-white" type="number" value={f.discount} onChange={e=>set('discount',Number(e.target.value))}/></div>
          <div className="flex justify-between font-extrabold text-base border-t pt-2"><span>Total</span><span className="text-green-600">${total.toLocaleString()}</span></div>
          <div className="flex justify-between text-yellow-600 font-bold"><span>Deposit ({f.deposit_percent}%)</span><span>${deposit.toLocaleString()}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3"><div><Lbl>Deposit %</Lbl><input className={inp} type="number" value={f.deposit_percent} onChange={e=>set('deposit_percent',Number(e.target.value))}/></div><div><Lbl>Valid (days)</Lbl><input className={inp} type="number" value={f.valid_days} onChange={e=>set('valid_days',Number(e.target.value))}/></div></div>
        <div><Lbl>Notes</Lbl><textarea className={`${inp} resize-none`} rows={2} value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={saving}>{saving?'Saving...':'Save Quote'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function QuoteView({ data, onClose }) {
  const q=data; const total=q.total||0; const deposit=q.deposit_amount||0;
  return (
    <Modal title={`Quote ${q.quote_number}`} onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start flex-wrap gap-4 pb-4 border-b">
          <div><p className="text-2xl font-extrabold">The Brand<span className="text-red-600">Helper</span></p><p className="text-xs text-gray-400 mt-1">davida@thebrandhelper.com · +233 50 165 7205</p></div>
          <div className="text-right"><p className="text-xs font-bold text-gray-400 uppercase">Quote</p><p className="text-xl font-extrabold">{q.quote_number}</p><Badge status={q.status}/><p className="text-xs text-gray-400 mt-1">Issued: {fmtDate(q.createdAt)}</p><p className="text-xs text-gray-400">Valid: {q.valid_days} days</p></div>
        </div>
        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Prepared For</p><p className="font-bold">{q.client_name}</p>{q.business_name&&<p className="text-sm text-gray-500">{q.business_name}</p>}{q.client_email&&<p className="text-sm text-gray-500">{q.client_email}</p>}</div>
        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Scope of Work</p><div className="border rounded-xl overflow-hidden"><div className="grid grid-cols-[1fr_auto] bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase"><span>Description</span><span>Amount</span></div>{(q.items||[]).map((item,i)=><div key={i} className="grid grid-cols-[1fr_auto] px-4 py-3 border-t text-sm"><span>{item.description}</span><span className="font-bold">${(item.amount||0).toLocaleString()}</span></div>)}</div></div>
        <div className="bg-gray-50 rounded-xl p-4">
          {q.discount>0&&<div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Discount</span><span className="text-red-600">-${q.discount.toLocaleString()}</span></div>}
          <div className="flex justify-between font-extrabold text-lg border-t pt-2"><span>Total</span><span className="text-green-600">${total.toLocaleString()}</span></div>
          <div className="flex justify-between text-yellow-600 font-bold text-sm mt-1"><span>Deposit ({q.deposit_percent}%)</span><span>${deposit.toLocaleString()}</span></div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-sm"><p className="font-bold text-blue-800 mb-1">Payment</p><p className="text-blue-700">30% deposit to start · Payoneer invoice · bank, card, or mobile money accepted</p></div>
        {q.notes&&<div className="bg-gray-50 rounded-xl p-4 text-sm"><p className="font-bold mb-1">Notes</p><p className="text-gray-600">{q.notes}</p></div>}
        <div className="flex gap-3 pt-2">
          <Btn onClick={()=>window.print()}>Print / Save PDF</Btn>
          <a href={`https://wa.me/233501657205?text=${encodeURIComponent(`Quote ${q.quote_number} — Total: $${total.toLocaleString()} · Deposit: $${deposit.toLocaleString()}`)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-sm font-bold bg-green-500 text-white rounded-xl hover:bg-green-600 transition">💬 Send on WhatsApp</a>
          <Btn variant="outline" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </Modal>
  );
}

function ReminderForm({ data, leads, clients, projects, onClose, onSave, onError }) {
  const [f, setF] = useState({ title:'', note:'', due_date:'', lead_id:'', client_id:'', project_id:'', ...data });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = async () => {
    if (!f.title||!f.due_date) return;
    setSaving(true);
    try { if(data?._id) await api.updateReminder(data._id,f); else await api.createReminder(f); onSave(); }
    catch(e){onError(e.message);} finally{setSaving(false);}
  };
  return (
    <Modal title="Add Reminder" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div><Lbl req>Title</Lbl><input className={inp} value={f.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Follow up with Kofi"/></div>
        <div><Lbl req>Due Date</Lbl><input className={inp} type="datetime-local" value={f.due_date} onChange={e=>set('due_date',e.target.value)}/></div>
        <div><Lbl>Note</Lbl><textarea className={`${inp} resize-none`} rows={2} value={f.note} onChange={e=>set('note',e.target.value)} placeholder="What to do or say..."/></div>
        <div><Lbl>Link to Lead</Lbl><select className={sel} value={f.lead_id} onChange={e=>set('lead_id',e.target.value)}><option value="">None</option>{leads.map(l=><option key={l._id} value={l._id}>{l.client_name}</option>)}</select></div>
        <div><Lbl>Link to Client</Lbl><select className={sel} value={f.client_id} onChange={e=>set('client_id',e.target.value)}><option value="">None</option>{clients.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
        <div><Lbl>Link to Project</Lbl><select className={sel} value={f.project_id} onChange={e=>set('project_id',e.target.value)}><option value="">None</option>{projects.map(p=><option key={p._id} value={p._id}>{p.title}</option>)}</select></div>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={!f.title||!f.due_date||saving}>{saving?'Saving...':'Save Reminder'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function PortfolioForm({ data, onClose, onSave, onError }) {
  const [f, setF] = useState({ title:'', category:'Website Design', description:'', image:'', link:'', tags:'', featured:false, ...data, tags:Array.isArray(data?.tags)?data.tags.join(', '):data?.tags||'' });
  const [imgMode, setImgMode] = useState(data?.image?.startsWith('data:')?'upload':'url');
  const [saving,  setSaving]  = useState(false);
  const fileRef = useRef(null);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const handleFile = async e => {
    const file=e.target.files?.[0]; if(!file) return;
    if(file.size>2*1024*1024){onError('Image too large — max 2MB'); return;}
    const reader=new FileReader(); reader.onload=()=>set('image',reader.result); reader.readAsDataURL(file);
  };
  const save = async () => {
    if (!f.title||!f.description) return;
    setSaving(true);
    try { const payload={...f,tags:f.tags.split(',').map(t=>t.trim()).filter(Boolean)}; if(data?._id) await api.updatePortfolio(data._id,payload); else await api.createPortfolio(payload); onSave(); }
    catch(e){onError(e.message);} finally{setSaving(false);}
  };
  return (
    <Modal title={data?'Edit Portfolio Item':'Add Portfolio Item'} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3"><div><Lbl req>Title</Lbl><input className={inp} value={f.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Belle Kreyashon"/></div><div><Lbl>Category</Lbl><select className={sel} value={f.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div></div>
        <div><Lbl req>Description</Lbl><textarea className={`${inp} resize-none`} rows={5} value={f.description} onChange={e=>set('description',e.target.value)} placeholder="Full project description..."/></div>
        <div>
          <Lbl>Image</Lbl>
          <div className="flex gap-2 mb-3"><button onClick={()=>setImgMode('url')} className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${imgMode==='url'?'bg-black text-white border-black':'border-gray-200 text-gray-500'}`}>Link URL</button><button onClick={()=>setImgMode('upload')} className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${imgMode==='upload'?'bg-black text-white border-black':'border-gray-200 text-gray-500'}`}>Upload File</button></div>
          {imgMode==='url'?<input className={inp} value={f.image.startsWith('data:')?'':f.image} onChange={e=>set('image',e.target.value)} placeholder="https://..."/>:<div onClick={()=>fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 transition">{f.image?.startsWith('data:')?<p className="text-sm text-green-600 font-bold">Image loaded</p>:<><p className="text-2xl mb-1">📁</p><p className="text-sm text-gray-500">Click to upload (max 2MB)</p></>}</div>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          {f.image&&<div className="h-28 rounded-xl overflow-hidden bg-gray-100 mt-2"><img src={f.image} alt="preview" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/></div>}
        </div>
        <div className="grid grid-cols-2 gap-3"><div><Lbl>Live Link</Lbl><input className={inp} value={f.link} onChange={e=>set('link',e.target.value)} placeholder="https://..."/></div><div><Lbl>Tags (comma separated)</Lbl><input className={inp} value={f.tags} onChange={e=>set('tags',e.target.value)} placeholder="React, E-commerce"/></div></div>
        <label className="flex items-center gap-3 cursor-pointer"><button onClick={()=>set('featured',!f.featured)} className={`w-12 h-6 rounded-full transition relative shrink-0 ${f.featured?'bg-red-600':'bg-gray-200'}`}><span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${f.featured?'left-6':'left-0.5'}`}/></button><span className="text-sm font-bold">Featured on Home page</span></label>
        <div className="flex gap-3 pt-2"><Btn onClick={save} disabled={!f.title||!f.description||saving}>{saving?'Saving...':'Save'}</Btn><Btn variant="outline" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}