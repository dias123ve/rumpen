const TO = require("../model/model-to");
const ExcelJS = require("exceljs");

module.exports = {
  getTo: async (req, res, next) => {
    try {
      const murids = await TO.find();
      return res.status(200).json({ data: murids });
    } catch (error) {
      console.log(error);
    }
  },
  getDetailTo: async (req, res, next) => {
    try {
      const to = await TO.findById(req.params.id);
      return res.status(200).json({ data: to });
    } catch (error) {
      console.log(error);
    }
  },
  deleteTo: async (req, res, next) => {
    try {
      const deleted = await TO.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "Berhasil Menghapus To", data: deleted });
    } catch (error) {
      console.log(error);
    }
  },
  uploadTo: async (req, res, next) => {
    try {
      const { nama } = req.body;
      const { file } = req.files;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.data);
      const worksheet = workbook.worksheets[0];

      const namaColumn = worksheet.getColumn(2);

      const murids = [];

      namaColumn.eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          const nama = cell.value;
          const skor = worksheet.getCell(`C${rowNumber}`).value;
          const ranking = worksheet.getCell(`D${rowNumber}`).value;

          murids.push({
            nama: nama,
            skor: skor,
            ranking: ranking,
          });
        }
      });

      await TO.create({
        nama_to: nama,
        murids,
      });
      res
        .status(200)
        .json({ message: "File processed and data saved successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while processing the file");
    }
  },
};
