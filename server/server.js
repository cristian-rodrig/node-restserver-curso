require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json());

// habilitar carpeta public
app.use(express.static(path.resolve( __dirname, '../public')));


//Configuracion global de rutas 
app.use(require('./routes/index'));


mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB,{useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto:', process.env.PORT);
});