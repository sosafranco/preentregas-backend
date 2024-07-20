const express = require('express')
const router = express.Router()

module.exports = (cartManager, productManager) => {
    // Ruta POST /api/carts - se crea un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart()
            res.json({ newCart })
        } catch (error) {
            console.error("Error creating a new cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta GET /api/carts/:cid - se listan los productos que pertenecen a determinado carrito
    router.get('/:cid', async (req, res) => {
        const cartId = parseInt(req.params.cid)
        try {
            const cart = await cartManager.getCartById(cartId)
            res.json(cart.products)
        } catch (error) {
            console.error("Error retrieving the cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta POST /api/carts/:cid/product/:pid - se agregan productos a distintos carritos
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const quantity = req.body.quantity || 1
        try {
            const updateCart = await cartManager.addProductToCart(cartId, productId, productManager, quantity)
            res.json(updateCart.products)
        } catch (error) {
            console.error("Error adding a product to the cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}