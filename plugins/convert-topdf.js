const { cmd } = require("../command");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { Readable } = require("stream");

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

    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();

    // Convert the buffer to a readable stream
    const pdfStream = Readable.from(pdfBytes);

    // Send the PDF as a document
    await conn.sendMessage(from, {
      document: pdfStream, // Send the PDF as a stream
      mimetype: "application/pdf",
      fileName: "text.pdf",
      caption: "📄 *Text to PDF*\n\nHere's your PDF file!",
    }, { quoted: mek });

  } catch (error) {
    console.error("Error generating PDF:", error);
    reply("❌ Unable to generate the PDF. Please try again.");
  }
});
