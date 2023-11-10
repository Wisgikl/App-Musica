//Importar modulos
const Album = require("../models/album")
//Importar dependencias

const prueba = async (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/album.js",
  });
};
const save = async (req,res) =>{
  try {
    //Obtener los datos por body
    const params = req.body
    //Verificar que lleguen
    if(!params){
      return res.status(400).send({message:'No se ha recibido ningun dato'})
    
    }
    //Crear album
    const newAlbum = await new Album(params)
    //Guardarlo en bd
    newAlbum.save()
    return res.status(200).json({
      message: "Album creado con exito",
      newAlbum
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el album",
    });
  }
}
const one = async(req,res)=>{
  try {
    //Obtener por params el id
    const albumId = req.params.id
    //hacer un find y popular info de artista
    const albumFound = await Album.findById(albumId).populate({path:"artist"})
    return res.status(200).json({
      albumFound
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error al mostrar el album",
    });
  }
}
const list = async(req,res)=>{
  //Sacar id del artista por url
  const artistId = req.params.artistId
  //Sacar todos los albums de la bd de un artista

  //popular info del artista y devolver resultado




  try {
    return res.status(200).json({
      message: "Lista de todos los albums:",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al mostrar los albums",
    });
  }
}
//Importar acciones
module.exports = {
    prueba,
    save,
    one,
    list
};
