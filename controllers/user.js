//Importaciones
const validate = require("../helpers/validate")

//accion de prueba
const prueba = (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/user.js",
  });
};


//Registro
const register = async(req,res)=>{
    const params = req.body
    try {
        //Recoger datos de la peticion
        //Comprobar que llegan
        
        //Validar los datos
        
        const validationErrors= await validate(params)
        if(validationErrors){
            return res.status(400).json({validationErrors})
        }
        //Control users duplicados

        //Cifrar la contraseña

        //Crear objeto del user

        //Guardar user en la bd

        //Limpiar el objeto a devolver

        //Devolver resultado
        return res.status(200).json({
            message:"Usuario registrado correctamente",
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
