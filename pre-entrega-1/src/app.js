const express = require('express')
const ProductManager = require('./controllers/ProductManager')
const CartManager = require('./controllers/CartManager')

const app = express()
const PORT = 8080

const productManager = new ProductManager('./src/models/products.json')
const cartManager = new CartManager('./src/models/carts.json')

//Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Rutas de productos
app.use('/api/products', require('./routes/products.router')(productManager))

// Rutas de carritos
app.use('/api/carts', require('./routes/cart.router')(cartManager, productManager))

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})