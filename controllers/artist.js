const prueba = async (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/artist.js",
  });
};

//Importar acciones
module.exports = {
    prueba,
};