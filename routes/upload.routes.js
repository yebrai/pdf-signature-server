const multer = require('multer')
const router = require("express").Router();
//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `/${file.originalname}`);
  },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Envia sólo archivos PDF"), false);
  }
};
//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const fs = require("fs");
const path = require("path")

const pdfArr = []
router.post("/", upload.any(), (req, res) => {
  // const files = req.files;
  
  // for (let i = 0; i < files.file.length; i++) {
  //   // Procesar archivo (ej: guardar en base de datos, mover a una carpeta)
  //   console.log(files.file)
  //   pdfArr.push(files.file)
  // }
  
  res.status(200).json({message:"files saved"});
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
            readFiles.push({ fileName: file, url: `/uploads/${file}` });
            if (readFiles.length === files.length) {
              // Enviar la lista de archivos al cliente
              //console.log(readFiles);
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
  // const files = req.files;
  //console.log("pdfId", pdfId, "path", path, "dirname", __dirname, "porba", path.join(__dirname, ".." , "uploads"))

      res.download(pdfId, {root: path.join(__dirname, ".." , "uploads")}) //, {root: path.join(__dirname, ".." , "uploads")})

        // fs.readFile(`uploads/${pdfId}`, (err, data) => { 
        //   if (err) {
        //     res.status(500).send("Error al leer el archivo");
        //   } else {
            
        //       console.log("data", data);
        //       res.status(200).json(data);
            
        //   }
        // })


  // for (let i = 0; i < files.file.length; i++) {
  //   // Procesar archivo (ej: guardar en base de datos, mover a una carpeta)
  //   console.log(files.file)
  //   pdfArr.push(files.file)
  // }
  
  // res.status(200).json(pdfArr);
});


module.exports = router;