var jwt = require('jsonwebtoken'),
    SEED = require('../config').SEED;

// Middleware verify token

exports.verificaToken = function(req, res, next) {
    
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded)=> {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // })
    });
}