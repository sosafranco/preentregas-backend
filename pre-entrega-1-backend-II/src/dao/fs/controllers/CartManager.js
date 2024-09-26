import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.lastId = Math.max(...this.carts.map((cart) => cart.id));
            }
        } catch (error) {
            console.error('Error loading carts from the file', error);
            await this.saveCarts();
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 4));
        } catch (error) {
            console.error('Error saving the file', error);
        }
    }

    async createCart() {
        try {
            const newCart = {
                id: ++this.lastId,
                products: [],
            };
            this.carts.push(newCart);
            await this.saveCarts();
            return newCart;
        } catch (error) {
            console.error('Error creating a cart', error);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error(`Cart with id ${cartId} not found`);
            }
            return cart;
        } catch (error) {
            console.error('Error getting cart by id', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, productManager, quantity = 1) {
        try {
            const product = await productManager.getProductById(productId);
            if (!product) {
                throw new Error(`Product with id ${productId} does not exist`);
            }

            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find((p) => p.product === productId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error('Error adding a product to the cart', error);
        }
    }

    // Método para eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex((p) => p.product === productId);

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await this.saveCarts();
            } else {
                throw new Error(`Product with id ${productId} not found in cart ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error('Error removing a product from the cart', error);
        }
    }

    // Método para actualizar todos los productos del carrito
    async updateCartProducts(cartId, newProducts) {
        try {
            const cart = await this.getCartById(cartId);
            cart.products = newProducts;
            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error('Error updating the cart products', error);
        }
    }

    // Método para actualizar la cantidad de un producto específico en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find((p) => p.product === productId);

            if (productInCart) {
                productInCart.quantity = quantity;
                await this.saveCarts();
            } else {
                throw new Error(`Product with id ${productId} not found in cart ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error('Error updating the product quantity', error);
        }
    }

    // Método para eliminar todos los productos del carrito
    async clearCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            cart.products = [];
            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error('Error clearing the cart', error);
        }
    }
}

export default CartManager;