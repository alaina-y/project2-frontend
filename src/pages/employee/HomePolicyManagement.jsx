import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getHomePolicies, createHomePolicy, updateHomePolicy, deleteHomePolicy, getCustomers } from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const emptyForm = {
  cust_id: '', start_date: '', end_date: '', premium_amount: '', h_policy_status: 'C',
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

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === 'C' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {status === 'C' ? 'Current' : 'Expired'}
    </span>
  );
}

export default function HomePolicyManagement() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    console.log('HomePolicyManagement mounted');
    try {
      const [polRes, custRes] = await Promise.all([getHomePolicies(), getCustomers()]);
      console.log('API response (home policies):', polRes);
      console.log('API response (customers):', custRes);
      setData(normalizeArray(polRes, 'home_policies'));
      setCustomers(normalizeArray(custRes, 'customers'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const custMap = Object.fromEntries(customers.map((c) => [c.cust_id, c.c_full_name]));

  const filtered = data.filter((p) => {
    const name = custMap[p.cust_id] || '';
    return String(p.h_policy_id).includes(search) || name.toLowerCase().includes(search.toLowerCase());
  });

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ cust_id: String(row.cust_id), start_date: row.start_date, end_date: row.end_date, premium_amount: String(row.premium_amount), h_policy_status: row.h_policy_status });
    setModalOpen(true);
  };
  const handleClose  = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, cust_id: Number(form.cust_id), premium_amount: Number(form.premium_amount) };
    try {
      if (editing) {
        await updateHomePolicy(editing.h_policy_id, payload);
      } else {
        await createHomePolicy(payload);
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
      await deleteHomePolicy(deleteTarget.h_policy_id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: 'h_policy_id',     label: 'Policy ID' },
    { key: 'cust_id',         label: 'Customer',  render: (v) => custMap[v] || `ID ${v}` },
    { key: 'start_date',      label: 'Start Date' },
    { key: 'end_date',        label: 'End Date' },
    { key: 'premium_amount',  label: 'Premium',   render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'h_policy_status', label: 'Status',    render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Home Policy Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}
          <div className="flex items-center justify-between gap-4">
            <input type="text" placeholder="Search by ID or customer…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={openAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Home Policy</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
          ) : (
            <>
              <p className="text-xs text-gray-400">{filtered.length} record(s)</p>
              <DataTable columns={columns} data={filtered} keyField="h_policy_id" onEdit={openEdit} onDelete={setDeleteTarget} />
            </>
          )}
        </main>
      </div>

      <FormModal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Home Policy' : 'Add Home Policy'} onSubmit={handleSubmit} submitLabel={submitting ? 'Saving…' : editing ? 'Update' : 'Create'}>
        <FieldGroup label="Customer *">
          <select name="cust_id" value={form.cust_id} onChange={handleChange} required className={inputCls}>
            <option value="">-- Select Customer --</option>
            {customers.filter((c) => c.cust_type === 'H' || c.cust_type === 'B').map((c) => (
              <option key={c.cust_id} value={c.cust_id}>{c.c_full_name}</option>
            ))}
          </select>
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Start Date *">
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
          <FieldGroup label="End Date *">
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
        </div>
        <FieldGroup label="Premium Amount ($) *">
          <input type="number" step="0.01" name="premium_amount" value={form.premium_amount} onChange={handleChange} required placeholder="1800.00" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Status *">
          <select name="h_policy_status" value={form.h_policy_status} onChange={handleChange} required className={inputCls}>
            <option value="C">Current</option>
            <option value="E">Expired</option>
          </select>
        </FieldGroup>
      </FormModal>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Home Policy</h3>
            <p className="text-sm text-gray-600 mb-5">Delete policy <strong>#{deleteTarget.h_policy_id}</strong>? This cannot be undone.</p>
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
