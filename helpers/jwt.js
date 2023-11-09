//importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");
//clave secreta
const secret = "CLAVE_SECRETA_de_mi_PROYECTO_de_la_APP_Musical_9954772";
//Crear funcion para generar tokens
const createToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    image: user.image,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };
  //devolver token
  return jwt.encode(payload, secret);
};

//exportar modulo
module.exports = {
  secret,
  createToken,
};
