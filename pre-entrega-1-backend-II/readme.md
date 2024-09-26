# Proyecto E-commerce Backend

Este proyecto es un backend para una aplicación de comercio electrónico, desarrollado con Node.js, Express y MongoDB.

## Estructura del Proyecto

proyectoFinalBackend1/
│
├── src/
│ ├── dao/
│ │ ├── db/
│ │ │ ├── cart-manager-db.js
│ │ │ └── product-manager-db.js
│ │ ├── fs/
│ │ │ └── controllers/
│ │ │ ├── CartManager.js
│ │ │ └── ProductManager.js
│ │ └── models/
│ │ ├── cart.model.js
│ │ └── product.model.js
│ ├── public/
│ │ ├── css/
│ │ │ └── style.css
│ │ └── js/
│ │ └── realTimeProducts.js
│ ├── routes/
│ │ ├── cart.router.js
│ │ ├── products.router.js
│ │ └── views.router.js
│ ├── views/
│ │ ├── layouts/
│ │ │ └── main.handlebars
│ │ ├── cart.handlebars
│ │ ├── index.handlebars
│ │ ├── productDetails.handlebars
│ │ └── realTimeProducts.handlebars
│ ├── app.js
│ └── database.js
├── .gitignore

## Descripción de los Archivos Principales

### `src/app.js`

Este es el archivo principal de la aplicación. Configura el servidor Express, las rutas, y la conexión con Socket.io para la funcionalidad en tiempo real.

### `src/database.js`

Establece la conexión con la base de datos MongoDB.

### `src/dao/db/product-manager-db.js`

Maneja las operaciones CRUD para los productos en la base de datos.

### `src/routes/cart.router.js`

Define las rutas para las operaciones del carrito.

### `src/views/cart.handlebars`

Plantilla para la vista del carrito de compras.

## Características Principales

- Gestión de productos y carritos de compra
- Operaciones CRUD para productos y carritos
- Vistas en tiempo real con Socket.io
- Interfaz de usuario con Handlebars
- Estilos CSS personalizados

## Instalación y Uso

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Configura las variables de entorno en un archivo `.env`
4. Inicia el servidor con `npm start`

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de hacer un pull request.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)