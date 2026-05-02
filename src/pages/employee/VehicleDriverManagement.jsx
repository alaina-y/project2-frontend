import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import {
  getVehicles, createVehicle, updateVehicle, deleteVehicle,
  getDrivers, createDriver, updateDriver, deleteDriver,
  getAutoPolicies,
} from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const vStatusLabel = { L: 'Leased', F: 'Financed', O: 'Owned' };
const vStatusColor  = { L: 'bg-yellow-100 text-yellow-700', F: 'bg-blue-100 text-blue-700', O: 'bg-green-100 text-green-700' };

const emptyVehicle = { vin: '', a_policy_id: '', make_model_year: '', v_status: 'O' };
const emptyDriver  = { license_num: '', vin: '', d_name: '', age: '' };

export default function VehicleDriverManagement() {
  const [activeTab, setActiveTab] = useState('vehicles');

  const [vehicles, setVehicles]       = useState([]);
  const [drivers, setDrivers]         = useState([]);
  const [autoPolicies, setAutoPolicies] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [apiError, setApiError]       = useState('');

  const [vModal, setVModal]     = useState(false);
  const [vEditing, setVEditing] = useState(null);
  const [vForm, setVForm]       = useState(emptyVehicle);
  const [vDelete, setVDelete]   = useState(null);
  const [vSearch, setVSearch]   = useState('');
  const [vSubmitting, setVSubmitting] = useState(false);

  const [dModal, setDModal]     = useState(false);
  const [dEditing, setDEditing] = useState(null);
  const [dForm, setDForm]       = useState(emptyDriver);
  const [dDelete, setDDelete]   = useState(null);
  const [dSearch, setDSearch]   = useState('');
  const [dSubmitting, setDSubmitting] = useState(false);

  const reload = async () => {
    console.log('VehicleDriverManagement mounted');
    try {
      const [vsRes, dsRes, polRes] = await Promise.all([getVehicles(), getDrivers(), getAutoPolicies()]);
      console.log('API response (vehicles):', vsRes);
      console.log('API response (drivers):', dsRes);
      console.log('API response (auto policies):', polRes);
      setVehicles(normalizeArray(vsRes, 'vehicles'));
      setDrivers(normalizeArray(dsRes, 'drivers'));
      setAutoPolicies(normalizeArray(polRes, 'auto_policies'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  // — VEHICLES —
  const filteredV = vehicles.filter((v) =>
    v.vin.toLowerCase().includes(vSearch.toLowerCase()) ||
    v.make_model_year.toLowerCase().includes(vSearch.toLowerCase())
  );

  const openAddV  = () => { setVEditing(null); setVForm(emptyVehicle); setVModal(true); };
  const openEditV = (row) => {
    setVEditing(row);
    setVForm({ vin: row.vin, a_policy_id: row.a_policy_id !== null ? String(row.a_policy_id) : '', make_model_year: row.make_model_year, v_status: row.v_status });
    setVModal(true);
  };
  const closeV = () => { setVModal(false); setVEditing(null); setVForm(emptyVehicle); };

  const submitV = async (e) => {
    e.preventDefault();
    setVSubmitting(true);
    const payload = { ...vForm, a_policy_id: vForm.a_policy_id ? Number(vForm.a_policy_id) : null };
    try {
      if (vEditing) {
        await updateVehicle(vEditing.vin, payload);
      } else {
        await createVehicle(payload);
      }
      await reload();
      closeV();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setVSubmitting(false);
    }
  };

  const confirmDeleteV = async () => {
    try {
      await deleteVehicle(vDelete.vin);
      setVDelete(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setVDelete(null);
    }
  };

  // — DRIVERS —
  const filteredD = drivers.filter((d) =>
    d.d_name.toLowerCase().includes(dSearch.toLowerCase()) ||
    d.license_num.toLowerCase().includes(dSearch.toLowerCase())
  );

  const openAddD  = () => { setDEditing(null); setDForm(emptyDriver); setDModal(true); };
  const openEditD = (row) => {
    setDEditing(row);
    setDForm({ license_num: row.license_num, vin: row.vin || '', d_name: row.d_name, age: String(row.age) });
    setDModal(true);
  };
  const closeD = () => { setDModal(false); setDEditing(null); setDForm(emptyDriver); };

  const submitD = async (e) => {
    e.preventDefault();
    setDSubmitting(true);
    const payload = { ...dForm, vin: dForm.vin || null, age: Number(dForm.age) };
    try {
      if (dEditing) {
        await updateDriver(dEditing.license_num, payload);
      } else {
        await createDriver(payload);
      }
      await reload();
      closeD();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setDSubmitting(false);
    }
  };

  const confirmDeleteD = async () => {
    try {
      await deleteDriver(dDelete.license_num);
      setDDelete(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDDelete(null);
    }
  };

  const vehicleCols = [
    { key: 'vin',             label: 'VIN' },
    { key: 'a_policy_id',    label: 'Policy ID', render: (v) => v ?? '—' },
    { key: 'make_model_year', label: 'Make / Model / Year' },
    { key: 'v_status',       label: 'Status', render: (v) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${vStatusColor[v]}`}>{vStatusLabel[v] || v}</span>
    )},
  ];

  const driverCols = [
    { key: 'license_num', label: 'License #' },
    { key: 'vin',         label: 'VIN',  render: (v) => v ? <span className="font-mono text-xs">{v}</span> : '—' },
    { key: 'd_name',      label: 'Name' },
    { key: 'age',         label: 'Age' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Vehicles &amp; Drivers" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {['vehicles', 'drivers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'vehicles' ? 'Vehicles' : 'Drivers'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
          ) : (
            <>
              {/* Vehicles tab */}
              {activeTab === 'vehicles' && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <input type="text" placeholder="Search VIN or make/model…" value={vSearch} onChange={(e) => setVSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button onClick={openAddV} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Vehicle</button>
                  </div>
                  <p className="text-xs text-gray-400">{filteredV.length} record(s)</p>
                  <DataTable columns={vehicleCols} data={filteredV} keyField="vin" onEdit={openEditV} onDelete={setVDelete} />
                </>
              )}

              {/* Drivers tab */}
              {activeTab === 'drivers' && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <input type="text" placeholder="Search name or license…" value={dSearch} onChange={(e) => setDSearch(e.target.value)} className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button onClick={openAddD} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">+ Add Driver</button>
                  </div>
                  <p className="text-xs text-gray-400">{filteredD.length} record(s)</p>
                  <DataTable columns={driverCols} data={filteredD} keyField="license_num" onEdit={openEditD} onDelete={setDDelete} />
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Vehicle Modal */}
      <FormModal isOpen={vModal} onClose={closeV} title={vEditing ? 'Edit Vehicle' : 'Add Vehicle'} onSubmit={submitV} submitLabel={vSubmitting ? 'Saving…' : vEditing ? 'Update' : 'Create'}>
        <FieldGroup label="VIN *">
          <input name="vin" value={vForm.vin} onChange={(e) => setVForm((p) => ({ ...p, vin: e.target.value }))} required disabled={!!vEditing} placeholder="17-character VIN" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Auto Policy ID">
          <select name="a_policy_id" value={vForm.a_policy_id} onChange={(e) => setVForm((p) => ({ ...p, a_policy_id: e.target.value }))} className={inputCls}>
            <option value="">-- None --</option>
            {autoPolicies.map((p) => <option key={p.a_policy_id} value={p.a_policy_id}>Policy #{p.a_policy_id}</option>)}
          </select>
        </FieldGroup>
        <FieldGroup label="Make / Model / Year *">
          <input name="make_model_year" value={vForm.make_model_year} onChange={(e) => setVForm((p) => ({ ...p, make_model_year: e.target.value }))} required placeholder="2022 Honda Accord" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Vehicle Status *">
          <select name="v_status" value={vForm.v_status} onChange={(e) => setVForm((p) => ({ ...p, v_status: e.target.value }))} required className={inputCls}>
            <option value="L">Leased</option>
            <option value="F">Financed</option>
            <option value="O">Owned</option>
          </select>
        </FieldGroup>
      </FormModal>

      {/* Driver Modal */}
      <FormModal isOpen={dModal} onClose={closeD} title={dEditing ? 'Edit Driver' : 'Add Driver'} onSubmit={submitD} submitLabel={dSubmitting ? 'Saving…' : dEditing ? 'Update' : 'Create'}>
        <FieldGroup label="License Number *">
          <input name="license_num" value={dForm.license_num} onChange={(e) => setDForm((p) => ({ ...p, license_num: e.target.value }))} required disabled={!!dEditing} placeholder="DL001NY" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="VIN (linked vehicle)">
          <select name="vin" value={dForm.vin} onChange={(e) => setDForm((p) => ({ ...p, vin: e.target.value }))} className={inputCls}>
            <option value="">-- None --</option>
            {vehicles.map((v) => <option key={v.vin} value={v.vin}>{v.vin} — {v.make_model_year}</option>)}
          </select>
        </FieldGroup>
        <FieldGroup label="Driver Name *">
          <input name="d_name" value={dForm.d_name} onChange={(e) => setDForm((p) => ({ ...p, d_name: e.target.value }))} required placeholder="John Doe" className={inputCls} />
        </FieldGroup>
        <FieldGroup label="Age *">
          <input type="number" name="age" value={dForm.age} onChange={(e) => setDForm((p) => ({ ...p, age: e.target.value }))} required min="16" max="120" className={inputCls} />
        </FieldGroup>
      </FormModal>

      {/* Delete Vehicle */}
      {vDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setVDelete(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Vehicle</h3>
            <p className="text-sm text-gray-600 mb-5">Delete vehicle <strong>{vDelete.make_model_year}</strong> ({vDelete.vin})?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setVDelete(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteV} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Driver */}
      {dDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDDelete(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Driver</h3>
            <p className="text-sm text-gray-600 mb-5">Delete driver <strong>{dDelete.d_name}</strong> ({dDelete.license_num})?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDDelete(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteD} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
