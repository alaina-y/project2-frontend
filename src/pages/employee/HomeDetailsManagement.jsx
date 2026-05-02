import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getHomes, createHome, updateHome, deleteHome, getHomePolicies } from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const emptyForm = {
  h_policy_id: '', purchase_date: '', purchase_value: '', home_area_sqft: '',
  home_type: 'S', fire_notification: '0', security_system: '0', swimming_pool: '', has_basement: '0',
};

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function YesNo({ value }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {value ? 'Yes' : 'No'}
    </span>
  );
}

const homeTypeLabel = { S: 'Single Family', M: 'Multi-Family', C: 'Condo', T: 'Townhouse' };
const poolLabel     = { U: 'Underground', O: 'Outdoor', I: 'Indoor', M: 'Multiple' };

export default function HomeDetailsManagement() {
  const [data, setData] = useState([]);
  const [homePolicies, setHomePolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    console.log('HomeDetailsManagement mounted');
    try {
      const [homesRes, polRes] = await Promise.all([getHomes(), getHomePolicies()]);
      console.log('API response (homes):', homesRes);
      console.log('API response (home policies):', polRes);
      setData(normalizeArray(homesRes, 'homes'));
      setHomePolicies(normalizeArray(polRes, 'home_policies'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const filtered = data.filter((h) =>
    String(h.home_id).includes(search) ||
    String(h.h_policy_id || '').includes(search)
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      h_policy_id:       row.h_policy_id !== null ? String(row.h_policy_id) : '',
      purchase_date:     row.purchase_date,
      purchase_value:    String(row.purchase_value),
      home_area_sqft:    String(row.home_area_sqft),
      home_type:         row.home_type,
      fire_notification: String(row.fire_notification),
      security_system:   String(row.security_system),
      swimming_pool:     row.swimming_pool || '',
      has_basement:      String(row.has_basement),
    });
    setModalOpen(true);
  };
  const handleClose  = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      h_policy_id:       form.h_policy_id ? Number(form.h_policy_id) : null,
      purchase_value:    Number(form.purchase_value),
      home_area_sqft:    Number(form.home_area_sqft),
      fire_notification: Number(form.fire_notification),
      security_system:   Number(form.security_system),
      swimming_pool:     form.swimming_pool || null,
      has_basement:      Number(form.has_basement),
    };
    try {
      if (editing) {
        await updateHome(editing.home_id, payload);
      } else {
        await createHome(payload);
      }
      await reload();
      handleClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteHome(deleteTarget.home_id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: 'home_id',           label: 'ID' },
    { key: 'h_policy_id',       label: 'Policy ID',    render: (v) => v ?? '—' },
    { key: 'purchase_date',     label: 'Purchase Date' },
    { key: 'purchase_value',    label: 'Value',        render: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'home_area_sqft',    label: 'Area (sqft)',  render: (v) => Number(v).toLocaleString() },
    { key: 'home_type',         label: 'Type',         render: (v) => homeTypeLabel[v] || v },
    { key: 'fire_notification', label: 'Fire Alarm',   render: (v) => <YesNo value={v} /> },
    { key: 'security_system',   label: 'Security',     render: (v) => <YesNo value={v} /> },
    { key: 'swimming_pool',     label: 'Pool',         render: (v) => v ? poolLabel[v] || v : '—' },
    { key: 'has_basement',      label: 'Basement',     render: (v) => <YesNo value={v} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Home Details Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}
          <div className="flex items-center justify-between gap-4">
            <input type="text" placeholder="Search by Home ID or Policy ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={openAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Home</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
          ) : (
            <>
              <p className="text-xs text-gray-400">{filtered.length} record(s)</p>
              <DataTable columns={columns} data={filtered} keyField="home_id" onEdit={openEdit} onDelete={setDeleteTarget} />
            </>
          )}
        </main>
      </div>

      <FormModal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Home' : 'Add Home'} onSubmit={handleSubmit} submitLabel={submitting ? 'Saving…' : editing ? 'Update' : 'Create'}>
        <FieldGroup label="Home Policy ID">
          <select name="h_policy_id" value={form.h_policy_id} onChange={handleChange} className={inputCls}>
            <option value="">-- None --</option>
            {homePolicies.map((p) => (
              <option key={p.h_policy_id} value={p.h_policy_id}>Policy #{p.h_policy_id}</option>
            ))}
          </select>
        </FieldGroup>
        <FieldGroup label="Purchase Date *">
          <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} required className={inputCls} />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Purchase Value ($) *">
            <input type="number" step="0.01" name="purchase_value" value={form.purchase_value} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
          <FieldGroup label="Area (sqft) *">
            <input type="number" step="0.01" name="home_area_sqft" value={form.home_area_sqft} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
        </div>
        <FieldGroup label="Home Type *">
          <select name="home_type" value={form.home_type} onChange={handleChange} required className={inputCls}>
            <option value="S">Single Family</option>
            <option value="M">Multi-Family</option>
            <option value="C">Condo</option>
            <option value="T">Townhouse</option>
          </select>
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Fire Alarm">
            <select name="fire_notification" value={form.fire_notification} onChange={handleChange} className={inputCls}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Security System">
            <select name="security_system" value={form.security_system} onChange={handleChange} className={inputCls}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </FieldGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Swimming Pool">
            <select name="swimming_pool" value={form.swimming_pool} onChange={handleChange} className={inputCls}>
              <option value="">None</option>
              <option value="U">Underground</option>
              <option value="O">Outdoor</option>
              <option value="I">Indoor</option>
              <option value="M">Multiple</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Basement">
            <select name="has_basement" value={form.has_basement} onChange={handleChange} className={inputCls}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </FieldGroup>
        </div>
      </FormModal>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Home</h3>
            <p className="text-sm text-gray-600 mb-5">Delete home <strong>#{deleteTarget.home_id}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
