// Serviço de pagamentos
export const paymentService = {
  async processCard(data: any) {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'card', paymentData: data }),
    });
    return response.json();
  },

  async processPIX(pixKey: string, amount: number) {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'pix', pixKey, amount }),
    });
    return response.json();
  },

  async generatePIXQRCode(amount: number) {
    const response = await fetch('/api/payment/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },
};

// Serviço de produtos
export const productService = {
  async fetchProducts(category?: string) {
    const query = category ? `?category=${category}` : '';
    const response = await fetch(`/api/products${query}`);
    return response.json();
  },

  async fetchProductBySlug(slug: string) {
    const response = await fetch(`/api/products/${slug}`);
    return response.json();
  },
};

// Serviço de pedidos
export const orderService = {
  async createOrder(data: any) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async fetchOrders(customerId: string) {
    const response = await fetch(`/api/orders?customerId=${customerId}`);
    return response.json();
  },

  async fetchOrderById(orderId: string) {
    const response = await fetch(`/api/orders/${orderId}`);
    return response.json();
  },
};
