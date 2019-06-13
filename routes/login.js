var express = require('express'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    SEED = require('../config').SEED;


    var app = express();

var Usuario = require('../models/usuario');


app.post('/', (req, res) => {
    var body = req.body;

    const {
        email,
        password
    } = body


    if (!email || !password) {
        return res.status(400).json({
            error: true,
            code: 'bad/request',
            message: 'Faltan parametros'
        });
    }

    Usuario.findOne({
        email: email
    }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el correo',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El correo ingresado no existe',
                errors: err
            });
        }

        var verify_password = bcrypt.compareSync(password, usuario.password);

        if (!verify_password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña ingresada es incorrecta, por favor revise sus datos',
                errors: err
            });
        }

        usuario.password = ':)';

        // Generar JWT

        var token = jwt.sign({
            usuario: usuario,
            id: usuario._id,
            role: usuario.role
        }, SEED, {
            expiresIn: 14400 // 4 Horas
        });

        res.json({
            ok: true,
            usuario: usuario,
            id: usuario._id,
            token: token
        });

    });
});


module.exports = app;