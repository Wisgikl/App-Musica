//Importar dependencias
const express = require("express")
const check = require("../middlewares/auth")
//Cargar router
const router = express.Router();
//Importar controlador
const ArtistController = require("../controllers/artist")
//Configuracion de subida
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null,"./uploads/artists/")
    },
    filename:(req,file,cb)=>{
        cb(null,"artist-"+Date.now()+"-"+file.originalname)
    }
})
const uploads = multer({storage})
//Definir rutas
router.get("/prueba",ArtistController.prueba)
router.post("/save",check.auth,ArtistController.save)
router.get("/single/:id",check.auth,ArtistController.singleArtist)
router.get("/list/:page?",check.auth,ArtistController.list)
router.put("/update/:id",check.auth,ArtistController.edit)
router.delete("/delete/:id",check.auth,ArtistController.deletes)
router.post("/upload/:id",[check.auth,uploads.single("archivo")],ArtistController.upload)
router.get("/image/:file",ArtistController.image)
//Exportar router
module.exports = router