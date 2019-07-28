var express = require('express'),
    mdAutentication = require('../middlewares/autenticacion'),
    app = express();

var Medico = require('../models/medico');

// Obtener todos los medicos
app.get('/', (req, res) => {
    Medico.find({})
    .exec((err, medicos) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicos',
                erros: err
            });

        }

        res.status(200).json({
            ok: true,
            medicos
        });
    });
});

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

app.get('/:id', (req, res) => {
    let id_medico = req.params.id;

    Medico.findById(id_medico, (err, medico) => {
        if( err) {
            return res.status(500).json({
                ok: false,
                error: 'Error al momento de buscar el medico',
                errors: err
            });
        }

        if ( ! medico ) {
            return res.status(400).json({
                ok: false,
                error: 'El medico ingresado no existe'
            })
        }


        res.json({
            ok: true,
            medico
        });
    });

})

app.put('/:id', mdAutentication.verificaToken, (req, res) => {
    
    const id_usuario = req.usuario._id,
        id_medico = req.params.id,
        nombre = req.body.nombre;

    Medico.findById(id_medico, (err, medico) => {
        if( err) {
            return res.status(500).json({
                ok: false,
                error: 'Error al momento de buscar el medico',
                errors: err
            });
        }

        if ( ! medico ) {
            return res.status(400).json({
                ok: false,
                error: 'El medico ingresado no existe'
            })
        }


        if( medico.usuario != id_usuario ) {
            return res.status(401).json({
                ok: false,
                error: 'No tienes permiso para modificar este medico.'
            });
        }

        medico.nombre = nombre;

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: 'Error al momento de modificar el medico'
                });
            }

            res.json({
                ok: true,
                medico: medicoActualizado
            });
        });
    });
})

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    
    const id_usuario = req.usuario._id,
        id_medico = req.params.id;

    Medico.findById(id_medico, (err, medico) => {
        if( err) {
            return res.status(500).json({
                ok: false,
                error: 'Error al momento de buscar el medico',
                errors: err
            });
        }

        if ( ! medico ) {
            return res.status(400).json({
                ok: false,
                error: 'El medico ingresado no existe'
            })
        }


        if( medico.usuario != id_usuario ) {
            return res.status(401).json({
                ok: false,
                error: 'No tienes permiso para eliminar este medico.'
            });
        }

        medico.remove((err, medicoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: 'Error al momento de eliminar el medico'
                });
            }

            res.json({
                ok: true,
                medico: medicoEliminado
            });
        });
    });
})

module.exports = app;