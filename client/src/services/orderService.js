import api from './api';

const orderService = {
  createOrder:         async (data)   => { const res = await api.post('/orders', data); return res.data; },
  createStripeSession: async (orderId) => { const res = await api.post('/orders/stripe-session', { orderId }); return res.data; },
  confirmOrder:        async (id, paymentIntentId) => { const res = await api.post(`/orders/${id}/confirm`, { paymentIntentId }); return res.data; },
  getMyOrders:         async ()       => { const res = await api.get('/orders/my'); return res.data; },
  getAllOrders:         async (params) => { const res = await api.get('/orders', { params }); return res.data; },
};

export default orderService;
