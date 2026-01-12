import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { setSearchQuery, setCategory } from '../store/reducer';
import './AppBar.css';

const AppBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.searchQuery);
  const selectedCategory = useSelector(state => state.selectedCategory);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">T</div>
              <span className="logo-text">TechStore</span>
            </div>

            {/* Barra de búsqueda */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="search-input"
              />
              <button className="search-button">
                <Search size={20} color="#1ED760" />
              </button>
            </div>

            {/* Iconos de acción */}
            <div className="actions">
              <button className="icon-button">
                <Heart size={24} />
                <span className="badge">0</span>
              </button>
              <button className="icon-button">
                <ShoppingCart size={24} />
                <span className="badge">0</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;