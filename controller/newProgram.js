const ExcelJS = require("exceljs");
const NewProgram = require("../model/model-new-program");
const pdfjsLib = require("pdfjs-dist");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const path = require("path");
const fs = require("fs");

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, "binary").toString("base64");
};

module.exports = {
  getAllNewProgram: async (req, res, next) => {
    try {
      const programs = await NewProgram.find().select("nama_program");
      if (programs.length === 0) return res.status(204);
      return res.status(200).json({ data: programs });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getDetailProgram: async (req, res, next) => {
    try {
      const program = await NewProgram.findById(req.params.id).lean();
      if (!program)
        return res.status(404).json({ message: "Program tidak ditemukan" });
      return res.status(200).json({ data: program });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  uploadProgram: async (req, res, next) => {
    try {
      const { nama } = req.body;
      const { file, design } = req.files;
      if (!file)
        return res.status(400).json({ message: "Tolong kirimkan file excel" });
      if (!design)
        return res
          .status(400)
          .json({ message: "Tolong kirimkan templat design dalam format pdf" });
      if (
        path.extname(file.name) !== ".xlsx" ||
        path.extname(design.name) !== ".pdf"
      ) {
        return res
          .status(400)
          .json({ message: "Kirimkan file dalam format xlsx dan pdf" });
      }
      const base64String = arrayBufferToBase64(design.data);
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pdfData = bytes.buffer;
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const numPages = pdf.numPages;
      for (let i = 1; i <= numPages; i++) {
        let foundText = false;
        const page = await pdf.getPage(i);
        const textContentPage = await page.getTextContent();
        textContentPage.items.forEach((item) => {
          if (item.str === "nama") {
            foundText = true;
          }
        });
        if (!foundText)
          return res
            .status(400)
            .json({ message: "Tolong Sediakan Text 'nama' di dalam pdf " });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.data);

      const worksheet = workbook.worksheets[0];

      const rows = worksheet.getRows(2, worksheet.rowCount - 1);
      const participants = [];

      rows.forEach((row) => {
        const intansi = row.getCell(2).value;
        const nama = row.getCell(3).value;
        const participant = {
          nama,
          intansi,
        };

        participants.push(participant);
      });

      if (participants.length === 0) {
        return res
          .status(400)
          .json({ message: "Isi kolom ke dua dalam header nama peserta" });
      }
      const data = await NewProgram.create({
        nama_program: nama,
        peserta: participants,
        template_design: base64String,
      });

      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  downloadPdf: async (req, res, next) => {
    try {
      const { id, nama } = req.query;
      const program = await NewProgram.findById(id);
      const base64String = program.template_design;
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pdfData = bytes.buffer;
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const numPages = pdf.numPages;
      let data;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContentPage = await page.getTextContent();
        textContentPage.items.forEach((item) => {
          if (item.str === "nama") {
            data = item;
          }
        });
      }
      const pdfDoc = await PDFDocument.load(pdfData);
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = fs.readFileSync(
        path.join(__dirname, "../public", "Merriweather-Bold.ttf")
      );
      const customFont = await pdfDoc.embedFont(fontBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];
      const newText = nama.toUpperCase();
      const fontSize = 25;
      const existingTextWidth = data.width;
      const textWidth = customFont.widthOfTextAtSize(newText, fontSize);
      const { width } = page.getSize();
      page.drawRectangle({
        x: data.transform[4],
        y: data.transform[5] - 2,
        width: existingTextWidth,
        height: Math.round(data.height) + 2,
        color: rgb(1, 1, 1),
      });
      page.drawText(newText, {
        x: (width - textWidth) / 2,
        y: data.transform[5],
        size: fontSize,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="generated.pdf"'
      );
      res.setHeader("Content-Type", "application/pdf");

      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteProgram: async (req, res, next) => {
    try {
      await NewProgram.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Berhasil Menghapus Program" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
