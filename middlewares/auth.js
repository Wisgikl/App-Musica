//Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");
//Importar clave secreta
const { secret } = require("../helpers/jwt");
//Crear middleware
exports.auth = (req, res, next) => {
  //Comprobar si me llega la authorization
  if(!req.headers.authorization) return res.status(403).json({message:"La peticion no tiene la cabecera de autenticacion"})
  //Limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, "")
  try{
    //Decodificar token
  let payload = jwt.decode(token, secret)

  //Comprobar la expiracion del token
  if(payload.exp <= moment().unix()){
    return res.status(401).send({message: 'El token ha expirado'})
  }
  //Agregar datos del user a la request
  req.user = payload
  }catch(error){
    return res.status(401).send({message: "Token no valido"})
  }
  //Pasar a la ejecucion de la accion
  next()
};
