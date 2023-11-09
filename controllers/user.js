//Importaciones
const validate = require("../helpers/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path")
//accion de prueba
const prueba = (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/user.js",
    user: req.user,
  });
};

//Registro
const register = async (req, res) => {
  //Recoger datos de la peticion
  const params = req.body;
  try {
    //Validar los datos
    const validationErrors = await validate(params);
    //Comprobar que llegan
    if (validationErrors) {
      return res.status(400).json({ validationErrors });
    }
    //Control users duplicados
    const users = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toUpperCase().trim() },
      ],
    });
    console.log(users);
    if (users && users.length >= 1) {
      const duplicateFields = [];
      if (users.some((user) => user.email === params.email.toLowerCase())) {
        duplicateFields.push("email");
      }
      if (users.some((user) => user.nick === params.nick.toUpperCase())) {
        duplicateFields.push("nick");
      }
      let message = `Los siguientes campos ya fueron utilizados por un usuario: ${duplicateFields.join(
        ","
      )}`;
      if (duplicateFields.includes("email")) {
        message += ". Por favor, elija otro correo electronico";
      }
      if (duplicateFields.includes("nick")) {
        message += ". Por favor, elija otro apodo (nick)";
      }
      return res.status(400).json({ message });
    }
    //Cifrar la contraseña
    let hash = await bcrypt.hash(params.password, 10);
    params.password = hash;
    //Crear objeto del user
    let userToSave = new User(params);
    //Guardar user en la bd
    const userStored = await userToSave.save();
    if (!userStored)
      return res.status(500).json({ message: "Error al registrar el usuario" });
    //Limpiar el objeto a devolver
    let userCreated = await userStored.toObject();
    delete userCreated.password;
    delete userCreated.role;
    //Devolver resultado
    return res.status(200).json({
      message: "Usuario registrado correctamente",
      user: userCreated,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error al registrar el usuario",
    });
  }
};

const login = async (req, res) => {
  // Recoger los parametros
  let params = req.body;
  // Comprobar si son correctos
  if (!params.email || !params.password)
    return res.status(400).json({ error: "Faltan campos por completar" });

  // Buscar en la bd si existe el email
  const user = await User.findOne({ email: params.email });
  if (!user) return res.status(400).json({ error: "El usuario no existe" });

  // Comprobar su contraseña
  if (!user.password) {
    return res
      .status(400)
      .json({ error: "No se encontró la contraseña del usuario" });
  }
  const passwordMatch = await bcrypt.compare(params.password, user.password);

  if (!passwordMatch)
    return res.status(400).json({ error: "Login incorrecto" });
  //limpiar objetos
  let identityUser = user.toObject();
  delete identityUser.password;
  delete identityUser.role;
  // Conseguir token JWT (crear un servicio que nos permita crear el token)
  const token = await jwt.createToken(user);
  // Devolver datos user y token
  return res.status(200).json({
    message: "Método de login funcionando",
    user: identityUser,
    token,
  });
};
const profile = async (req, res) => {
  //Recoger id user
  const id = req.params.id;
  try {
    //Consulta para sacar datos del perfil
    const user = await User.findById(id).select("-password -role");
    if (!user) return res.status(404).json({ message: "El usuario no existe" });
    //devolver resultado
    return res.status(200).json({
      message: "Metodo profile funcionando",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al obtener el perfil",
    });
  }
};

const update = async (req, res) => {
  try {
    //Recoger datos usuario identificado
    let userIdentity = req.user;
    //Recoger datos a actualizar
    let userToUpdate = req.body;
    //Validar los datos
    const validationErrors = await validate(userToUpdate);
    //Comprobar que llegan
    if (validationErrors) {
      return res.status(400).json({ validationErrors });
    }
    //Comprobar si el user existe
    const users = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toUpperCase() },
      ],
    });
    //Si existe y no soy yo(el identificado)
    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) userIsset = true;
    });
    //Si ya existe devuelvo una respuesta
    if (userIsset) {
      return res.status(404).json({
        message: "El usuario ya existe",
      });
    }
    //Cifrar password si me llega
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    } else {
      delete userToUpdate.password;
    }
    //Buscar usuario en la bd y actualizar
    let userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentity.id },
      userToUpdate,
      { new: true }
    );
    //Devolver respuesta
    return res.status(200).json({
      message: "Actualizacion exitosa",
      userUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar",
    });
  }
};
const upload = async (req, res) => {
  try {
    //Configuracion de subida(multer)

    //Recoger fichero de imagen
    if (!req.file)
      return res.status(404).json({
        message: "La peticion no incluye la imagen",
      });
    //Conseguir nombre del archivo
    let image = req.file.originalname;
    //Sacar info del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[1];
    //Comprobar si la extension es valida
    if (
      extension != "jpg" &&
      extension != "png" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      //Borrar archivo
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);
      //Devolver error
      return res.status(400).json({ message: "La extension no es compatible" });
    }
    //Si es correcto, guardar en la bd
    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: req.file.filename },
      { new: true }
    );
    //Devolver rst
    return res.status(200).json({
      message: "Metodo para subir imagen",
      file: req.file,
      userUpdated, 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al subir imagen",
    });
  }
};

const avatar = async(req,res)=>{
  try {
  //Sacar parametro de url
    const file = req.params.file
    //Sacar el path real de la imagen
    const filePath = "./uploads/avatars/"+file
    //Comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {
      if (!exists)
        return res.status(404).json({ message: "El archivo no existe" });
  
      //Devolver un file
      return res.sendFile(path.resolve(filePath));
      //^ Es un metodo para enviar archivos
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error mostrando imagen'
    })
  }
}
//Importar acciones
module.exports = {
  prueba,
  register,
  login,
  profile,
  update,
  upload,
  avatar
};
