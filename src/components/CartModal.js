import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity, setStep } from '../store/reducer';
import { formatCurrency } from '../utils/formatters';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    if (!isOpen) return null;

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleUpdateQuantity = (productId, newQuantity, stock) => {
        if (newQuantity >= 1 && newQuantity <= stock) {
            dispatch(updateQuantity(productId, newQuantity));
        }
    };

    const handleProceedToCheckout = () => {
        if (cart.length > 0) {
            dispatch(setStep('payment'));
            onClose();
        }
    };

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <div className="cart-header-title">
                        <ShoppingCart size={24} />
                        <h2>Tu Carrito</h2>
                        <span className="cart-count">({cart.length} productos)</span>
                    </div>
                    <button className="cart-close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items-container">
                    {cart.length === 0 ? (
                        <div className="cart-empty-state">
                            <ShoppingCart size={64} />
                            <p>Tu carrito está vacío</p>
                            <button className="cart-continue-shopping" onClick={onClose}>
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.product.id} className="cart-item">
                                <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h3 className="cart-item-name">{item.product.name}</h3>
                                    <p className="cart-item-price">{formatCurrency(item.product.price)} COP</p>

                                    <div className="cart-item-actions">
                                        <div className="cart-quantity-selector">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1, item.product.stock)}
                                                className="q-btn"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="q-display">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1, item.product.stock)}
                                                className="q-btn"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button
                                            className="cart-remove-button"
                                            onClick={() => dispatch(removeFromCart(item.product.id))}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-total">
                                    {formatCurrency(item.product.price * item.quantity)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-total-section">
                            <span className="cart-total-label">Total estimado</span>
                            <span className="cart-total-value">{formatCurrency(total)} COP</span>
                        </div>
                        <button className="cart-checkout-button" onClick={handleProceedToCheckout}>
                            Proceder al pago
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
