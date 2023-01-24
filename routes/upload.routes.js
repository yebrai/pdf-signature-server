const multer = require('multer')
const router = require("express").Router();
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");

const pdfArr = []
router.post("/", upload.fields([{ name: "file", maxCount: Infinity }]), (req, res) => {
  const files = req.files;
  
  for (let i = 0; i < files.file.length; i++) {
    // Procesar archivo (ej: guardar en base de datos, mover a una carpeta)
    console.log(files.file)
    pdfArr.push(files.file)
  }
  
  res.status(200).json(pdfArr);
});

router.get("/files", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) {
      res.status(500).send("Error al obtener los archivos");
    } else {
      const readFiles = []
      files.forEach((file) => {
        fs.readFile(`uploads/${file}`, (err, data) => { 
          if (err) {
            res.status(500).send("Error al leer el archivo");
          } else {
            readFiles.push({ fileName: file, data, url: `/uploads/${file}` });
            if (readFiles.length === files.length) {
              // Enviar la lista de archivos al cliente
              console.log(readFiles);
              res.status(200).json(readFiles)
            }
          }
        })
      })
    }
  });
});

router.get("/download/:pdfId", (req, res) => {
  const {pdfId} = req.params
  const files = req.files;
  console.log(pdfId)
  for (let i = 0; i < files.file.length; i++) {
    // Procesar archivo (ej: guardar en base de datos, mover a una carpeta)
    console.log(files.file)
    pdfArr.push(files.file)
  }
  
  res.status(200).json(pdfArr);
});


module.exports = router;