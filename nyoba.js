const fs = require("fs");
const pdfjsLib = require("pdfjs-dist");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

// Read the PDF file
const readPdf = async (filePath) => {
  const file = fs.readFileSync(filePath);
  const data = Uint8Array.from(Buffer.from(file.toString("base64"), "base64"));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  return pdf;
};

// Extract text from the PDF
const extractText = async () => {
  let foundText = null;
  const pdf = await readPdf("./public/test.pdf");
  const numPages = pdf.numPages;
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContentPage = await page.getTextContent();
    textContentPage.items.forEach((item) => {
      //   console.log(item);
      if (item.str.includes("Sarah Hasya AzZahra, S.Hum.Gr")) {
        console.log("cihuy ketemu");
        console.log(item);
        foundText = item;
      }
    });
    if (foundText) break;
  }
  return foundText;
};

const editPdf = async () => {
  const existingPdfBytes = fs.readFileSync("./public/test.pdf");
  const pdfDoc = await PDFDocument.load(existingPdfBytes.toString("base64"));
  const pages = pdfDoc.getPages();
  const data = await extractText();
  console.log(data);

  if (data) {
    const page = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const newText = "Muhammad Nurfisyal Tri Bayyan";
    const fontSize = 10;
    const existingTextWidth = data.width;

    page.drawRectangle({
      x: data.transform[4],
      y: data.transform[5] - 2,
      width: existingTextWidth,
      height: Math.round(data.height) + 2,
      color: rgb(1, 1, 1),
    });

    // Draw new centered text
    page.drawText(newText, {
      x: data.transform[4],
      y: data.transform[5],
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync("./modified_certificate.pdf", pdfBytes);
  } else {
    console.log("Text 'Nama' not found.");
  }
};

editPdf().then(() => console.log("done gak bang?? DONEE"));
