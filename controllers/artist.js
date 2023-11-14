//Importaciones
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");
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
    const artistId = req.params.id;

    // Buscar y eliminar álbumes relacionados al artista
    const albumsToDelete = await Album.find({ artist: artistId });

    for (const album of albumsToDelete) {
      // Eliminar canciones asociadas al álbum
      await Song.deleteMany({ album: album._id });
      // Eliminar el álbum
      await Album.findByIdAndDelete(album._id);
    }

    // Eliminar al artista
    const artistDelete = await Artist.findByIdAndDelete(artistId);

    if (!artistDelete) {
      return res.status(404).json({ message: "No se encontro el artista" });
    }

    return res.status(200).json({
      message: "Artista y sus álbumes eliminados",
      artist: artistDelete,
      albumsDeleted: albumsToDelete,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al borrar el artista...",
      error: console.log(error),
    });
  }
};
const upload = async (req, res) => {
  try {
    //Recoger artistId
    let artistId = req.params.id;
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
    const artistUpdated = await Artist.findOneAndUpdate(
      { _id: artistId },
      { image: req.file.filename },
      { new: true }
    );
    //Devolver rst
    return res.status(200).json({
      message: "Metodo para subir imagen",
      file: req.file,
      artistUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al subir imagen",
    });
  }
};
const image = async (req, res) => {
  try {
    //Sacar parametro de la url
    const file = req.params.file;
    //Sacar el path real de la imagen
    const filePath = "./uploads/artists/" + file;
    //Comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {
      if (!exists)
        return res.status(404).send({ message: "El archivo no existe" });
    });
    //Devolver un file
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al mostrar la imagen",
    });
  }
};
//Importar acciones
module.exports = {
  prueba,
  save,
  singleArtist,
  list,
  edit,
  deletes,
  upload,
  image,
};
