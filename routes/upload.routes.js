const multer = require('multer')
const router = require("express").Router();
const upload = multer({ dest: 'uploads/' })

router.post("/", upload.fields([{ name: "file", maxCount: Infinity }]), (req, res) => {
  const files = req.files;
  for (let i = 0; i < files.file.length; i++) {
    console.log(files.file);
    // Procesar archivo (ej: guardar en base de datos, mover a una carpeta)
  }
  res.status(200).send("Archivos subidos exitosamente.");
});

module.exports = router;