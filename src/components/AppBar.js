import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, Moon, Sun } from 'lucide-react';
import { setSearchQuery } from '../store/reducer';
import './AppBar.css';

const AppBar = ({ darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.searchQuery);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <ShoppingCart size={24} strokeWidth={2.5} />
            </div>
            <span className="logo-text">
              Pay<span className="logo-light">Store</span>
            </span>
          </div>

          {/* Barra de búsqueda */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="search-input"
            />
          </div>

          {/* Iconos de acción */}
          <div className="actions">
            <button className="btn-login">
              <span>Inicia sesión</span>
            </button>
            <button className="btn-signup">
              <span>Crea tu cuenta</span>
            </button>
            <button className="btn-dark-mode" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="cart-button">
              <ShoppingCart size={22} />
              <span className="cart-badge">0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;