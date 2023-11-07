const validator = require("validator");

const validate = (params) => {
  const errors = {};

  if (!params.name) {
    errors.name = "El nombre es un campo requerido";
  } else if (
    !validator.isLength(params.name, { min: 3, max: 15 }) ||
    !validator.isAlpha(params.name, "es-ES")
  ) {
    errors.name =
      "El nombre debe tener entre 3 y 15 caracteres y contener solo letras";
  }

  if (!params.nick) {
    errors.nick = "El apodo (nick) es un campo requerido";
  } else if (
    !validator.isLength(params.nick, { min: 3, max: 15 }) ||
    !validator.matches(params.nick, /^[a-zA-Z0-9]+$/)
  ) {
    errors.nick = "El apodo (nick) debe tener entre 3 y 15 caracteres y solo puede contener letras y números";
  }

  if (!params.email) {
    errors.email = "El correo electrónico es un campo requerido";
  } else if (!validator.isEmail(params.email)) {
    errors.email = "El correo electrónico no es válido";
  }

  if (!params.password) {
    errors.password = "La contraseña es un campo requerido";
  } else if (!validator.isLength(params.password, { min: 8, max: undefined })) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  }

  if (!params.surname) {
    errors.surname = "El apellido es un campo requerido";
  } else if (
    !validator.isLength(params.surname, { min: 3, max: undefined })
  ) {
    errors.surname = "El apellido debe tener al menos 3 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    // Devolver el objeto de errores si hay campos inválidos
    return { errors };
  } else {
    console.log("Validación superada");
    return null; // No hay errores, devolver null
  }
};
module.exports=validate