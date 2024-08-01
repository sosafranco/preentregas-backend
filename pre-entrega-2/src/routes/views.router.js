const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productManager = new ProductManager('./src/models/products.json');

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { title: 'Store', products });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', { title: 'Real Time Products' });
});

module.exports = router;

