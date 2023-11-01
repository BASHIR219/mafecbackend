const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

async function modifyPdf(user) {
    if (!user) {
        throw new Error('Invalid user object(modified). Name and registration number are required.');
    }

    const username = user.firstName;
    const userregistration = user.registrationNumber;
    console.log(username);
    console.log(userregistration);

    const file = './admit-card.pdf';
    const existingPdfBytes = await fs.readFile(file);
    // const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // const page = pdfDoc.getPages()[0];

    // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // const fontSize = 12;
    // const textX = 100;
    // const textY = 500;
    // const lineHeight = 14; // Line height to create space between lines

    // let currentY = textY;

    // // Draw first name
    // page.drawText(user.firstName, { x: 100, y: 200, font, fontSize, color: rgb(0, 0, 0) });
    // currentY -= lineHeight;

    // // Draw last name
    // page.drawText(user.lastName, { x: 200, y: 200, font, fontSize, color: rgb(0, 0, 0) });
    // currentY -= lineHeight;

    // // Draw father's name
    // page.drawText(user.fatherName, { x: 300, y: 200, font, fontSize, color: rgb(0, 0, 0) });
    // currentY -= lineHeight;

    // // Draw registration number
    // page.drawText(user.registrationNumber, { x: 400, y: 200, font, fontSize, color: rgb(0, 0, 0) });
    // currentY -= lineHeight;

    // const modifiedPdfBytes = await pdfDoc.save();
    console.log('Size of modified PDF in bytes:', existingPdfBytes.length);
    return existingPdfBytes;

}

module.exports = modifyPdf;