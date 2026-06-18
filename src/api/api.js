import axios from 'axios';

// 10.0.2.2 = localhost for Android Emulator
// Change to your PC IP (e.g. 192.168.1.5) for real Android device
export const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const getDashboard    = ()           => api.get('/dashboard');
export const getLedgers      = ()           => api.get('/ledgers');
export const getLedgerStatement = (name)   => api.get(`/ledger-statement/${encodeURIComponent(name)}`);
export const getVouchers     = (params)    => api.get('/vouchers', { params });
export const getVoucherDetail= (id)        => api.get(`/voucher/${id}`);
export const getSalesSummary = ()           => api.get('/sales-summary');
export const getTopCustomers = ()           => api.get('/top-customers');
