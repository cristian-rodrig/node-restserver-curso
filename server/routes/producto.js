const express = require('express');
const {
    verificaToken,
    verificaAdminRole
} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//================================
// Obtener todos los productos
//================================
app.get('/productos', (req, res) => {

    //trae todos los productos
    //populate : usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({
            disponible: true
        })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});


//================================
// Obtener un  productopor ID
//================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //trae un producto por ID
    //populate : usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoId) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoId) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Id no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoId
            });

        });

});

//================================
// Buscar productos
//================================
app.get('/productos/buscar/:termino',verificaToken, (req, res) =>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')//regex Expresion regular de el parametro termino para hacer busquedas mas flexibles(la i es para ignorar mayusculas y minusculas)

  Producto.find({ nombre: regex })
    .populate('categoria' , 'nombre')  
    .exec(err, productos)

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    res.json({
        ok:true,
        productos
    })
});





//================================
// Crear un nuevo producto
//================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una producto del listado de productos
    let body = req.body;

    let producto = new Producto({

        descripcion: body.descripcion,
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

//================================
// Actualizar un producto
//================================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado de categorias
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el producto no existe"
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

        });


        res.json({
            ok: true,
            producto: productoGuardado
        });

    });

});

//================================
// Borrar un producto
//================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //disponible cambia el estado a false de la tabla de productos

    let id = req.params.id;

    // Producto.findByIdAndRemove(id, (err, productoBorrado)=>{
    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: "Producto Borrado",

            });
        });

    });

});



module.exports = app;