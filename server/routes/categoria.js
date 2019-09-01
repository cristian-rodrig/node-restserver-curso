const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();

let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec( (err, categorias)=>{

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    categorias
                });
            });

});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaId) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaId) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Id no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaId 
         });

    });

});

//Crear todas las categorias
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({

        descripcion : body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Actualiza la categorias
app.put('/categoria/id:', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion : body.descripcion
    }

    Categoria.findByIdAndUpdate( id, desCategoria,{new: true, runValidators: true}, (err, categoriaDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//Mostrar todas las categorias
app.delete('/categoria/:id', [verificaToken, verificaAdminRole ],(req, res) => {
    //solo un administrador puede borrar categoria
    //Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err :{
                    message: "El id no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "categoriaBorrada"
            
        });
    });
});

 module.exports = app;