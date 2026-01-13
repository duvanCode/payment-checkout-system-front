import { createStore } from 'redux';
import reducer from './reducer';

// Crear store de Redux
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Suscribirse para guardar el carrito en local storage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.cart));
});

export default store;

