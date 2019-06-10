// Requires
var express = require('express'),
mongoose = require('mongoose');


// Conexión DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
    if (err) throw err;

    console.log('Base de datos en puerto 27017: \x1b[32m%s\x1b[0m','online');
    
});

// Inicializar Express
var app = express();


// Rutas
app.get('/', (req, res, next) => {

     res.status(400).json({
         ok: true,
         mensaje: 'Petición realizada exitosamente'
     });

})

// Escuchar peticiones
app.listen(3000,  () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
})
