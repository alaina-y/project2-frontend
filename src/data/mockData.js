// HJY Insurance Management System — Mock Data
// Schema matches the database exactly.

// CUSTOMERS — cust_type: A=Auto only, H=Home only, B=Both
export const customers = [
  { cust_id: 1,  c_full_name: 'Alice Johnson',  c_address: '123 Maple St, New York, NY 10001',        c_phone: 2125550101, gender: 'F', marital_status: 'M', cust_type: 'B' },
  { cust_id: 2,  c_full_name: 'Bob Smith',       c_address: '456 Oak Ave, Brooklyn, NY 11201',          c_phone: 7185550102, gender: 'M', marital_status: 'S', cust_type: 'A' },
  { cust_id: 3,  c_full_name: 'Carol White',     c_address: '789 Pine Rd, Queens, NY 11354',            c_phone: 7185550103, gender: 'F', marital_status: 'W', cust_type: 'H' },
  { cust_id: 4,  c_full_name: 'David Lee',       c_address: '321 Elm St, Bronx, NY 10451',              c_phone: 7185550104, gender: 'M', marital_status: 'M', cust_type: 'B' },
  { cust_id: 5,  c_full_name: 'Eva Martinez',    c_address: '654 Cedar Blvd, Staten Island, NY 10301',  c_phone: 7185550105, gender: 'F', marital_status: 'S', cust_type: 'A' },
  { cust_id: 6,  c_full_name: 'Frank Brown',     c_address: '987 Birch Ln, Jersey City, NJ 07302',      c_phone: 2015550106, gender: 'M', marital_status: 'M', cust_type: 'H' },
  { cust_id: 7,  c_full_name: 'Grace Wilson',    c_address: '147 Walnut Dr, Hoboken, NJ 07030',         c_phone: 2015550107, gender: 'F', marital_status: 'S', cust_type: 'B' },
  { cust_id: 8,  c_full_name: 'Henry Davis',     c_address: '258 Spruce Ave, Newark, NJ 07102',         c_phone: 9735550108, gender: 'M', marital_status: 'M', cust_type: 'A' },
  { cust_id: 9,  c_full_name: 'Iris Taylor',     c_address: '369 Ash St, Yonkers, NY 10701',            c_phone: 9145550109, gender: 'F', marital_status: 'M', cust_type: 'B' },
  { cust_id: 10, c_full_name: 'Jack Anderson',   c_address: '741 Poplar Rd, White Plains, NY 10601',    c_phone: 9145550110, gender: 'M', marital_status: 'S', cust_type: 'H' },
  { cust_id: 11, c_full_name: 'Karen Thomas',    c_address: '852 Hickory Ct, Stamford, CT 06901',       c_phone: 2035550111, gender: 'F', marital_status: 'M', cust_type: 'B' },
  { cust_id: 12, c_full_name: 'Leo Jackson',     c_address: '963 Magnolia St, Hartford, CT 06103',      c_phone: 8605550112, gender: 'M', marital_status: 'W', cust_type: 'A' },
  { cust_id: 13, c_full_name: 'Mia Harris',      c_address: '159 Willow Way, Boston, MA 02101',         c_phone: 6175550113, gender: 'F', marital_status: 'S', cust_type: 'H' },
  { cust_id: 14, c_full_name: 'Nathan Clark',    c_address: '357 Cherry Ln, Philadelphia, PA 19103',    c_phone: 2155550114, gender: 'M', marital_status: 'M', cust_type: 'B' },
  { cust_id: 15, c_full_name: 'Olivia Lewis',    c_address: '468 Dogwood Dr, Pittsburgh, PA 15201',     c_phone: 4125550115, gender: 'F', marital_status: 'S', cust_type: 'A' },
];

