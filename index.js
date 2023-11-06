//Importar conexion a base de datos
const connection = require("./database/connection")
//Importar dependencias
const express = require("express")
const cors = require("cors")
//Mensaje de bienvenida
console.log("Api Rest con Node para la app de musica arrancada!!")
//Ejecutar conexion a la bd
connection();
//Crear servidor de node
const app = express()
const PORT = 3910
//Configurar cors
app.use(cors())
//Convertir los datos del body a objetos js
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Cargar configuracion de rutas

//Ruta de prueba
app.get("/prueba",(req,res)=>{
    return res.status(200).json({
        message:"Ruta de prueba funcionando"
    })
})
//Poner el servidor a escuchar peticiones http
app.listen(PORT,()=>{
    console.log("El servidor de node esta escuchando en el puerto:"+PORT)
})