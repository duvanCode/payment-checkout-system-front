const mockProducts = [
  {
    id: 'prod_001',
    name: 'Smartphone Galaxy X',
    description: 'Último modelo con cámara de 108MP y batería de larga duración',
    price: 1299000,
    stock: 15,
    category: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
  },
  {
    id: 'prod_002',
    name: 'Laptop Pro 15"',
    description: 'Procesador Intel i7, 16GB RAM, 512GB SSD',
    price: 3499000,
    stock: 8,
    category: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
  },
  {
    id: 'prod_003',
    name: 'Auriculares Bluetooth Premium',
    description: 'Cancelación de ruido activa, 30h de batería',
    price: 449000,
    stock: 25,
    category: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
  },
  {
    id: 'prod_004',
    name: 'Camiseta Casual',
    description: '100% algodón, disponible en varios colores',
    price: 59000,
    stock: 50,
    category: 'Ropa',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    id: 'prod_005',
    name: 'Lámpara LED Moderna',
    description: 'Iluminación inteligente con control remoto',
    price: 129000,
    stock: 30,
    category: 'Hogar',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'
  }
];

export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ products: mockProducts, total: mockProducts.length }), 300);
  });
};

export const calculateSummary = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === data.productId);
      const subtotal = product.price * data.quantity;
      const baseFee = 5000;
      const deliveryFee = data.deliveryCity.toLowerCase().includes('bogotá') ? 8000 : 15000;
      
      resolve({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: data.quantity,
        subtotal,
        baseFee,
        deliveryFee,
        total: subtotal + baseFee + deliveryFee,
        deliveryCity: data.deliveryCity
      });
    }, 300);
  });
};

export const createTransaction = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionNumber = `TRX-${Date.now()}`;
      resolve({
        transactionNumber,
        status: 'PENDING',
        productId: data.productId,
        productName: 'Product',
        quantity: data.quantity,
        subtotal: 0,
        baseFee: 5000,
        deliveryFee: 8000,
        total: 0,
        createdAt: new Date()
      });
    }, 300);
  });
};

export const processPayment = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.2;
      const transactionNumber = `TRX-${Date.now()}`;
      
      if (success) {
        const product = mockProducts.find(p => p.id === data.productId);
        product.stock -= data.quantity;
        
        resolve({
          success: true,
          transactionNumber,
          status: 'APPROVED',
          message: 'Pago procesado exitosamente',
          delivery: {
            trackingNumber: `TRACK-${Date.now()}`,
            estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            address: data.deliveryAddress,
            city: data.deliveryCity
          },
          product: {
            id: product.id,
            name: product.name,
            updatedStock: product.stock
          },
          createdAt: new Date(),
          processedAt: new Date()
        });
      } else {
        resolve({
          success: false,
          transactionNumber,
          status: 'DECLINED',
          message: 'Pago rechazado',
          error: {
            code: 'CARD_DECLINED',
            message: 'La tarjeta fue rechazada por el banco emisor'
          },
          createdAt: new Date(),
          processedAt: new Date()
        });
      }
    }, 1500);
  });
};
