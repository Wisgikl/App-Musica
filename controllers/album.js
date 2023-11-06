const prueba = async (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/album.js",
  });
};

//Importar acciones
module.exports = {
    prueba,
};
