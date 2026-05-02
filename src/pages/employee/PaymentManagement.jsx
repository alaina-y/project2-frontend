import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';
import { getPayments, createPayment, deletePayment, getInvoices } from '../../services/api';
import { normalizeArray } from '../../utils/normalizeArray';

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

const PAY_METHODS = ['PayPal', 'Credit', 'Debit', 'Check'];

const methodBadge = (method) => {
  const colors = {
    PayPal: 'bg-blue-100 text-blue-700',
    Credit: 'bg-purple-100 text-purple-700',
    Debit:  'bg-green-100 text-green-700',
    Check:  'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[method] || 'bg-gray-100 text-gray-600'}`}>
      {method}
    </span>
  );
};

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const [payForm, setPayForm] = useState({ invoice_id: '', pay_method: 'Credit', payment_data: new Date().toISOString().split('T')[0] });
  const [paySuccess, setPaySuccess] = useState('');
  const [payError, setPayError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    console.log('PaymentManagement mounted');
    try {
      const [paysRes, invsRes] = await Promise.all([getPayments(), getInvoices()]);
      console.log('API response (payments):', paysRes);
      console.log('API response (invoices):', invsRes);
      setPayments(normalizeArray(paysRes, 'payments'));
      setInvoices(normalizeArray(invsRes, 'invoices'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const invoiceMap = Object.fromEntries(invoices.map((i) => [i.invoice_id, i]));

  const paidInvoiceIds = new Set(payments.map((p) => p.invoice_id));
  const unpaidInvoices = invoices.filter((inv) => !paidInvoiceIds.has(inv.invoice_id));

  const filtered = payments.filter((p) =>
    String(p.payment_id).includes(search) ||
    String(p.invoice_id).includes(search) ||
    p.pay_method.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    try {
      await deletePayment(deleteTarget.payment_id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setApiError(err.message);
      setDeleteTarget(null);
    }
  };

  const handlePayChange = (e) => {
    setPayForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPaySuccess('');
    setPayError('');
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    const invId = Number(payForm.invoice_id);
    if (!invId) { setPayError('Please select an invoice.'); return; }
    const inv = invoiceMap[invId];
    if (!inv) { setPayError('Invoice not found.'); return; }

    setSubmitting(true);
    try {
      await createPayment({
        payment_data: payForm.payment_data,
        pay_method:   payForm.pay_method,
        invoice_id:   invId,
      });
      setPayForm({ invoice_id: '', pay_method: 'Credit', payment_data: new Date().toISOString().split('T')[0] });
      setPaySuccess(`Payment of $${Number(inv.invoice_amt).toFixed(2)} recorded successfully for Invoice #${invId}!`);
      await reload();
    } catch (err) {
      setPayError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'payment_id',   label: 'Payment #' },
    { key: 'payment_data', label: 'Date' },
    { key: 'pay_method',   label: 'Method', render: (v) => methodBadge(v) },
    { key: 'invoice_id',   label: 'Invoice #' },
    { key: 'amount',       label: 'Amount', render: (_, row) => {
      const inv = invoiceMap[row.invoice_id];
      return inv ? `$${Number(inv.invoice_amt).toFixed(2)}` : '—';
    }},
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Payment Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}

          {/* Make Payment Card */}
          <section className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Make a Payment</h3>
            {paySuccess && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {paySuccess}
              </div>
            )}
            {payError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {payError}
              </div>
            )}
            <form onSubmit={handleMakePayment} className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Invoice *</label>
                <select name="invoice_id" value={payForm.invoice_id} onChange={handlePayChange} required className={inputCls}>
                  <option value="">-- Unpaid Invoices --</option>
                  {unpaidInvoices.map((inv) => (
                    <option key={inv.invoice_id} value={inv.invoice_id}>
                      Invoice #{inv.invoice_id} — ${Number(inv.invoice_amt).toFixed(2)} (due {inv.due_date})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                <select name="pay_method" value={payForm.pay_method} onChange={handlePayChange} required className={inputCls}>
                  {PAY_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                <input type="date" name="payment_data" value={payForm.payment_data} onChange={handlePayChange} required className={inputCls} />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  {submitting ? 'Submitting…' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </section>

          {/* Payment History */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-base font-semibold text-gray-800">Payment History</h3>
              <input type="text" placeholder="Search payments…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">Loading…</div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">{filtered.length} record(s)</p>
                <DataTable columns={columns} data={filtered} keyField="payment_id" onDelete={setDeleteTarget} />
              </>
            )}
          </section>
        </main>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Payment</h3>
            <p className="text-sm text-gray-600 mb-5">Delete payment <strong>#{deleteTarget.payment_id}</strong> for Invoice #{deleteTarget.invoice_id}?</p>
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
