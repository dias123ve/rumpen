const router = require("express").Router();
const controller = require("../controller/program");
const middlewareAuth = require("../middleware/auth");

router.get("/get", controller.getAllProgram);
router.get("/detail/:id", controller.getDetailProgram);
router.post("/upload", middlewareAuth, controller.uploadProgram);
router.delete("/delete/:id", middlewareAuth, controller.delete);

module.exports = router;
