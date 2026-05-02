import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import {
  getCustomers,
  getAutoPolicies,
  getHomePolicies,
  getInvoices,
  getPayments,
} from '../../services/api';

const statusBadge = (status) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === 'C' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {status === 'C' ? 'Current' : 'Expired'}
  </span>
);

export default function CustomerDashboard() {
  const [customer, setCustomer]       = useState(null);
  const [autoPolicies, setAutoPolicies] = useState([]);
  const [homePolicies, setHomePolicies] = useState([]);
  const [myInvoices, setMyInvoices]   = useState([]);
  const [myPayments, setMyPayments]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [errors, setErrors]           = useState([]);

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled([
        getCustomers(),
        getAutoPolicies(),
        getHomePolicies(),
        getInvoices(),
        getPayments(),
      ]);

      const errs = [];
      const [custsR, autosR, homesR, invoicesR, paymentsR] = results;

      if (custsR.status === 'fulfilled') {
        const raw = custsR.value;
        const cust = Array.isArray(raw) ? raw[0] : raw;
        setCustomer(cust);
      } else { errs.push('Customers: ' + custsR.reason?.message); }

      const autos = autosR.status === 'fulfilled' && Array.isArray(autosR.value) ? autosR.value : [];
      if (autosR.status === 'rejected') errs.push('Auto policies: ' + autosR.reason?.message);
      setAutoPolicies(autos);

      const homes = homesR.status === 'fulfilled' && Array.isArray(homesR.value) ? homesR.value : [];
      if (homesR.status === 'rejected') errs.push('Home policies: ' + homesR.reason?.message);
      setHomePolicies(homes);

      const allInvoices = invoicesR.status === 'fulfilled' && Array.isArray(invoicesR.value) ? invoicesR.value : [];
      if (invoicesR.status === 'rejected') errs.push('Invoices: ' + invoicesR.reason?.message);

      const allPayments = paymentsR.status === 'fulfilled' && Array.isArray(paymentsR.value) ? paymentsR.value : [];
      if (paymentsR.status === 'rejected') errs.push('Payments: ' + paymentsR.reason?.message);

      const autoPolicyIds = autos.map((p) => p.a_policy_id);
      const homePolicyIds = homes.map((p) => p.h_policy_id);
      const filtered = allInvoices.filter(
        (inv) =>
          (inv.a_policy_id && autoPolicyIds.includes(inv.a_policy_id)) ||
          (inv.h_policy_id && homePolicyIds.includes(inv.h_policy_id))
      );
      setMyInvoices(filtered);

      const invoiceIds = filtered.map((i) => i.invoice_id);
      setMyPayments(allPayments.filter((p) => invoiceIds.includes(p.invoice_id)));

      setErrors(errs);
      setLoading(false);
    }
    load();
  }, []);

  const activeAutoCount = autoPolicies.filter((p) => p.a_policy_status === 'C').length;
  const activeHomeCount = homePolicies.filter((p) => p.h_policy_status === 'C').length;
  const totalInvoiced   = myInvoices.reduce((sum, i) => sum + Number(i.invoice_amt), 0);
  const totalPaid       = myPayments.reduce((sum, p) => {
    const inv = myInvoices.find((i) => i.invoice_id === p.invoice_id);
    return sum + (inv ? Number(inv.invoice_amt) : 0);
  }, 0);

  const custTypeLabel = { A: 'Auto', H: 'Home', B: 'Auto & Home' };
  const maritalLabel  = { M: 'Married', S: 'Single', W: 'Widow/Widower' };
  const genderLabel   = { M: 'Male', F: 'Female' };

  const autoCols = [
    { key: 'a_policy_id',     label: 'Policy ID' },
    { key: 'start_date',      label: 'Start Date' },
    { key: 'end_date',        label: 'End Date' },
    { key: 'premium_amount',  label: 'Premium', render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'a_policy_status', label: 'Status',  render: (v) => statusBadge(v) },
  ];
  const homeCols = [
    { key: 'h_policy_id',     label: 'Policy ID' },
    { key: 'start_date',      label: 'Start Date' },
    { key: 'end_date',        label: 'End Date' },
    { key: 'premium_amount',  label: 'Premium', render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'h_policy_status', label: 'Status',  render: (v) => statusBadge(v) },
  ];
  const invoiceCols = [
    { key: 'invoice_id',   label: 'Invoice #' },
    { key: 'invoice_date', label: 'Date' },
    { key: 'due_date',     label: 'Due Date' },
    { key: 'invoice_amt',  label: 'Amount', render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'a_policy_id',  label: 'Type', render: (_, row) => row.a_policy_id
      ? <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">Auto</span>
      : <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Home</span>
    },
  ];
  const paymentCols = [
    { key: 'payment_id',   label: 'Payment #' },
    { key: 'payment_data', label: 'Date' },
    { key: 'pay_method',   label: 'Method' },
    { key: 'invoice_id',   label: 'Invoice #' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="My Dashboard" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors.length > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 space-y-1">
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow">
                <h2 className="text-2xl font-bold">Welcome back, {customer?.c_full_name ?? 'Customer'}!</h2>
                <p className="mt-1 text-blue-100 text-sm">Here is an overview of your insurance account.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard title="Active Auto Policies" value={activeAutoCount} color="blue"   />
                <StatCard title="Active Home Policies" value={activeHomeCount} color="green"  />
                <StatCard title="Total Invoiced"       value={`$${totalInvoiced.toFixed(2)}`} color="orange" />
                <StatCard title="Total Paid"           value={`$${totalPaid.toFixed(2)}`}     color="purple" />
              </div>

              <section className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">My Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  <div><span className="font-medium text-gray-500">Full Name:</span>      <span className="ml-2 text-gray-800">{customer?.c_full_name}</span></div>
                  <div><span className="font-medium text-gray-500">Phone:</span>          <span className="ml-2 text-gray-800">{customer?.c_phone}</span></div>
                  <div><span className="font-medium text-gray-500">Address:</span>        <span className="ml-2 text-gray-800">{customer?.c_address}</span></div>
                  <div><span className="font-medium text-gray-500">Gender:</span>         <span className="ml-2 text-gray-800">{genderLabel[customer?.gender] ?? '—'}</span></div>
                  <div><span className="font-medium text-gray-500">Marital Status:</span> <span className="ml-2 text-gray-800">{maritalLabel[customer?.marital_status]}</span></div>
                  <div><span className="font-medium text-gray-500">Customer Type:</span>  <span className="ml-2 text-gray-800">{custTypeLabel[customer?.cust_type]}</span></div>
                </div>
              </section>

              {Array.isArray(autoPolicies) && autoPolicies.length > 0 && (
                <section>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">My Auto Policies</h3>
                  <DataTable columns={autoCols} data={autoPolicies} keyField="a_policy_id" />
                </section>
              )}

              {Array.isArray(homePolicies) && homePolicies.length > 0 && (
                <section>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">My Home Policies</h3>
                  <DataTable columns={homeCols} data={homePolicies} keyField="h_policy_id" />
                </section>
              )}

              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-3">My Invoices</h3>
                <DataTable columns={invoiceCols} data={Array.isArray(myInvoices) ? myInvoices : []} keyField="invoice_id" />
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-3">My Payments</h3>
                <DataTable columns={paymentCols} data={Array.isArray(myPayments) ? myPayments : []} keyField="payment_id" />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
