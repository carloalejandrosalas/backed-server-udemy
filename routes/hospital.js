var express = require('express'),
    mdAutentication = require('../middlewares/autenticacion'),
    app = express();

var Hospital = require('../models/hospital');

// Obtener todos los hospitales
app.get('/', (req, res) => {
    Hospital.find({})
    .exec((err, hospitales) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                erros: err
            });

        }

        res.status(200).json({
            ok: true,
            hospitales
        });
    });
});

app.post('/', mdAutentication.verificaToken, (req, res) => {

    let body = req.body;

    let id_usuario = req.usuario._id;

    const {
        nombre
    } = body;

    let hospital = new Hospital({
        nombre,
        usuario: id_usuario
    });

    hospital.save((err, hospitalGuardado) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                erros: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    })
})

app.get('/:id', (req, res) => {
    let id_hospital = req.params.id;

    Hospital.findById(id_hospital, (err, hospital) => {
        if( err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al momento de buscar el hospital',
                errors: err
            });
        }

        if(hospital == null) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El hospital ingresado no existe'
            })
        }


        res.json({
            ok: true,
            hospital
        })
    });
});

app.put('/:id', mdAutentication.verificaToken, (req, res) => {
    
    let id_usuario = req.usuario._id;

    let id_hospital = req.params.id;
    
    let body = req.body;

    const {
        nombre
    } = body;

    Hospital.findById(id_hospital, (err, hospital) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al momento de buscar el hospital',
                errors: err
            });
        }

        if(hospital == null) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El hospital ingresado no existe'
            })
        }


        if( ! hospital) {
            return res.status(404).json({
                ok: true,
                mensaje: 'El hospital ingresado no existe'
            });
        }

        if( hospital.usuario != id_usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usted no esta autorizado para modificar este hospital'
            })
        }
        
        hospital.nombre = nombre;

        hospital.save((err, hospitalGuardado) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar cambios',
                    errors: err
                });
            }

            res.json({
                ok: true,
                hospital: hospitalGuardado
            })
        });
    });

});

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    let id_hospital = req.params.id;

    let id_usuario = req.usuario._id;

    Hospital.findById(id_hospital, (err, hospital) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al momento de buscar el hospital'                
            });
        }

        if(hospital == null) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El hospital ingresado no existe'
            })
        }

        if ( hospital.usuario != id_usuario ) {
            return res.status(401).json({
                ok:false,
                mensaje: 'Usted no puede eliminar este hospital'
            });
        }

        hospital.remove((err, hospitalEliminado) => {
            if( err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al momento de borrar el hospital'
                })
            }

            res.json({
                ok: true,
                hospital: hospitalEliminado
            });
        });
    });
});



module.exports = app;