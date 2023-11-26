const mongoose = require("../database");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    telefones: [
        {
            numero: {
                type: String,
                required: true,
            },
            ddd: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    data_atualizacao: {
        type: Date,
        default: null,
    },
    ultimo_login: {
        type: Date,
        default: null,
    },
});

UserSchema.pre("save", async function (next) {
    const now = new Date();

    this.data_atualizacao = now;

    
    if (!this.createdAt) {
        this.ultimo_login = now;
    }

    
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
});


const User = mongoose.model("User", UserSchema);

module.exports = User;