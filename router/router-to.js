const router = require("express").Router();
const controller = require("../controller/TO");
const middlewareAuth = require("../middleware/auth");

router.get("/all", controller.getTo);
router.get("/detail/:id", controller.getDetailTo);
router.post("/upload", controller.uploadTo);
router.delete("/delete/:id", controller.deleteTo);

module.exports = router;
