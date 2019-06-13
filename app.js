// Requires
var express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser');

// Inicializar Express
var app = express();


// Body parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexión DB
mongoose.connect('mongodb://localhost/hospitalDB', {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log('Base de datos \x1b[32m%s\x1b[0m','online');

});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000,  () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
})
