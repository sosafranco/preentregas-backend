import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import generateToken from "../utils/jsonwebtoken.js";

const router = Router();

router.use((req, res, next) => {
    console.log("Datos de la solicitud:", req.body);
    next();
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const nuevoUsuario = await UserModel.create({ first_name, last_name, email, password: createHash(password), age });

        const token = generateToken(nuevoUsuario);
        res.status(201).send({ message: "Usuario creado con éxito", token });
    } catch (error) {
        res.status(500).send({ message: "Error al crear el usuario", error });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email });

        if (!usuario) {
            return res.status(400).send("Usuario no encontrado");
        }

        if (!isValidPassword(password, usuario)) {
            return res.status(400).send("Credenciales inválidas");
        }

        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email
        });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de duración
        res.send({ message: "Login correcto!", token });

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: "Logout exitoso" });
});

router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        res.json({
            user: {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
        });
    } else {
        res.status(401).json({ message: "No hay usuario autenticado" });
    }
});

export default router;