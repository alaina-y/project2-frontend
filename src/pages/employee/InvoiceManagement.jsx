import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getAutoPolicies, getHomePolicies } from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const today = new Date().toISOString().split('T')[0];

const emptyForm = {
  invoice_date: '', due_date: '', invoice_amt: '', policy_type: 'A', a_policy_id: '', h_policy_id: '',
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

export default function InvoiceManagement() {
  const [data, setData] = useState([]);
  const [autoPolicies, setAutoPolicies] = useState([]);
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
    console.log('InvoiceManagement mounted');
    try {
      const [invRes, autoPolRes, homePolRes] = await Promise.all([getInvoices(), getAutoPolicies(), getHomePolicies()]);
      console.log('API response (invoices):', invRes);
      console.log('API response (auto policies):', autoPolRes);
      console.log('API response (home policies):', homePolRes);
      setData(normalizeArray(invRes, 'invoices'));
      setAutoPolicies(normalizeArray(autoPolRes, 'auto_policies'));
      setHomePolicies(normalizeArray(homePolRes, 'home_policies'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const filtered = data.filter((inv) =>
    String(inv.invoice_id).includes(search) ||
    String(inv.a_policy_id || '').includes(search) ||
    String(inv.h_policy_id || '').includes(search)
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      invoice_date: row.invoice_date,
      due_date:     row.due_date,
      invoice_amt:  String(row.invoice_amt),
      policy_type:  row.a_policy_id ? 'A' : 'H',
      a_policy_id:  row.a_policy_id ? String(row.a_policy_id) : '',
      h_policy_id:  row.h_policy_id ? String(row.h_policy_id) : '',
    });
    setModalOpen(true);
  };
  const handleClose  = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      invoice_date: form.invoice_date,
      due_date:     form.due_date,
      invoice_amt:  Number(form.invoice_amt),
      a_policy_id:  form.policy_type === 'A' && form.a_policy_id ? Number(form.a_policy_id) : null,
      h_policy_id:  form.policy_type === 'H' && form.h_policy_id ? Number(form.h_policy_id) : null,
    };
    try {
      if (editing) {
        await updateInvoice(editing.invoice_id, payload);
      } else {
        await createInvoice(payload);
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
      await deleteInvoice(deleteTarget.invoice_id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDeleteTarget(null);
    }
  };

  const isOverdue = (row) => row.due_date < today;

  const columns = [
    { key: 'invoice_id',   label: 'ID' },
    { key: 'invoice_date', label: 'Invoice Date' },
    { key: 'due_date',     label: 'Due Date', render: (v, row) => (
      <span className={isOverdue(row) ? 'text-red-600 font-medium' : ''}>{v}</span>
    )},
    { key: 'invoice_amt',  label: 'Amount', render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'policy_type',  label: 'Type',   render: (_, row) => row.a_policy_id
      ? <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">Auto</span>
      : <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Home</span>
    },
    { key: 'policy_id',   label: 'Policy ID', render: (_, row) => row.a_policy_id ?? row.h_policy_id ?? '—' },
    { key: 'overdue',     label: 'Status', render: (_, row) => isOverdue(row)
      ? <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold">Overdue</span>
      : <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-semibold">On Time</span>
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Invoice Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}
          <div className="flex items-center justify-between gap-4">
            <input type="text" placeholder="Search by invoice # or policy ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={openAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Invoice</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
          ) : (
            <>
              <p className="text-xs text-gray-400">{filtered.length} record(s) — <span className="text-red-500">{filtered.filter(isOverdue).length} overdue</span></p>
              <DataTable columns={columns} data={filtered} keyField="invoice_id" onEdit={openEdit} onDelete={setDeleteTarget} />
            </>
          )}
        </main>
      </div>

      <FormModal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Invoice' : 'Add Invoice'} onSubmit={handleSubmit} submitLabel={submitting ? 'Saving…' : editing ? 'Update' : 'Create'}>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Invoice Date *">
            <input type="date" name="invoice_date" value={form.invoice_date} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
          <FieldGroup label="Due Date *">
            <input type="date" name="due_date" value={form.due_date} onChange={handleChange} required className={inputCls} />
          </FieldGroup>
        </div>
        <FieldGroup label="Invoice Amount ($) *">
          <input type="number" step="0.01" name="invoice_amt" value={form.invoice_amt} onChange={handleChange} required placeholder="600.00" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Policy Type *">
          <select name="policy_type" value={form.policy_type} onChange={handleChange} required className={inputCls}>
            <option value="A">Auto Policy</option>
            <option value="H">Home Policy</option>
          </select>
        </FieldGroup>
        {form.policy_type === 'A' && (
          <FieldGroup label="Auto Policy *">
            <select name="a_policy_id" value={form.a_policy_id} onChange={handleChange} required className={inputCls}>
              <option value="">-- Select Auto Policy --</option>
              {autoPolicies.map((p) => <option key={p.a_policy_id} value={p.a_policy_id}>Policy #{p.a_policy_id}</option>)}
            </select>
          </FieldGroup>
        )}
        {form.policy_type === 'H' && (
          <FieldGroup label="Home Policy *">
            <select name="h_policy_id" value={form.h_policy_id} onChange={handleChange} required className={inputCls}>
              <option value="">-- Select Home Policy --</option>
              {homePolicies.map((p) => <option key={p.h_policy_id} value={p.h_policy_id}>Policy #{p.h_policy_id}</option>)}
            </select>
          </FieldGroup>
        )}
      </FormModal>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Invoice</h3>
            <p className="text-sm text-gray-600 mb-5">Delete invoice <strong>#{deleteTarget.invoice_id}</strong>?</p>
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
