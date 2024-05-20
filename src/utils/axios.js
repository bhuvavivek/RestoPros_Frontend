import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    adminlogin: '/api/admin/login',
    userLogin: '/api/user/login',
    register: '/api/auth/register',
  },
  dashbord: {
    count: '/api/sales/count-dashboard',
    salecount: '/api/sales/order-sales-count',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  category: {
    add: '/api/category/create',
    list: '/api/category/get-all',
    edit: (id) => `/api/category/${id}`,
    delete: (id) => `/api/category/${id}`,
  },
  foodItem: {
    add: '/api/menu/create',
    list: '/api/menu/get-all',
    edit: (id) => `/api/menu/${id}`,
    delete: (id) => `/api/menu/${id}`,
  },
  service: {
    add: '/api/table/create',
    list: '/api/table/get-all',
    edit: (id) => `/api/table/${id}`,
    delete: (id) => `/api/table/${id}`,
  },
  customer: {
    list: '/api/customer/get-all',
    add: 'api/customer/create',
    edit: (id) => `/api/customer/${id}`,
    delete: (id) => `/api/customer/${id}`,
  },
  user: {
    add: 'api/admin/create-user',
    list: '/api/admin/get-all-users',
    edit: (id) => `/api/admin/update-user/${id}`,
    delete: (id) => `/api/admin/delete-user/${id}`,
  },
  sales: {
    list: '/api/order',
    detail: (id) => `/api/order/${id}`,
    addItem: `/api/order/add-item`,
  },
  role: {
    list: '/api/role/get-roles',
    add: '/api/role/create',
  },
  permissions: {
    list: '/api/admin/get-permissions',
  },
  orderBill: {
    create: '/api/bill/create',
  },
  editOrder: {
    editStatus: (id) => `/api/orderlist/status/${id}`,
  },
  profile:{
    userprofile:`/api/user/me`,
  }
};
