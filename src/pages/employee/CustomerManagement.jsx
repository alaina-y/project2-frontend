import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const emptyForm = {
  c_full_name: '', c_address: '', c_phone: '', gender: '', marital_status: 'S', cust_type: 'A',
  username: '', password: '',
};

const genderLabel  = { M: 'Male', F: 'Female' };
const maritalLabel = { M: 'Married', S: 'Single', W: 'Widow/Widower' };
const typeLabel    = { A: 'Auto Only', H: 'Home Only', B: 'Both' };

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function CustomerManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    console.log('CustomerManagement mounted');
    try {
      const res = await getCustomers();
      console.log('API response:', res);
      setData(normalizeArray(res, 'customers'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const filtered = data.filter((c) =>
    c.c_full_name.toLowerCase().includes(search.toLowerCase()) ||
    String(c.cust_id).includes(search)
  );

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ c_full_name: row.c_full_name, c_address: row.c_address, c_phone: row.c_phone, gender: row.gender || '', marital_status: row.marital_status, cust_type: row.cust_type, username: '', password: '' });
    setModalOpen(true);
  };
  const handleClose  = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const { username, password, ...fields } = form;
        const payload = { ...fields, c_phone: Number(form.c_phone), gender: form.gender || null };
        await updateCustomer(editing.cust_id, payload);
      } else {
        const payload = { ...form, c_phone: Number(form.c_phone), gender: form.gender || null };
        await createCustomer(payload);
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
      await deleteCustomer(deleteTarget.cust_id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: 'cust_id',         label: 'ID' },
    { key: 'c_full_name',     label: 'Name' },
    { key: 'c_phone',         label: 'Phone' },
    { key: 'c_address',       label: 'Address', render: (v) => <span className="max-w-xs truncate block" title={v}>{v}</span> },
    { key: 'gender',          label: 'Gender',         render: (v) => genderLabel[v] || '—' },
    { key: 'marital_status',  label: 'Marital Status', render: (v) => maritalLabel[v] || v   },
    { key: 'cust_type',       label: 'Type',           render: (v) => typeLabel[v] || v       },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Customer Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <input type="text" placeholder="Search by name or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button onClick={openAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Customer</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
          ) : (
            <>
              <p className="text-xs text-gray-400">{filtered.length} record(s)</p>
              <DataTable columns={columns} data={filtered} keyField="cust_id" onEdit={openEdit} onDelete={setDeleteTarget} />
            </>
          )}
        </main>
      </div>

      <FormModal isOpen={modalOpen} onClose={handleClose} title={editing ? 'Edit Customer' : 'Add New Customer'} onSubmit={handleSubmit} submitLabel={submitting ? 'Saving…' : editing ? 'Update' : 'Create'}>
        <FieldGroup label="Full Name *">
          <input name="c_full_name" value={form.c_full_name} onChange={handleChange} required placeholder="Alice Johnson" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Address *">
          <input name="c_address" value={form.c_address} onChange={handleChange} required placeholder="123 Main St, City, ST 00000" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Phone *">
          <input name="c_phone" type="number" value={form.c_phone} onChange={handleChange} required placeholder="2125550100" className={inputCls} />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
              <option value="">-- None --</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Marital Status *">
            <select name="marital_status" value={form.marital_status} onChange={handleChange} required className={inputCls}>
              <option value="S">Single</option>
              <option value="M">Married</option>
              <option value="W">Widow/Widower</option>
            </select>
          </FieldGroup>
        </div>
        <FieldGroup label="Customer Type *">
          <select name="cust_type" value={form.cust_type} onChange={handleChange} required className={inputCls}>
            <option value="A">Auto Only</option>
            <option value="H">Home Only</option>
            <option value="B">Both</option>
          </select>
        </FieldGroup>
        {!editing && (
          <>
            <hr className="border-gray-200" />
            <FieldGroup label="Username *">
              <input name="username" value={form.username} onChange={handleChange} required placeholder="Login username" className={inputCls} />
            </FieldGroup>
            <FieldGroup label="Password *">
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="At least 6 characters" minLength={6} className={inputCls} />
            </FieldGroup>
          </>
        )}
      </FormModal>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Customer</h3>
            <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete <strong>{deleteTarget.c_full_name}</strong>? This action cannot be undone.</p>
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
