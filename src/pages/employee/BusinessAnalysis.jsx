import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { getCustomers, getAutoPolicies, getHomePolicies, getInvoices, getPayments } from '../../services/api';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function buildPayMethodData(payments) {
  const counts = payments.reduce((acc, p) => {
    acc[p.pay_method] = (acc[p.pay_method] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildTopCustomers(invoices, autoPolicies, homePolicies, customers) {
  const custTotal = {};
  invoices.forEach((inv) => {
    let custId = null;
    if (inv.a_policy_id) {
      const policy = autoPolicies.find((p) => p.a_policy_id === inv.a_policy_id);
      if (policy) custId = policy.cust_id;
    } else if (inv.h_policy_id) {
      const policy = homePolicies.find((p) => p.h_policy_id === inv.h_policy_id);
      if (policy) custId = policy.cust_id;
    }
    if (custId) {
      custTotal[custId] = (custTotal[custId] || 0) + Number(inv.invoice_amt);
    }
  });
  return Object.entries(custTotal)
    .map(([custId, total]) => {
      const cust = customers.find((c) => c.cust_id === Number(custId));
      return { name: cust ? cust.c_full_name.split(' ')[0] : `#${custId}`, total: Number(total.toFixed(2)) };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

function buildMonthlyInvoices(invoices) {
  const monthly = {};
  invoices.forEach((inv) => {
    const month = inv.invoice_date.slice(0, 7);
    monthly[month] = (monthly[month] || 0) + Number(inv.invoice_amt);
  });
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month: month.replace('-', '/'), total: Number(total.toFixed(2)) }));
}

export default function BusinessAnalysis() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const [customers, setCustomers]       = useState([]);
  const [autoPolicies, setAutoPolicies] = useState([]);
  const [homePolicies, setHomePolicies] = useState([]);
  const [invoices, setInvoices]         = useState([]);
  const [payments, setPayments]         = useState([]);

  useEffect(() => {
    Promise.all([getCustomers(), getAutoPolicies(), getHomePolicies(), getInvoices(), getPayments()])
      .then(([custs, autoPols, homePols, invs, pays]) => {
        setCustomers(custs);
        setAutoPolicies(autoPols);
        setHomePolicies(homePols);
        setInvoices(invs);
        setPayments(pays);
      })
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeAutoCount  = autoPolicies.filter((p) => p.a_policy_status === 'C').length;
  const activeHomeCount  = homePolicies.filter((p) => p.h_policy_status === 'C').length;
  const totalInvoiceAmt  = invoices.reduce((s, i) => s + Number(i.invoice_amt), 0);
  const payMethodData    = buildPayMethodData(payments);
  const topCustomersData = buildTopCustomers(invoices, autoPolicies, homePolicies, customers);
  const monthlyInvoiceData = buildMonthlyInvoices(invoices);
  const custTypeData = [
    { name: 'Auto Only', count: customers.filter((c) => c.cust_type === 'A').length },
    { name: 'Home Only', count: customers.filter((c) => c.cust_type === 'H').length },
    { name: 'Both',      count: customers.filter((c) => c.cust_type === 'B').length },
  ];

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header title="Business Analytics" />
          <main className="flex-1 flex items-center justify-center text-gray-400">Loading analytics…</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Business Analytics" />
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {apiError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>}

          {/* KPI Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard title="Total Customers"      value={customers.length}                                                              color="blue"   />
            <StatCard title="Active Auto Policies" value={activeAutoCount}                                                               color="green"  />
            <StatCard title="Active Home Policies" value={activeHomeCount}                                                               color="purple" />
            <StatCard title="Total Invoice Amt"    value={`$${totalInvoiceAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}  color="orange" />
            <StatCard title="Total Payments"       value={payments.length}                                                               color="blue"   />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Payment Method Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={payMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {payMethodData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} payments`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Customer Type Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={custTypeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Top 5 Customers by Invoice Total</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topCustomersData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Total Invoiced']} />
                  <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} name="Total Invoiced" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Monthly Invoice Amounts</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyInvoiceData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Invoice Amount']} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Invoice Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Policy Premium Summary */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Policy Premium Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Auto Policies</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-1 text-left text-xs text-gray-400 font-medium">Status</th>
                      <th className="py-1 text-right text-xs text-gray-400 font-medium">Count</th>
                      <th className="py-1 text-right text-xs text-gray-400 font-medium">Total Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['C', 'E'].map((s) => {
                      const items = autoPolicies.filter((p) => p.a_policy_status === s);
                      const total = items.reduce((sum, p) => sum + Number(p.premium_amount), 0);
                      return (
                        <tr key={s} className="border-b border-gray-50">
                          <td className="py-2">{s === 'C' ? 'Current' : 'Expired'}</td>
                          <td className="py-2 text-right">{items.length}</td>
                          <td className="py-2 text-right">${total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Home Policies</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-1 text-left text-xs text-gray-400 font-medium">Status</th>
                      <th className="py-1 text-right text-xs text-gray-400 font-medium">Count</th>
                      <th className="py-1 text-right text-xs text-gray-400 font-medium">Total Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['C', 'E'].map((s) => {
                      const items = homePolicies.filter((p) => p.h_policy_status === s);
                      const total = items.reduce((sum, p) => sum + Number(p.premium_amount), 0);
                      return (
                        <tr key={s} className="border-b border-gray-50">
                          <td className="py-2">{s === 'C' ? 'Current' : 'Expired'}</td>
                          <td className="py-2 text-right">{items.length}</td>
                          <td className="py-2 text-right">${total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
