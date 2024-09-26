import express from 'express';
const router = express.Router();

export default (cartManager, productManager) => {
    // Ruta POST /api/carts - se crea un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart();
            res.json({ newCart });
        } catch (error) {
            console.error('Error creating a new cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta GET /api/carts/:cid - se listan los productos que pertenecen a determinado carrito
    router.get('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        try {
            const cart = await cartManager.getCartById(cartId);
            res.json(cart.products);
        } catch (error) {
            console.error('Error retrieving the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta POST /api/carts/:cid/product/:pid - se agregan productos a distintos carritos
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const updateCart = await cartManager.addProductToCart(
                cartId,
                productId,
                quantity
            );
            res.json(updateCart.products);
        } catch (error) {
            console.error('Error adding a product to the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta DELETE /api/carts/:cid/products/:pid - elimina un producto específico del carrito
    router.delete('/:cid/products/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
            res.json(updatedCart.products);
        } catch (error) {
            console.error('Error removing the product from the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta PUT /api/carts/:cid - actualiza todos los productos del carrito
    router.put('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        const products = req.body.products;  // Debería ser un array de productos
        try {
            const updatedCart = await cartManager.updateCartProducts(cartId, products);
            res.json({ message: 'Cart updated successfully', updatedCart });
        } catch (error) {
            console.error('Error updating the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta PUT /api/carts/:cid/products/:pid - actualiza la cantidad de un producto específico en el carrito
    router.put('/:cid/products/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        try {
            const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
            res.json({ message: 'Product quantity updated successfully', updatedCart });
        } catch (error) {
            console.error('Error updating the product quantity in the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta DELETE /api/carts/:cid - elimina todos los productos del carrito
    router.delete('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartManager.clearCart(cartId);
            res.json({ message: 'All products removed from cart', updatedCart });
        } catch (error) {
            console.error('Error clearing the cart', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta POST /api/carts/add - agrega un producto al carrito
    router.post('/add', async (req, res) => {
        try {
            const { productId } = req.body;
            let cartId = req.session.cartId;

            if (!cartId) {
                const newCart = await cartManager.createCart();
                cartId = newCart._id.toString();
                req.session.cartId = cartId;
            }

            const updatedCart = await cartManager.addProductToCart(cartId, productId);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};