// AUTO POLICIES — for cust_type A and B customers
export const autoPolicies = [
  { a_policy_id: 1,  cust_id: 1,  start_date: '2024-01-01', end_date: '2025-01-01', premium_amount: 1200.00, a_policy_status: 'C' },
  { a_policy_id: 2,  cust_id: 2,  start_date: '2024-02-15', end_date: '2025-02-15', premium_amount: 980.50,  a_policy_status: 'C' },
  { a_policy_id: 3,  cust_id: 4,  start_date: '2023-06-01', end_date: '2024-06-01', premium_amount: 1450.00, a_policy_status: 'E' },
  { a_policy_id: 4,  cust_id: 5,  start_date: '2024-03-10', end_date: '2025-03-10', premium_amount: 870.00,  a_policy_status: 'C' },
  { a_policy_id: 5,  cust_id: 7,  start_date: '2024-04-01', end_date: '2025-04-01', premium_amount: 1100.00, a_policy_status: 'C' },
  { a_policy_id: 6,  cust_id: 8,  start_date: '2024-01-20', end_date: '2025-01-20', premium_amount: 760.00,  a_policy_status: 'C' },
  { a_policy_id: 7,  cust_id: 9,  start_date: '2023-11-01', end_date: '2024-11-01', premium_amount: 1320.00, a_policy_status: 'C' },
  { a_policy_id: 8,  cust_id: 11, start_date: '2024-05-01', end_date: '2025-05-01', premium_amount: 940.00,  a_policy_status: 'C' },
  { a_policy_id: 9,  cust_id: 12, start_date: '2023-09-15', end_date: '2024-09-15', premium_amount: 1080.00, a_policy_status: 'E' },
  { a_policy_id: 10, cust_id: 15, start_date: '2024-06-01', end_date: '2025-06-01', premium_amount: 890.00,  a_policy_status: 'C' },
];

// HOME POLICIES — for cust_type H and B customers
export const homePolicies = [
  { h_policy_id: 1,  cust_id: 1,  start_date: '2024-01-01', end_date: '2025-01-01', premium_amount: 1800.00, h_policy_status: 'C' },
  { h_policy_id: 2,  cust_id: 3,  start_date: '2024-02-01', end_date: '2025-02-01', premium_amount: 2100.00, h_policy_status: 'C' },
  { h_policy_id: 3,  cust_id: 4,  start_date: '2023-07-01', end_date: '2024-07-01', premium_amount: 1650.00, h_policy_status: 'E' },
  { h_policy_id: 4,  cust_id: 6,  start_date: '2024-03-01', end_date: '2025-03-01', premium_amount: 2400.00, h_policy_status: 'C' },
  { h_policy_id: 5,  cust_id: 7,  start_date: '2024-04-01', end_date: '2025-04-01', premium_amount: 1950.00, h_policy_status: 'C' },
  { h_policy_id: 6,  cust_id: 9,  start_date: '2024-01-15', end_date: '2025-01-15', premium_amount: 2250.00, h_policy_status: 'C' },
  { h_policy_id: 7,  cust_id: 10, start_date: '2023-10-01', end_date: '2024-10-01', premium_amount: 1750.00, h_policy_status: 'C' },
  { h_policy_id: 8,  cust_id: 11, start_date: '2024-05-01', end_date: '2025-05-01', premium_amount: 2050.00, h_policy_status: 'C' },
  { h_policy_id: 9,  cust_id: 13, start_date: '2024-02-15', end_date: '2025-02-15', premium_amount: 1900.00, h_policy_status: 'C' },
  { h_policy_id: 10, cust_id: 14, start_date: '2024-06-01', end_date: '2025-06-01', premium_amount: 2200.00, h_policy_status: 'C' },
];

// HOMES (15)
export const homes = [
  { home_id: 1,  h_policy_id: 1,    purchase_date: '2018-05-15', purchase_value: 450000.00, home_area_sqft: 1800.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: null, has_basement: 1 },
  { home_id: 2,  h_policy_id: 2,    purchase_date: '2020-08-20', purchase_value: 320000.00, home_area_sqft: 1200.00, home_type: 'C', fire_notification: 1, security_system: 0, swimming_pool: null, has_basement: 0 },
  { home_id: 3,  h_policy_id: 3,    purchase_date: '2015-03-10', purchase_value: 580000.00, home_area_sqft: 2400.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: 'O',  has_basement: 1 },
  { home_id: 4,  h_policy_id: 4,    purchase_date: '2019-11-01', purchase_value: 650000.00, home_area_sqft: 2800.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: 'I',  has_basement: 1 },
  { home_id: 5,  h_policy_id: 5,    purchase_date: '2021-02-14', purchase_value: 290000.00, home_area_sqft: 1100.00, home_type: 'C', fire_notification: 1, security_system: 1, swimming_pool: null, has_basement: 0 },
  { home_id: 6,  h_policy_id: 6,    purchase_date: '2017-07-04', purchase_value: 720000.00, home_area_sqft: 3200.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: 'U',  has_basement: 1 },
  { home_id: 7,  h_policy_id: 7,    purchase_date: '2016-09-22', purchase_value: 410000.00, home_area_sqft: 1600.00, home_type: 'T', fire_notification: 0, security_system: 0, swimming_pool: null, has_basement: 0 },
  { home_id: 8,  h_policy_id: 8,    purchase_date: '2022-01-30', purchase_value: 530000.00, home_area_sqft: 2100.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: null, has_basement: 1 },
  { home_id: 9,  h_policy_id: 9,    purchase_date: '2020-06-15', purchase_value: 375000.00, home_area_sqft: 1450.00, home_type: 'C', fire_notification: 1, security_system: 0, swimming_pool: null, has_basement: 0 },
  { home_id: 10, h_policy_id: 10,   purchase_date: '2019-04-08', purchase_value: 680000.00, home_area_sqft: 2900.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: 'O',  has_basement: 1 },
  { home_id: 11, h_policy_id: null, purchase_date: '2023-03-20', purchase_value: 260000.00, home_area_sqft:  950.00, home_type: 'C', fire_notification: 1, security_system: 0, swimming_pool: null, has_basement: 0 },
  { home_id: 12, h_policy_id: 2,    purchase_date: '2021-08-10', purchase_value: 495000.00, home_area_sqft: 1950.00, home_type: 'M', fire_notification: 1, security_system: 1, swimming_pool: null, has_basement: 1 },
  { home_id: 13, h_policy_id: 4,    purchase_date: '2018-12-01', purchase_value: 820000.00, home_area_sqft: 3800.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: 'M',  has_basement: 1 },
  { home_id: 14, h_policy_id: 6,    purchase_date: '2020-02-28', purchase_value: 345000.00, home_area_sqft: 1300.00, home_type: 'T', fire_notification: 0, security_system: 1, swimming_pool: null, has_basement: 0 },
  { home_id: 15, h_policy_id: 8,    purchase_date: '2022-09-15', purchase_value: 560000.00, home_area_sqft: 2200.00, home_type: 'S', fire_notification: 1, security_system: 1, swimming_pool: null, has_basement: 1 },
];

