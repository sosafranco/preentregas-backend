const express = require('express');
const app = express();
const ProductManager = require('./controllers/product-manager');
const CartManager = require('./controllers/cart-manager');

const manager = new ProductManager('./src/data/productos.json');
const cartManager = new CartManager('./src/data/carritos.json');

const PUERTO = 8080;

app.use(express.json());

//* Rutas de productos

app.get('/api/products', async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getProducts();
    res.send(limit ? products.slice(0, limit) : products);
});

app.get('/api/products/:pid', async (req, res) => {
    const product = await manager.getProductById(parseInt(req.params.pid));
    product ? res.send(product) : res.status(404).send('Producto no encontrado');
});

app.post('/api/products', async (req, res) => {
    const { title, description, price, img, code, stock } = req.body;
    await manager.addProduct(title, description, price, img, code, stock);
    res.status(201).send('Producto agregado');
});

app.put('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;
    const products = await manager.getProducts();
    const index = products.findIndex((p) => p.id === parseInt(pid));
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields, id: products[index].id };
        await manager.guardarArchivo(products);
        res.send('Producto actualizado');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    const products = await manager.getProducts();
    const newProducts = products.filter((p) => p.id !== parseInt(req.params.pid));
    if (products.length !== newProducts.length) {
        await manager.guardarArchivo(newProducts);
        res.send('Producto eliminado');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

//* Rutas de carritos

app.post('/api/carts', async (req, res) => {
    const newCart = await cartManager.addCart();
    res.status(201).send(newCart);
});

app.get('/api/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    cart ? res.send(cart) : res.status(404).send('Carrito no encontrado');
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    cart ? res.send(cart) : res.status(404).send('Carrito o producto no encontrado');
});

//* Listen

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
