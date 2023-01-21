const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Ok");
});

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

module.exports = router;
