const fs = require('fs').promises;

class ProductManager {
    static ultimoId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, price, img, code, stock) {
        if (!title || !description || !price || !img || !code || !stock) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        const arrayProductos = await this.leerArchivo();

        if (arrayProductos.some((item) => item.code === code)) {
            console.log('El código debe ser único, no se pueden repetir');
            return;
        }

        const nuevoProducto = {
            id: ++ProductManager.ultimoId,
            title,
            description,
            price,
            img,
            code,
            stock,
            status: true,
            thumbnails: []
        };

        arrayProductos.push(nuevoProducto);
        await this.guardarArchivo(arrayProductos);
    }

    async getProducts() {
        return await this.leerArchivo();
    }

    async getProductById(id) {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos.find((item) => item.id === id);
    }

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(respuesta);
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }
}

module.exports = ProductManager;
