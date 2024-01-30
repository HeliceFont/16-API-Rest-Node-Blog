
const { Schema, model } = require("mongoose")


const ArticleSchema = Schema ({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
})

//nombre del modelo entre comillas
module.exports = model("Articulo", ArticleSchema, "articulos");
                                                // nombre de la coleccion en MongoDB
