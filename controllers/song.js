//Importar modulos
const Song = require("../models/song")
const fs = require("fs")
const path = require("path")
const fileType = require('file-type');
const prueba = async (req, res) => {
  return res.status(200).json({
    message: "Mensaje enviado desde controler/song.js",
  });
};
const save = async(req,res)=>{
  try {
    //Obtener los datos por body
    const params = req.body
    //Metodo para crear cancion
    const newSong = await new Song(params)
    //Metodo save
    newSong.save()
    return res.status(200).json({
      message:"Subida de cancion exitosa...",
      newSong
    })
  } catch (error) {
    return res.status(500).json({
      message:"No se ha podido subir la cancion"
    })
  }
}
const one = async(req,res)=>{
  try {
    //Recoger parametro url
    let songId=req.params.id;

    const songFound = await Song.findById(songId).populate("album")
      if(!songFound) return res.status(404).json({message:"La cancion no fue encontrada"})
    return res.status(200).json({
      message:"Mostrar una canción",
      Cancion:songFound
    })
  } catch (error) {
    return res.status(500).json({
      message:"Error al mostrar la canción"
    })
  }
}
const list = async(req,res)=>{
  try {
    //Recoger id del album
    let albumId = req.params.albumId
    //Hacer consulta
    const songs = await Song.find({album: albumId})
    .populate({
      path:"album",
      populate:{
        path:"artist",
        model:"Artist"
      }
    })
    .sort("track")
    if(!songs) return res.status(404).json({message:"No hay canciones"})
    //Devolver resultado
    return res.status(200).json({
      message:"Mostrar canciones",
      songs
    })
  } catch (error) {
    return res.status(500).json({
      message:"Error al listar las canciones"
    })
  }
}
const update = async(req,res)=>{
  try {
    //parametro  url id de cancion
    let songId = req.params.id
    //datos para guarda
    let data = req.body
    //busqueda y actualizacion
    const songUpdated = await Song.findByIdAndUpdate(songId,data,{new:true})
    return res.status(200).json({
      message:"Actualizar canciones",
      song:songUpdated
    })
  } catch (error) {
    return res.status(500).json({
      message:"Error al actualizar la canción"
    })
  }
}
const remove = async(req,res)=>{
  try {
    // param url id de la cancion
    let songId = req.params.id
    const songDeleted = await Song.findOneAndDelete({_id:songId})
    if(!songDeleted) return res.status(404).json({message:"No se encontro la cancion"})
    return res.status(200).json({
      message:"Canción borrada",
      song:songDeleted
    })
  } catch (error) {
    return res.status(500).json({
      message:"Error al borrar la canción"
    })
  }
}
const upload = async (req, res) => {
  try {
    //Recoger id del album
    const songId = req.params.id;
    const title = req.body.title;
    const album = req.body.album;
    const track = req.body.track;
    const duration = req.body.duration;
    if (!req.file)
      return res.status(404).json({
        message: "La peticion no incluye la imagen",
      });
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      const type = await fileType.fromBuffer(fileBuffer);
  
      if (!type || !['audio/mpeg', 'audio/ogg'].includes(type.mime)) {
        // Tipo de archivo no válido, borrar archivo y devolver error
        fs.unlinkSync(filePath);
        return res.status(304).send({ message: 'Formato de archivo no válido' });
      }
    // Si es correcta guardar en la bd
    const songUpdated = await Song.findOneAndUpdate(
      { _id: songId },
      { file: req.file.filename, title, album, track, duration },
      { new: true }
    );
    //Devolver
    return res.status(202).json({
      message: "Imagen subida",
      file:req.file,
      songUpdated
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrio un error al subir el archivo",
    });
  }
};
const audio = async (req,res)=>{
  try {
    //Sacar parametro de la url
    const file = req.params.file
    //Sacar el path real de la imagen
    const filePath = "./uploads/songs/"+file
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
    one,
    list,
    update,
    remove,
    upload,
    audio
};
