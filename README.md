# Payment Checkout System - Frontend

Sistema de checkout de pagos desarrollado con React, Redux y CSS puro.

## 🚀 Características

- ✅ Catálogo de productos con stock en tiempo real
- ✅ Validación de tarjetas de crédito (VISA/MasterCard)
- ✅ Resumen de compra con desglose de costos
- ✅ Procesamiento de pagos con feedback visual
- ✅ Actualización automática de stock
- ✅ Diseño responsive (mobile-first)
- ✅ Redux para manejo de estado global
- ✅ App Bar con búsqueda y carrito
- ✅ Footer informativo

## 📋 Requisitos previos

- Node.js v14 o superior
- npm v6 o superior

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## 📦 Construcción para producción

```bash
npm run build
```

## 🗂️ Estructura del proyecto

```
src/
├── components/
│   ├── AppBar.js            # Barra de navegación superior
│   ├── Footer.js            # Footer informativo
│   ├── ProductsPage.js      # Página de catálogo
│   ├── PaymentModal.js      # Formulario de pago
│   ├── SummaryPage.js       # Resumen de compra
│   ├── ResultPage.js        # Resultado de transacción
│   └── LoadingOverlay.js    # Overlay de carga
├── store/
│   ├── store.js             # Configuración de Redux
│   └── reducer.js           # Reducer principal
├── services/
│   └── api.js               # Servicios API
├── utils/
│   ├── validation.js        # Utilidades de validación
│   └── formatters.js        # Formateadores
├── styles/
│   └── animations.css       # Animaciones CSS
├── App.js                   # Componente principal
└── index.js                 # Punto de entrada
```

## 🎨 Diseño

El diseño está utilizando:
- Color primario: #1ED760 (verde)
- Bordes redondeados estilo "pill"
- Inputs limpios sin sombras internas
- Transiciones suaves
- App Bar con búsqueda y carrito
- Footer informativo con enlaces

## 📱 Responsive

Diseñado mobile-first con soporte para:
- iPhone SE (320px) y superiores
- Tablets
- Desktop

## 🧪 Pruebas

Para probar el sistema, usa estos datos de tarjeta de prueba:
- Número: 4111 1111 1111 1111 (VISA)
- Número: 5555 5555 5555 4444 (MasterCard)
- CVV: 123
- Fecha: Cualquier fecha futura

## 📄 Licencia

MIT
