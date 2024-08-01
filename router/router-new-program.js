const controllerNewProgram = require("../controller/newProgram");
const router = require("express").Router();

router.get("/list", controllerNewProgram.getAllNewProgram);
router.get("/detail/:id", controllerNewProgram.getDetailProgram);
router.get("/generate-pdf", controllerNewProgram.downloadPdf);
router.post("/upload", controllerNewProgram.uploadProgram);
router.delete("/delete/:id", controllerNewProgram.deleteProgram);

module.exports = router;
