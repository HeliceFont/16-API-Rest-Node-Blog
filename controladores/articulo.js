const fs = require ("fs");
const path = require("path")
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");
// const router = express.Router()


const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de artículos"
    });
}

const probando = (req, res) => {

    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json([{
        curso: "Master en React",
        autor: "Víctor Robles WEB",
        url: "victorroblesweb.es/master-react"
    },
    {
        curso: "Master en React",
        autor: "Víctor Robles WEB",
        url: "victorroblesweb.es/master-react"
    },
    ]);

};

const crear = (req, res) => {

    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);
    
    // Asignar valores a objeto basado en el modelo (manual o automatico)
    //articulo.titulo = parametros.titulo;

    // Guardar el articulo en la base de datos
    articulo.save().then((articuloGuardado) => {

        if (!articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el artículo"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            // parametros: req.params,
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito!!"
        })

    })
    .catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "error en el servidor"
        });
    })

}
const listar = (req, res) =>{
    setTimeout(async() =>{
        try{
            let consulta = Articulo.find({});
    
            if(req.params.ultimos) {
                //consulta.limit(5);
            }
    
            let articulos = await consulta.sort({fecha: -1}).exec();
    
            if( !articulos){
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado artículos"
                });
            }
            return res.status(200).send({
                status:"success",
                contador: articulos.length,
                articulos
            })
        }catch(error){
            return res.status(500).json({
                status: "error",
                mensaje: "se ha producido un error",
                error
            });
        }
    }, 3000)
    
}

const uno = (req, res) =>{
    //Recoger un id por la URL
    let id= req.params.id;
    
    //Buscar el artículo
    Articulo.findById(id)
        .then((articulo) => {
            //Devolver resultado
            return res.status(200).json({
                status: "success",
                articulo
            })
        })

        .catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        })
}

const borrar = (req, res) =>{
    
    let articulo_id = req.params.id;

    Articulo.findOneAndDelete(articulo_id)
        .then((articulo) => {
            if(!articulo){
                return res.status(404).json({
                    status: 'error',
                    articulo: articulo_id,
                    mensaje:'este articulo no existe'
                })
            }
            return res.status(200).json({
                status:"success",
                message: 'Artículo eliminado'})
        })
        .catch(error => {
        res.status(500).json({error: 'Ocurrió un error al eliminar el artículo'});
        });
    }

        

    const editar = (req, res) =>{
        // Recoger id articulo a editar
        let articuloId = req.params.id;

        // Recoger datos de body
        let parametros = req.body;

        // Validar datos
        try {
            validarArticulo(parametros);
        }catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }
        
        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({_id : articuloId}, req.body, {new: true})
            .then((articuloActualizado) =>{
                if(!articuloActualizado){
                    return res.status(404).json({
                        status: 'error',
                        mensaje: 'El articulo no se ha actualizado'
                    })
                }
                // Devolver respuesta
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado
                })
            })
        }
        
    const subir = (req, res) =>{
        // Configurar multer para la subida de archivos(Lo configuramos en el archivo de rutas)

        // Recoger el fichero de imagen subido
        console.log(req.file)

        // Nombre del archivo o imagen
        let archivo = req.file.originalname;

        // Extensión del archivo, el split permite cortar una string en varias partes, 
        // ("\.") esto quiere decir que divide el string por el punto asi dividimos el nombre del archivo y el formato o extensión despues del punto
        let archivo_split = archivo.split("\.")
        let extension = archivo_split[1]
        // comprobar extensión correcta
        if(extension != "png" && extension != "jpg" && 
            extension != "jpeg" && extension != "gif"){
            // Borrar archivo y dar respuesta, extension file system
                fs.unlink(req.file.path, (error) => {
                    return res.status(400).json({
                        status: "error",
                        mensaje: "Imagen no válida"
                    })
                })
        }else{
            // Si todo va bien, actualizar el artículo
             // Recoger id articulo a editar
        let articuloId = req.params.id;
        
        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({_id : articuloId}, {imagen: req.file.filename}, {new: true})
            .then((articuloActualizado) =>{
                if(!articuloActualizado){
                    return res.status(404).json({
                        status: 'error',
                        mensaje: 'El articulo no se ha actualizado'
                    })
                }
                // Devolver respuesta
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado,
                    fichero: req.file
                })
            })
        }
    }
    const imagen = (req, res) =>{
        let fichero = req.params.fichero;
        let ruta_fisica = "./imagenes/articulos/"+fichero;

        fs.stat(ruta_fisica, (error, existe) =>{
            if(existe){
                return res.sendFile(path.resolve(ruta_fisica))
            }else{
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'La imagen no existe',
                    existe,
                    fichero,
                    ruta_fisica
                })
            }
        })
    }
    const buscador = async(req, res) => {
        try{
        // Sacar el string de Busqueda
        let busqueda = req.params.busqueda
        // Find OR
        let busquedaResult = Articulo.find({ "$or" : [
            // Si el titulo incluye("i") el string de busqueda, si titulo incluye la busqueda del usuario
            { "titulo" : { "$regex" : busqueda, "$options": "i" }},
            {"contenido": { "$regex" : busqueda, "$options" : "i"}}
        ]})
        // orden
        let articulosEncontrados = await busquedaResult.sort({fecha: -1}).exec()
        
        // Ejecutar consulta
        if(!articulosEncontrados || articulosEncontrados <= 0){
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                })
        }
            // Devolver Resultado
            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            })
        }catch(error){
            return res.status(500).json({
                status: "error",
                mensaje: "Se ha producido un error al buscar el articulo"
            })
        }
    }


module.exports = {
    prueba,
    probando,
    crear,
    listar, 
    uno,
    borrar,
    editar, 
    subir,
    imagen,
    buscador
}