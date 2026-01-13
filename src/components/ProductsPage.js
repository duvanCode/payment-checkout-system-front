import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Package, Heart, Plus, Minus, ArrowRight } from 'lucide-react';
import { addToCart, setStep } from '../store/reducer';
import { formatCurrency } from '../utils/formatters';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, searchQuery, selectedCategory } = useSelector(state => state);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct, quantity));
      setSelectedProduct(null);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  const handlePayWithCreditCard = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct, quantity));
      dispatch(setStep('payment'));
      setSelectedProduct(null);
    }
  };


  return (
    <div className="products-container">
      {/* Título de sección */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Selección de Productos</h1>
          <p className="page-subtitle">Encuentra los mejores artículos con el respaldo y seguridad de nuestro sistema de pagos.</p>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <button className="favorite-button">
                <Heart size={20} />
              </button>
              {product.stock < 10 && product.stock > 0 && (
                <span className="stock-badge stock-badge-low">Últimas {product.stock} unid.</span>
              )}
              {product.stock === 0 && (
                <span className="stock-badge stock-badge-out">Agotado</span>
              )}
              {product.stock >= 10 && (
                <span className="stock-badge stock-badge-available">En Stock</span>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <div className="product-price-container">
                  <span className="product-price-label">Precio</span>
                  <div className="product-price">
                    {formatCurrency(product.price)}
                    <span className="product-currency"> COP</span>
                  </div>
                </div>
                <button
                  className="buy-button"
                  onClick={() => handleBuyClick(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <ShoppingCart size={64} />
          <p className="empty-text">No se encontraron productos</p>
        </div>
      )}

      {/* Modal de cantidad */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h3 className="modal-title">Seleccionar cantidad</h3>
                <p className="modal-subtitle">Paso 1 de 2: Cantidad</p>
              </div>
            </div>

            <div className="modal-product-info">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="modal-product-image" />
              <div>
                <h4 className="modal-product-name">{selectedProduct.name}</h4>
                <p className="modal-product-price">{formatCurrency(selectedProduct.price)} COP</p>
              </div>
            </div>

            <div className="quantity-section">
              <label className="quantity-label">Cantidad *</label>
              <div className="quantity-selector">
                <button
                  className="quantity-button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  type="button"
                >
                  <Minus size={18} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  type="button"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="quantity-hint">Disponible: {selectedProduct.stock} unidades</p>
            </div>

            <div className="modal-total">
              <span className="modal-total-label">Total</span>
              <span className="modal-total-value">{formatCurrency(selectedProduct.price * quantity)} COP</span>
            </div>

            <div className="modal-actions">
              <button
                className="modal-submit-button"
                onClick={handleAddToCart}
              >
                Agregar al carrito
                <ArrowRight size={20} />
              </button>
              <button
                className="modal-submit-button modal-submit-button-primary"
                onClick={handlePayWithCreditCard}
              >
                Pay with credit card
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className="cart-feedback">
          ¡Producto agregado al carrito!
        </div>
      )}
    </div>
  );
};


export default ProductsPage;