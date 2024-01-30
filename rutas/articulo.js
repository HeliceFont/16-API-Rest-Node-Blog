// import { Router } from "express"
const express = require("express");
const multer = require("multer");
const ArticuloControlador = require("../controladores/articulo");

const router = express.Router()

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        // donde se suben los archivos
        cb(null, './imagenes/articulos/')
    },

    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname)
    }
})

const subidas = multer({storage: almacenamiento })



// import { prueba, probando, crear } from "../controladores/Articulo"

//Rutas de prueba y metodo
router.get("/ruta-de-prueba", ArticuloControlador.prueba)
router.get("/probando", ArticuloControlador.probando)


// Ruta util
router.post("/crear", ArticuloControlador.crear)
router.get("/articulos/:ultimos?", ArticuloControlador.listar)
router.get("/articulo/:id", ArticuloControlador.uno)
router.delete("/articulo/:id", ArticuloControlador.borrar)
router.put("/articulo/:id", ArticuloControlador.editar)
router.post("/subir-imagen/:id", subidas.single("file0"), ArticuloControlador.subir)
router.get("/imagen/:fichero", ArticuloControlador.imagen)
router.get("/buscar/:busqueda", ArticuloControlador.buscador)



// export 
module.exports = router