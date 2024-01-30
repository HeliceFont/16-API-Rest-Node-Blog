const { conection } = require("./database/conection");
const express = require("express");
const cors = require("cors");

// inicializar App
console.log("App de node arrancada")

// conectar base de datos
conection();

// Crear Servidor Node
const app = express();
const puerto = 3900;

// configurar cors
app.use(cors())

// convertir body en objeto JS
// nos libramos de parsearlos luego
app.use(express.json()) // recibir datos con content-type app/json
// decodifica los datos que llegan en un urlendcoded y lo podemos parsear a un json
app.use(express.urlencoded({extended: true}))

//Rutas 
const rutas_articulo = require("./rutas/articulo");

// Cargar rutas
app.use("/api", rutas_articulo)


// Rutas de prueba hardcodeada

app.get("/", (req, res) => {


    return res.status(200).send( 
        "<h1>Empezando a crear un api con node</h1>"
    )
})


// crear servidor y escuchar peticiones http
app.listen(puerto, ()=>{
    console.log("servidor corriendo en el puerto" + puerto)
})