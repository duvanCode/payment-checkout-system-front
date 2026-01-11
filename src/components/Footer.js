import React from 'react';
import { Truck, Lock, RefreshCw, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Características principales */}
      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={32} color="#FF8C42" />
              </div>
              <h3 className="feature-title">Envío Gratis</h3>
              <p className="feature-text">En compras mayores a $100.000</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={32} color="#4ECDC4" />
              </div>
              <h3 className="feature-title">Pago Seguro</h3>
              <p className="feature-text">Transacciones Seguras</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <RefreshCw size={32} color="#FF6B6B" />
              </div>
              <h3 className="feature-title">Devoluciones</h3>
              <p className="feature-text">30 días para cambios o devoluciones</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MessageCircle size={32} color="#95E1D3" />
              </div>
              <h3 className="feature-title">Soporte 24/7</h3>
              <p className="feature-text">Atención por WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enlaces del footer */}
      <div className="links-section">
        <div className="container">
          <div className="links-grid">
            <div>
              <h4 className="links-title">TechStore</h4>
              <p className="footer-description">
                Tu tienda de confianza con pagos seguros.
              </p>
            </div>

            <div>
              <h4 className="links-title">Enlaces</h4>
              <ul className="links-list">
                <li className="link-item">Sobre nosotros</li>
                <li className="link-item">Contacto</li>
                <li className="link-item">FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="links-title">Legal</h4>
              <ul className="links-list">
                <li className="link-item">Términos y condiciones</li>
                <li className="link-item">Política de privacidad</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <div className="container">
          <p className="copyright-text">
            © 2026 TechStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;