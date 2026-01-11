import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Package } from 'lucide-react';
import { setCart, setStep } from '../store/reducer';
import { formatCurrency } from '../utils/formatters';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, searchQuery, selectedCategory } = useSelector(state => state);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleProceedToPayment = () => {
    if (selectedProduct) {
      dispatch(setCart({ product: selectedProduct, quantity }));
      dispatch(setStep('payment'));
    }
  };

  return (
    <div className="products-container">
      {/* Banner de ofertas */}
      <div className="banner">
        <div className="banner-badge">Nuevo</div>
        <h2 className="banner-title">Ofertas Especiales</h2>
        <p className="banner-text">Hasta 50% de descuento en productos seleccionados</p>
        <button className="banner-button">Ver ofertas</button>
      </div>

      {/* Título de sección */}
      <div className="section-header">
        <h2 className="section-title">Nuestros Productos</h2>
        <select className="sort-select">
          <option>Ordenar por</option>
          <option>Precio: Menor a Mayor</option>
          <option>Precio: Mayor a Menor</option>
          <option>Más Populares</option>
        </select>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <div>
                  <div className="product-price">{formatCurrency(product.price)}</div>
                  <div className="product-stock">
                    <Package size={14} className="stock-icon" />
                    {product.stock} disponibles
                  </div>
                </div>
                <button
                  className="buy-button"
                  onClick={() => handleBuyClick(product)}
                  disabled={product.stock === 0}
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <ShoppingCart size={64} color="#d1d5db" />
          <p className="empty-text">No se encontraron productos</p>
        </div>
      )}

      {/* Modal de cantidad */}
      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Seleccionar cantidad</h3>
            <p className="modal-product-name">{selectedProduct.name}</p>
            <div className="quantity-selector">
              <button
                className="quantity-button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-button"
                onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
              >
                +
              </button>
            </div>
            <p className="modal-total">
              Total: {formatCurrency(selectedProduct.price * quantity)}
            </p>
            <button
              className="submit-button"
              onClick={handleProceedToPayment}
            >
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;