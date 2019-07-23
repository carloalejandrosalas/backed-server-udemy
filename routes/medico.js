var express = require('express'),
    mdAutentication = require('../middlewares/autenticacion'),
    app = express();

var Medico = require('../models/medico');

app.post('/', mdAutentication.verificaToken, (req, res) => {
    
    var Hospital = require('../models/hospital');
    
    let body = req.body;

    let id_usuario = req.usuario._id;

    const {
        nombre,
        id_hospital
    } = body


    Hospital.findById(id_hospital, (err, hospital) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al momento de buscar el hospital',
                errors: err
            });

        }

        if( hospital == null) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital ingresado no existe'
            });
        }

        let medico = new Medico({
            nombre,
            usuario: id_usuario,
            hospital: id_hospital
        })        

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al momento de registrar el medico'
                });
            }

            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

module.exports = app;