// VEHICLES (10)
export const vehicles = [
  { vin: '1HGBH41JXMN109186', a_policy_id: 1,  make_model_year: '2022 Honda Accord',       v_status: 'F' },
  { vin: '2T1BURHE0JC016784', a_policy_id: 2,  make_model_year: '2021 Toyota Camry',        v_status: 'O' },
  { vin: '3VWFE21C04M000001', a_policy_id: 3,  make_model_year: '2019 Volkswagen Jetta',    v_status: 'O' },
  { vin: '4T1BF3EK9AU133022', a_policy_id: 4,  make_model_year: '2020 Toyota Avalon',       v_status: 'L' },
  { vin: '5FNRL6H75NB032146', a_policy_id: 5,  make_model_year: '2023 Honda Pilot',         v_status: 'F' },
  { vin: '6G2WP522X5L229278', a_policy_id: 6,  make_model_year: '2018 Pontiac Grand Prix',  v_status: 'O' },
  { vin: '7MSRAABG4NF107352', a_policy_id: 7,  make_model_year: '2022 Mazda CX-5',          v_status: 'L' },
  { vin: '8AF57HZX4KA000212', a_policy_id: 8,  make_model_year: '2020 Ford Explorer',       v_status: 'F' },
  { vin: '9BW959754LB905734', a_policy_id: 9,  make_model_year: '2017 Volkswagen Golf',     v_status: 'O' },
  { vin: 'JN1BJ0HPXFM736498', a_policy_id: 10, make_model_year: '2024 Nissan Rogue',        v_status: 'L' },
];

// DRIVERS (10)
export const drivers = [
  { license_num: 'DL001NY', vin: '1HGBH41JXMN109186', d_name: 'Alice Johnson', age: 38 },
  { license_num: 'DL002NY', vin: '2T1BURHE0JC016784', d_name: 'Bob Smith',     age: 29 },
  { license_num: 'DL003NY', vin: '3VWFE21C04M000001', d_name: 'David Lee',     age: 45 },
  { license_num: 'DL004NJ', vin: '4T1BF3EK9AU133022', d_name: 'Eva Martinez',  age: 33 },
  { license_num: 'DL005NJ', vin: '5FNRL6H75NB032146', d_name: 'Grace Wilson',  age: 27 },
  { license_num: 'DL006NJ', vin: '6G2WP522X5L229278', d_name: 'Henry Davis',   age: 52 },
  { license_num: 'DL007NY', vin: '7MSRAABG4NF107352', d_name: 'Iris Taylor',   age: 41 },
  { license_num: 'DL008CT', vin: '8AF57HZX4KA000212', d_name: 'Karen Thomas',  age: 36 },
  { license_num: 'DL009CT', vin: '9BW959754LB905734', d_name: 'Leo Jackson',   age: 48 },
  { license_num: 'DL010PA', vin: 'JN1BJ0HPXFM736498', d_name: 'Olivia Lewis',  age: 25 },
];

