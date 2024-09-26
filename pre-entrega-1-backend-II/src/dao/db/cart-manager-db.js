import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            return cart;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error;
        }
    }
}

export default CartManager;