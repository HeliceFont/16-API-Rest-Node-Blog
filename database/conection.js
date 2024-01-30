const mongoose = require("mongoose");

// Metodo que nos permite conectarnos
const conection = async()=>{

    try{
        // ()url de conexión
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog")

        console.log("Conectado Correctamente a la base de dato mi_blog")

    }catch(error){
        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}

module.exports={
    conection
}