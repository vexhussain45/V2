const { cmd } = require("../command");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "texttopdf",
  alias: ["txt2pdf", "makepdf"],
  desc: "Convert text into a PDF file.",
  category: "utility",
  use: ".texttopdf <text>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const text = args.join(" ");
    if (!text) {
      return reply("❌ Please provide text to convert into a PDF. Example: `.texttopdf Hello, World!`");
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Set font and font size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    // Add text to the PDF
    page.drawText(text, {
      x: 50,
      y: 350,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Save the PDF to a file
    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(__dirname, "../temp/text.pdf");
    fs.writeFileSync(filePath, pdfBytes);

    // Send the PDF as a document
    await conn.sendMessage(from, {
      document: { url: `file://${filePath}` },
      mimetype: "application/pdf",
      fileName: "text.pdf",
      caption: "📄 *Text to PDF*\n\nHere's your PDF file!",
    }, { quoted: mek });

    // Delete the temporary file after sending
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error("Error generating PDF:", error);
    reply("❌ Unable to generate the PDF. Please try again.");
  }
});
