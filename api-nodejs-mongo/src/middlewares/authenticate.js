const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).json({
            error:true,
            message: 'Não autorizado'
        })
    }
    const parts = authHeader.split(" ");

    if(parts.length !== 2){
        return res.status(401).json({
            error: true,
            message: 'Token inválido'
        })
    }

    const [scheme, token] = parts;

    if(scheme.indexOf("Bearer") !== 0){
        return res.status(401).json({
            error: true,
            message: "Token mal formatado"
        })
    }

    return jwt.verify(token, authConfig.secret, (err, decoded)=>{

        if(err){
            return res.status(401).json({
                error:true,
                message: "Sessão inválida"
            })
        }

        req.userLogged = decoded;

        return next();
    })
    
}