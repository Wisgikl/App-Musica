//Importar dependencias
const express = require("express")
//Cargar router
const router = express.Router();
//Importar controlador
const AlbumController = require("../controllers/album")
const check = require("../middlewares/auth")
//Definir rutas 
router.get("/prueba-album",AlbumController.prueba)
router.post("/save",check.auth,AlbumController.save)
router.get("/one/:id",check.auth,AlbumController.one)
router.get("/list/:artistId",check.auth,AlbumController.list)
//Exportar router
module.exports = router