// INVOICES (15) — some auto, some home
export const invoices = [
  { invoice_id: 1,  invoice_date: '2024-01-15', due_date: '2024-02-15', invoice_amt: 600.00,  h_policy_id: null, a_policy_id: 1  },
  { invoice_id: 2,  invoice_date: '2024-01-20', due_date: '2024-02-20', invoice_amt: 900.00,  h_policy_id: 1,    a_policy_id: null },
  { invoice_id: 3,  invoice_date: '2024-02-15', due_date: '2024-03-15', invoice_amt: 490.25,  h_policy_id: null, a_policy_id: 2  },
  { invoice_id: 4,  invoice_date: '2024-02-01', due_date: '2024-03-01', invoice_amt: 1050.00, h_policy_id: 2,    a_policy_id: null },
  { invoice_id: 5,  invoice_date: '2024-03-10', due_date: '2024-04-10', invoice_amt: 435.00,  h_policy_id: null, a_policy_id: 4  },
  { invoice_id: 6,  invoice_date: '2024-03-01', due_date: '2024-04-01', invoice_amt: 1200.00, h_policy_id: 4,    a_policy_id: null },
  { invoice_id: 7,  invoice_date: '2024-04-01', due_date: '2024-05-01', invoice_amt: 550.00,  h_policy_id: null, a_policy_id: 5  },
  { invoice_id: 8,  invoice_date: '2024-04-01', due_date: '2024-05-01', invoice_amt: 975.00,  h_policy_id: 5,    a_policy_id: null },
  { invoice_id: 9,  invoice_date: '2024-01-20', due_date: '2024-02-20', invoice_amt: 380.00,  h_policy_id: null, a_policy_id: 6  },
  { invoice_id: 10, invoice_date: '2024-01-15', due_date: '2024-02-15', invoice_amt: 1125.00, h_policy_id: 6,    a_policy_id: null },
  { invoice_id: 11, invoice_date: '2024-05-01', due_date: '2024-06-01', invoice_amt: 470.00,  h_policy_id: null, a_policy_id: 8  },
  { invoice_id: 12, invoice_date: '2024-05-01', due_date: '2024-06-01', invoice_amt: 1025.00, h_policy_id: 8,    a_policy_id: null },
  { invoice_id: 13, invoice_date: '2024-02-15', due_date: '2024-03-15', invoice_amt: 660.00,  h_policy_id: null, a_policy_id: 7  },
  { invoice_id: 14, invoice_date: '2024-01-15', due_date: '2024-02-15', invoice_amt: 875.00,  h_policy_id: 7,    a_policy_id: null },
  { invoice_id: 15, invoice_date: '2024-06-01', due_date: '2024-07-01', invoice_amt: 445.00,  h_policy_id: null, a_policy_id: 10 },
];

// PAYMENTS (15)
export const payments = [
  { payment_id: 1,  payment_data: '2024-02-10', pay_method: 'Credit', invoice_id: 1  },
  { payment_id: 2,  payment_data: '2024-02-14', pay_method: 'PayPal', invoice_id: 2  },
  { payment_id: 3,  payment_data: '2024-03-10', pay_method: 'Debit',  invoice_id: 3  },
  { payment_id: 4,  payment_data: '2024-02-28', pay_method: 'Check',  invoice_id: 4  },
  { payment_id: 5,  payment_data: '2024-04-05', pay_method: 'Credit', invoice_id: 5  },
  { payment_id: 6,  payment_data: '2024-03-28', pay_method: 'Credit', invoice_id: 6  },
  { payment_id: 7,  payment_data: '2024-04-28', pay_method: 'PayPal', invoice_id: 7  },
  { payment_id: 8,  payment_data: '2024-04-25', pay_method: 'Debit',  invoice_id: 8  },
  { payment_id: 9,  payment_data: '2024-02-15', pay_method: 'Check',  invoice_id: 9  },
  { payment_id: 10, payment_data: '2024-02-12', pay_method: 'Credit', invoice_id: 10 },
  { payment_id: 11, payment_data: '2024-05-28', pay_method: 'PayPal', invoice_id: 11 },
  { payment_id: 12, payment_data: '2024-05-30', pay_method: 'Debit',  invoice_id: 12 },
  { payment_id: 13, payment_data: '2024-03-12', pay_method: 'Credit', invoice_id: 13 },
  { payment_id: 14, payment_data: '2024-02-10', pay_method: 'Check',  invoice_id: 14 },
  { payment_id: 15, payment_data: '2024-06-25', pay_method: 'PayPal', invoice_id: 15 },
];
