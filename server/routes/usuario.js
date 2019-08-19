const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

//GET
app.get('/usuario', verificaToken, (req, res) => {
    
    // return res.json({
    //     usuario:req.usuario,
    //     nombre:req.usuario.nombre,
    //     email:req.usuario.email,
    // })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    
    Usuario.find({estado:true}, 'nombre email role estado google img')// con los nombres de los campos se puede realizar un filtrado de los campos necesarios a mostrar
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({estado:true}, (err, conteo) => {//se cambio .count por countDocumentsF
                
                res.json({
                    ok: true,
                    usuarios,
                    cuantos : conteo
                });
            });

        });
});


//POST
app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //encriptado de password con bcrypt
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


//PUT
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) { //se obtiene el id para hacer la actualizacion

    let id = req.params.id;
    let body = _.pick(req.body,
        ['nombre',
            'email',
            'img',
            'role',
            'estado'
        ]);
    //arreglo de opciones actualizables(uderscore)


    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});


//DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
    
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{ --Elimina el registro de la BD

    let cambiaEstado ={ //No lo elimina solo le cambia es etado a inactivo(false)
        estado:false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true} ,(err, usuarioBorrado)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
           ok: true,
           usuario: usuarioBorrado 
        });
    });

});

module.exports = app;