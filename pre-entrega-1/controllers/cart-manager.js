const fs = require('fs').promises;

class CartManager {
    static ultimoId = 0;

    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async addCart() {
        const arrayCarts = await this.leerArchivo();
        const nuevoCarrito = {
            id: ++CartManager.ultimoId,
            products: []
        };

        arrayCarts.push(nuevoCarrito);
        await this.guardarArchivo(arrayCarts);
        return nuevoCarrito;
    }

    async getCartById(id) {
        const arrayCarts = await this.leerArchivo();
        return arrayCarts.find((item) => item.id === id);
    }

    async addProductToCart(cid, pid) {
        const arrayCarts = await this.leerArchivo();
        const cartIndex = arrayCarts.findIndex((cart) => cart.id === cid);

        if (cartIndex === -1) {
            return 'Carrito no encontrado!';
        }

        const cart = arrayCarts[cartIndex];
        const productIndex = cart.products.findIndex((product) => product.id === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ id: pid, quantity: 1 });
        }

        await this.guardarArchivo(arrayCarts);
        return cart;
    }

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(respuesta);
    }

    async guardarArchivo(arrayCarts) {
        await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    }
}

module.exports = CartManager;
