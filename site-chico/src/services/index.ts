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
  async createOrder(data: unknown) {
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
