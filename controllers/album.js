//Importar modulos
const Album = require("../models/album")
const Song = require("../models/song")
//Importar dependencias
const fs = require("fs")
const path = require("path")
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
  const albums = await Album.find({artist:artistId}).populate("artist")
  if(!albums) return res.status(404).json({message:"No se han encontrado albums"})
  //popular info del artista y devolver resultado

  try {
    return res.status(200).json({
      message: "Lista de todos los albums:",
      albums
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al mostrar los albums",
    });
  }
}
const update = async(req,res)=>{
  try {
    //Recoger parametro por url
    const albumId = req.params.albumId
    //Recoger el body
    const data = req.body
    //Find y update
    const updated = await Album.findByIdAndUpdate(albumId,data,{new:true})
    if(!updated) return res.status(404).json({message:"No se ha encontrado el album"})
    return res.status(200).json({
      message: "Modificar un album",
      album:updated
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar un album",
    });
  }
}
const upload = async (req, res) => {
  try {
    //Recoger id del album
    let albumId = req.params.id;
    if (!req.file)
      return res.status(404).json({
        message: "La peticion no incluye la imagen",
      });
    //Conseguir el name del archivo
    let image = req.file.originalname;
    //Sacar extension del archivo
    const imageSplit = image.split(".");
    const imageExtension = imageSplit[1];
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
    const albumUpdated = await Album.findOneAndUpdate(
      { _id: albumId },
      { image: req.file.filename },
      { new: true }
    );
    //Devolver
    return res.status(202).json({
      message: "Imagen subida",
      file:req.file,
      albumUpdated
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
    const filePath = "./uploads/albums/"+file
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
const deletes = async (req, res) => {
  try {
    const albumId = req.params.id;

    // Eliminar el álbum por su ID
    const albumsToDelete = await Album.deleteOne({ _id: albumId });

    // Eliminar canciones relacionadas al álbum
    const songsRemoved = await Song.deleteMany({ album: albumId });

    if (albumsToDelete.deletedCount === 0) {
      return res.status(404).json({ message: "No se encontró el álbum" });
    }

    return res.status(200).json({
      message: "Álbum borrado",
      albumsToDelete,
      songsRemoved,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocurrió un error al borrar el álbum...",
      error: error.message,
    });
  }
};
//Importar acciones
module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    upload,
    image,
    deletes
};
