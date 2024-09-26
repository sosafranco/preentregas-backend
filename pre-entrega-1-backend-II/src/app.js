import express from 'express';
// import ProductManager from '../src/dao/fs/controllers/ProductManager.js';
// import CartManager from '../src/dao/fs/controllers/CartManager.js';
import ProductManager from '../src/dao/db/product-manager-db.js';
import CartManager from '../src/dao/db/cart-manager-db.js';
import viewsRouter from './routes/views.router.js';
import http from 'http';
import { Server } from 'socket.io';
import './database.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(
    session({
        secret: "secretCoder",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://francososa:estoesboca12@cluster0.5txnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            ttl: 100,
        }),
    })
);

//Configuracion de passport
import passport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.router.js';

app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// const productManager = new ProductManager('../src/dao/fs/data/products.json');
// const cartManager = new CartManager('../src/dao/fs/data/carts.json');
const productManager = new ProductManager();
const cartManager = new CartManager();

// Configurar express-handlebars
import { engine } from 'express-handlebars';
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Rutas de productos y vistas
app.use('/api/products', (await import('./routes/products.router.js')).default(productManager));
app.use('/', viewsRouter);

// Rutas de carritos
const cartRouter = (await import('./routes/cart.router.js')).default;
app.use('/api/carts', cartRouter(cartManager, productManager));

// Configurar socket.io
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    const products = await productManager.getProducts();
    socket.emit("products", products.docs);

    // Se escucha eventos del cliente para agregar un producto
    socket.on('addProduct', async (newProduct) => {
        // Se agrega el nuevo producto y se emite la lista actualizada a todos los clientes
        await productManager.addProduct(newProduct);
        io.emit('products', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const deletedProduct = await productManager.deleteProduct(id);
            if (deletedProduct) {
                console.log("Producto eliminado correctamente:", deletedProduct);
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
            } else {
                console.log("No se pudo eliminar el producto con ID:", id);
                socket.emit('deleteError', 'No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            socket.emit('deleteError', 'Error al eliminar el producto: ' + error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.set('socketio', io);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});