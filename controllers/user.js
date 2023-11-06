//accion de prueba
const prueba = (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/user.js",
  });
};


//Registro
const register = async(req,res)=>{
    try {
        //Recoger datos de la peticion
        const params = req.body
        //Comprobar que llegan
        if(!params.name || !params.surname || !params.nick || !params.password || !params.email){ 
         return res.status(404).json({message:"Faltan datos por enviar"})
        }
        //Validar los datos

        //Control users duplicados

        //Cifrar la contraseña

        //Crear objeto del user

        //Guardar user en la bd

        //Limpiar el objeto a devolver

        //Devolver resultado
        return res.status(200).json({
            message:"Usuario registrado correctamente"
        })
    } catch (error) {
        return res.status(400).json({
            error:'Error al registrar el usuario'
        })
    }
}
//Importar acciones
module.exports = {
    prueba,
    register
};
