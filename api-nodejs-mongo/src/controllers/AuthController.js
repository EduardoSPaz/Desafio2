const express = require("express");
const UserModel = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');


const generateToken = (user = {}) => {
    return jwt.sign({
        id: user.id,
        name: user.name
    }, authConfig.secret, {
        expiresIn: 1800
    });
}

router.post("/register", async(req, res) => {
    const {email} = req.body;

    if(await UserModel.findOne({email})){
        return res.status(400).json({
            error: true,
            message:"Email já existente"
        })
    }
    
    const user = await UserModel.create(req.body);

    user.password = undefined;

    const responseUser = {
        id: user.id,
        "Data de Criação": user.createdAt,
        updatedAt: user.updatedAt,
        "Último Login": user.ultimo_login,
    };

    return res.json({
        user: responseUser,
        token: generateToken(user)
    });
});

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email }).lean().select("+password");

        if (!user) {
            return res.status(400).json({
                error: true,
                message: 'Usuário e/ou senha inválidos'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password || '');

        if (!passwordMatch) {
            return res.status(401).json({
                error: true,
                message: 'Usuário e/ou senha inválidos'
            });
        }

        user.ultimo_login = new Date();
        await UserModel.updateOne({ _id: user._id }, { ultimo_login: user.ultimo_login });

        delete user.password;

        const responseUser = {
            id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            ultimo_login: user.ultimo_login,
        };

        return res.json({
            user: responseUser,
            token: generateToken(user)
        });
    } catch (error) {
        console.error('Erro durante a autenticação:', error);
        return res.status(500).json({
            error: true,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
