//Importar dependencias
const express = require("express")
//Cargar router
const router = express.Router();
//Importar controlador
const AlbumController = require("../controllers/album")
const check = require("../middlewares/auth")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null,"./uploads/albums/")
    },
    filename:(req,file,cb)=>{
        cb(null,"album-"+Date.now()+"-"+file.originalname)
    }
})
const uploads = multer({storage})
//Definir rutas 
router.get("/prueba-album",AlbumController.prueba)
router.post("/save",check.auth,AlbumController.save)
router.get("/one/:id",check.auth,AlbumController.one)
router.get("/list/:artistId",check.auth,AlbumController.list)
router.put("/update/:albumId",check.auth,AlbumController.update)
router.post("/upload/:id",[check.auth,uploads.single("archivo")],AlbumController.upload)
router.get("/image/:file",check.auth,AlbumController.image)
router.delete("/delete/:id",check.auth,AlbumController.deletes)
//Exportar router
module.exports = router