var express = require('express'),
    bcrypt = require('bcryptjs')
    jwt = require('jsonwebtoken');
    mdAutentication = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

// Obtener usuarios
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {

                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        erros: err
                    });

                }

                res.status(200).json({
                    ok: true,
                    usuarios
                });
            });
});

// Crear un usuario
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    const {
        nombre,
        email,
        password,
        img,
        role
    } = body;

    var password_hash = bcrypt.hashSync(password, 10);

    var usuario = new Usuario({
        nombre,
        email,
        password: password_hash,
        img,
        role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                erros: err
            });

        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });
});

// Actualizar usuario
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if( ! usuario ) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        const {
            nombre,
            email,
            role
        } = body;
        
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.role= role;


        usuario.save( (err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        });
    });
});

// Borrar usuario
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if( ! usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró el usuario ingresado',
                errors: {
                    message: 'No se encontró el usuario ingresado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
        
    });
});

module.exports = app;