import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from './components/AppBar';
import Footer from './components/Footer';
import ProductsPage from './components/ProductsPage';
import PaymentModal from './components/PaymentModal';
import SummaryPage from './components/SummaryPage';
import ResultPage from './components/ResultPage';
import LoadingOverlay from './components/LoadingOverlay';
import { setProducts } from './store/reducer';
import { getProducts } from './services/api';
import './styles/variables.css';
import './styles/animations.css';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { currentStep, loading } = useSelector(state => state);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cargar productos al iniciar
    getProducts().then(data => {
      dispatch(setProducts(data.products));
    });

    // Verificar preferencia de modo oscuro del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode ? savedMode === 'true' : prefersDark;
    setDarkMode(isDark);
    document.body.classList.toggle('dark-mode', isDark);
  }, [dispatch]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'products':
        return <ProductsPage />;
      case 'payment':
        return <PaymentModal />;
      case 'summary':
        return <SummaryPage />;
      case 'result':
        return <ResultPage />;
      default:
        return <ProductsPage />;
    }
  };

  const showAppBar = currentStep === 'products';
  const showFooter = currentStep === 'products';

  return (
    <div className="app-container gradient-bg">
      {showAppBar && <AppBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      {renderCurrentStep()}
      {showFooter && <Footer />}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default App;
