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

export default function EmployeeDashboard() {
  const [customers, setCustomers]       = useState([]);
  const [autoPolicies, setAutoPolicies] = useState([]);
  const [homePolicies, setHomePolicies] = useState([]);
  const [invoices, setInvoices]         = useState([]);
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [errors, setErrors]             = useState([]);

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled([
        getCustomers(), getAutoPolicies(), getHomePolicies(), getInvoices(), getPayments(),
      ]);

      const errs = [];
      const labels = ['Customers', 'Auto policies', 'Home policies', 'Invoices', 'Payments'];
      const setters = [setCustomers, setAutoPolicies, setHomePolicies, setInvoices, setPayments];

      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          setters[i](Array.isArray(r.value) ? r.value : []);
        } else {
          errs.push(`${labels[i]}: ${r.reason?.message}`);
          setters[i]([]);
        }
      });

      setErrors(errs);
      setLoading(false);
    }
    load();
  }, []);

  const activeAutoCount = autoPolicies.filter((p) => p.a_policy_status === 'C').length;
  const activeHomeCount = homePolicies.filter((p) => p.h_policy_status === 'C').length;
  const totalInvoiceAmt = invoices.reduce((s, i) => s + Number(i.invoice_amt), 0);
  const paidInvoiceIds  = payments.map((p) => p.invoice_id);
  const pendingCount    = invoices.filter((i) => !paidInvoiceIds.includes(i.invoice_id)).length;

  const recentCustomers = [...customers].slice(-5).reverse();
  const recentInvoices  = [...invoices].slice(-5).reverse();

  const custCols = [
    { key: 'cust_id',     label: '#' },
    { key: 'c_full_name', label: 'Name' },
    { key: 'c_phone',     label: 'Phone' },
    { key: 'cust_type',   label: 'Type', render: (v) => ({ A: 'Auto', H: 'Home', B: 'Both' }[v] || v) },
  ];

  const invCols = [
    { key: 'invoice_id',   label: '#' },
    { key: 'invoice_date', label: 'Date' },
    { key: 'due_date',     label: 'Due' },
    { key: 'invoice_amt',  label: 'Amount', render: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'a_policy_id',  label: 'Type', render: (_, row) => row.a_policy_id
      ? <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">Auto</span>
      : <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Home</span>
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Employee Dashboard" />
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
              <div className="rounded-xl bg-gradient-to-r from-blue-900 to-blue-600 p-6 text-white shadow">
                <h2 className="text-2xl font-bold">HJY Insurance — Overview</h2>
                <p className="mt-1 text-blue-200 text-sm">All key metrics at a glance.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard title="Total Customers"      value={customers.length}   color="blue"   />
                <StatCard title="Active Auto Policies" value={activeAutoCount}    color="green"  />
                <StatCard title="Active Home Policies" value={activeHomeCount}    color="purple" />
                <StatCard title="Total Invoices"       value={invoices.length}    color="orange" subtitle={`$${totalInvoiceAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                <StatCard title="Pending Payments"     value={pendingCount}       color="orange" />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="rounded-xl bg-white shadow-sm border border-gray-200 p-5">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Customers</h3>
                  <DataTable columns={custCols} data={recentCustomers} keyField="cust_id" />
                </section>
                <section className="rounded-xl bg-white shadow-sm border border-gray-200 p-5">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Invoices</h3>
                  <DataTable columns={invCols} data={recentInvoices} keyField="invoice_id" />
                </section>
              </div>

              <section className="rounded-xl bg-white shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Customer Type Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['A', 'H', 'B'].map((type) => {
                    const label = { A: 'Auto Only', H: 'Home Only', B: 'Both' }[type];
                    const count = customers.filter((c) => c.cust_type === type).length;
                    return (
                      <div key={type} className="rounded-lg border border-gray-200 p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{count}</p>
                        <p className="text-sm text-gray-500 mt-1">{label}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
