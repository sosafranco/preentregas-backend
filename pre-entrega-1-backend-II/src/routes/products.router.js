import express from 'express';
const router = express.Router();

export default (productManager) => {
    // Ruta GET /api/products - se listan todos los productos con o sin un limite de muestra
    router.get('/', async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
            };

            let filter = {};
            if (query) {
                filter = { category: query };
            }

            const result = await productManager.getProducts(filter, options);

            const totalPages = result.totalPages;
            const prevPage = result.prevPage;
            const nextPage = result.nextPage;
            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;
            const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

            res.json({
                status: 'success',
                payload: result.docs,
                totalPages,
                prevPage,
                nextPage,
                page: result.page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            });
        } catch (error) {
            console.error('Error getting the products', error);
            res.status(500).json({ status: 'error', error: 'Internal Server Error' });
        }
    });

    // Ruta GET /api/products/:pid - se obtiene un producto por su id
    router.get('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await productManager.getProductById(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.error('Error getting the product', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta POST /api/products - se añade un producto
    router.post('/', async (req, res) => {
        try {
            const newProduct = req.body;
            await productManager.addProduct(newProduct);
            res.json({ message: 'Product added successfully' });
        } catch (error) {
            console.error('Error adding the product', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta PUT /api/products/:pid - se actualiza un producto
    router.put('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedProduct = req.body;
            await productManager.updateProduct(productId, updatedProduct);
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            console.error('Error updating the product', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Ruta DELETE /api/products/:pid - se elimina un producto
    router.delete('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            await productManager.deleteProduct(productId);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting the product', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};