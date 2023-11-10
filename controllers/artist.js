//Importaciones
const Artist = require("../models/artist");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const prueba = async (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/artist.js",
  });
};
//Accion guardar artista
const save = async (req, res) => {
  try {
    //Recoger datos del body
    const params = req.body;
    //Crear objeto a guardar
    let artist = new Artist(params);
    //Guardarlo
    const artistStored = await artist.save();
    //Devolver una respusta
    return res.status(200).json({
      message: "Artista creado",
      Artist: artistStored,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al guardar un artista",
    });
  }
};
const singleArtist = async (req, res) => {
  try {
    //Sacar parametro por url
    const artistId = req.params.id;
    //Find
    const artistFound = await Artist.findById(artistId);
    if (!artistFound)
      return res.status(400).json({ message: "El artista no existe" });
    return res.status(200).json({
      message: "Obtener un artista",
      Artist: artistFound,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el artista",
    });
  }
};
const list = async (req, res) => {
  try {
    //Sacar la pagina
    let page = 1;
    if (req.params.page) page = req.params.page;
    //Definir cuantos elem por pag
    const elemPerPage = 5;
    //Find ordenarlo y paginarlo
    const listArtist = await Artist.find()
      .sort("nick")
      .paginate(page, elemPerPage);
    const totalArtist = await Artist.countDocuments();
    return res.status(200).json({
      message: "Listado de artistas",
      listArtist,
      Total: totalArtist,
      Paginas: Math.ceil(totalArtist / elemPerPage),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error para obtener los artistas",
    });
  }
};
const edit = async (req, res) => {
  try {
    //Recoger id artista url
    const artistId = req.params.id;
    //Recoger datos del body
    const data = req.body;
    //Buscar y actualizar artista
    const artistUpdate = await Artist.findByIdAndUpdate(artistId, data, {
      new: true,
    });
    return res.status(200).json({
      message: "Artista actualizado",
      artist: artistUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error para actualizar el artista",
    });
  }
};
const deletes = async (req, res) => {
  try {
    //Sacar id del artista
    const artistId = req.params.id;
    //Hacer un find
    const artistDelete = await Artist.findByIdAndDelete(artistId, {
      new: true,
    });
    if (!artistDelete)
      return res.status(404).json({ message: "No se encontro el artista" });
    //Devolver respuesta
    return res.status(200).json({
      message: "Artista eliminado",
      artist: artistDelete,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al borrar el artista...",
    });
  }
};
const upload = async (req, res) => {
  try {
    //Conseguir el name del archivo
    let image = req.file.filename;
    //Sacar extension del archivo
    const imageSplit = image.split(".");
    const imageExtension = imageSplit([1]);
    //Comprobar extension
    if (
      imageExtension != "jpg" &&
      imageExtension != "jpeg" &&
      imageExtension != "png" &&
      imageExtension != "gif"
    ) {
      //Si no es correcta, Borrar archivo subido
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);
      return res.status(304).send({ message: "Formato de imagen invalida" });
    }
    //Si es correcta guardar en la bd
    const userUpdated = await Artist.findByIdAndUpdate(
      { _id: req.artist.id },
      { image: req.file.filename },
      { new: true }
    );
    //Devolver
    return res.status(202).json({
      message: "Imagen subida",
      userUpdated
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al subir el archivo",
    });
  }
};
const image = async (req,res)=>{
  try {
    //Sacar parametro de la url
    const file = req.params.file
    //Sacar el path real de la imagen
    const filePath = ".uploads/artists/"+file
    //Comprobar que existe el fichero
    fs.stat(filePath,(error,exists)=>{
      if(!exists){
        return res.status(404).send({message:"El archivo no existe"})
      }
    })
    //Devolver un file
    return res.sendFile(path.resolve(filePath))
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al mostrar la imagen",
    });
  }
}
//Importar acciones
module.exports = {
  prueba,
  save,
  singleArtist,
  list,
  edit,
  deletes,
  upload,
  image
};
