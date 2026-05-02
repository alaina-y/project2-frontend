const BASE_URL = '';

export async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request failed: ${res.status}`);
  }

  return data;
}

// AUTH
export const login    = (username, password) => request('/api/auth/login',    { method: 'POST', body: JSON.stringify({ username, password }) });
export const register = (data)               => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const logout   = ()                   => request('/api/auth/logout',   { method: 'POST' });
export const getMe    = ()                   => request('/api/auth/me');

// CUSTOMERS
export const getCustomers    = ()          => request('/api/customers/');
export const getCustomerById = (id)        => request(`/api/customers/${id}`);
export const createCustomer  = (data)      => request('/api/auth/register',  { method: 'POST', body: JSON.stringify(data) });
export const updateCustomer  = (id, data)  => request(`/api/customers/${id}`, { method: 'PUT',    body: JSON.stringify(data) });
export const deleteCustomer  = (id)        => request(`/api/customers/${id}`, { method: 'DELETE' });

// AUTO POLICIES
export const getAutoPolicies           = ()          => request('/api/policies/auto');
export const getAutoPolicyById         = (id)        => request(`/api/policies/auto/${id}`);
export const getAutoPoliciesByCustomer = (custId)    => request(`/api/policies/auto?cust_id=${custId}`);
export const createAutoPolicy          = (data)      => request('/api/policies/auto',      { method: 'POST', body: JSON.stringify(data) });
export const updateAutoPolicy          = (id, data)  => request(`/api/policies/auto/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteAutoPolicy          = (id)        => request(`/api/policies/auto/${id}`, { method: 'DELETE' });

// HOME POLICIES
export const getHomePolicies           = ()          => request('/api/policies/home');
export const getHomePolicyById         = (id)        => request(`/api/policies/home/${id}`);
export const getHomePoliciesByCustomer = (custId)    => request(`/api/policies/home?cust_id=${custId}`);
export const createHomePolicy          = (data)      => request('/api/policies/home',      { method: 'POST', body: JSON.stringify(data) });
export const updateHomePolicy          = (id, data)  => request(`/api/policies/home/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteHomePolicy          = (id)        => request(`/api/policies/home/${id}`, { method: 'DELETE' });

// HOMES
export const getHomes    = ()          => request('/api/homes/');
export const getHomeById = (id)        => request(`/api/homes/${id}`);
export const createHome  = (data)      => request('/api/homes/',      { method: 'POST', body: JSON.stringify(data) });
export const updateHome  = (id, data)  => request(`/api/homes/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteHome  = (id)        => request(`/api/homes/${id}`, { method: 'DELETE' });

// VEHICLES
export const getVehicles      = ()           => request('/api/vehicles/');
export const getVehicleByVin  = (vin)        => request(`/api/vehicles/${vin}`);
export const createVehicle    = (data)       => request('/api/vehicles/',      { method: 'POST', body: JSON.stringify(data) });
export const updateVehicle    = (vin, data)  => request(`/api/vehicles/${vin}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteVehicle    = (vin)        => request(`/api/vehicles/${vin}`, { method: 'DELETE' });

// DRIVERS
export const getDrivers         = ()                   => request('/api/vehicles/drivers');
export const getDriverByLicense = (licenseNum)         => request(`/api/vehicles/drivers/${licenseNum}`);
export const createDriver       = (data)               => request('/api/vehicles/drivers',             { method: 'POST', body: JSON.stringify(data) });
export const updateDriver       = (licenseNum, data)   => request(`/api/vehicles/drivers/${licenseNum}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteDriver       = (licenseNum)         => request(`/api/vehicles/drivers/${licenseNum}`, { method: 'DELETE' });

// INVOICES
export const getInvoices              = ()          => request('/api/invoices/');
export const getInvoiceById           = (id)        => request(`/api/invoices/${id}`);
export const getInvoicesByAutoPolicy  = (policyId)  => request(`/api/invoices/?a_policy_id=${policyId}`);
export const getInvoicesByHomePolicy  = (policyId)  => request(`/api/invoices/?h_policy_id=${policyId}`);
export const createInvoice            = (data)      => request('/api/invoices/',      { method: 'POST', body: JSON.stringify(data) });
export const updateInvoice            = (id, data)  => request(`/api/invoices/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deleteInvoice            = (id)        => request(`/api/invoices/${id}`, { method: 'DELETE' });

// PAYMENTS
export const getPayments         = ()           => request('/api/payments/');
export const getPaymentById      = (id)         => request(`/api/payments/${id}`);
export const getPaymentsByInvoice = (invoiceId) => request(`/api/payments/?invoice_id=${invoiceId}`);
export const createPayment       = (data)       => request('/api/payments/',      { method: 'POST', body: JSON.stringify(data) });
export const updatePayment       = (id, data)   => request(`/api/payments/${id}`, { method: 'PUT',  body: JSON.stringify(data) });
export const deletePayment       = (id)         => request(`/api/payments/${id}`, { method: 'DELETE' });
