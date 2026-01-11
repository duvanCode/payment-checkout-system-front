import React, { useEffect } from 'react';
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
import './styles/animations.css';

const App = () => {
  const dispatch = useDispatch();
  const { currentStep, loading } = useSelector(state => state);

  useEffect(() => {
    // Cargar productos al iniciar
    getProducts().then(data => {
      dispatch(setProducts(data.products));
    });
  }, [dispatch]);

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
    <div style={styles.app}>
      {showAppBar && <AppBar />}
      {renderCurrentStep()}
      {showFooter && <Footer />}
      {loading && <LoadingOverlay />}
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  }
};

export default App;
