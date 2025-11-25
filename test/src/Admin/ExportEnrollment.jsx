import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

// ============================================================
// 🔹 REUSABLE FUNCTION FOR AUTO-DOWNLOAD PDF
// ============================================================
export async function generateEnrollmentPDF(enrollment) {
  const bgUrl = "/Assets/enrollment_form.png";
  const bgBytes = await fetch(bgUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([580, 842]);

  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontSize = 12;

  const idText = `Enrollment ID: ${String(enrollment.id || "")}`;
  const idX = 73;
  const idY = 230 - 100; 
  const subText = "(Save this ID for future reference)";
  const idWidth = fontItalic.widthOfTextAtSize(idText, 9);
  const subWidth = fontItalic.widthOfTextAtSize(subText, 9);
  const subX = idX + (idWidth / 2) - (subWidth / 2)+30;
  const lineHeight = 12; 

  const bgImage = await pdfDoc.embedPng(bgBytes);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width: 580,
    height: 842,
  });

  const val = (data, placeholder) => (data && data !== "" ? data : placeholder);

  const computeAge = (dob) => {
    if (!dob) return "{Age}";
    const b = new Date(dob);
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const md = t.getMonth() - b.getMonth();
    if (md < 0 || (md === 0 && t.getDate() < b.getDate())) age--;
    return String(age);
  };

  const amount = enrollment.amount
    ? Number(enrollment.amount.replace(/[^\d.]/g, "")).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "N/A";

  const autoAge = computeAge(enrollment.dob);

  const paymentModeText = {
    "1": "Cash",
    "2": "Card",
    "3": "Gcash",
  };

  const paymentTypeText = {
    "1": "Fully Paid",
    "2": "Installment",
  };

  const draw = (text, x, y) => {
    page.drawText(val(text, text), {
      x,
      y: y - 100,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // ============================================================
    // DRAW ALL FIELDS WITH PLACEHOLDERS
    // ============================================================
    draw(val(enrollment.schoolYear, "2025-2026"), 125, 780);
    draw(val(enrollment.semester, "N/A"), 365, 780);
    draw(val(enrollment.course,"N/A"), 140, 758);
    draw(val(enrollment.yearLevel, "N/A"), 400, 760);
    draw(val(enrollment.lastName, "N/A"), 73, 655);
    draw(val(enrollment.firstName, "N/A"), 73, 620);
    draw(val(enrollment.middleName, "N/A"), 73, 585);
    draw(val(enrollment.dob, "N/A"), 320, 655);
    draw(val(autoAge, "N/A"), 320, 585);
    draw(val(enrollment.sex, "N/A"), 320, 620);
    draw(val(enrollment.email, "N/A"), 205, 538);

    draw(val(enrollment.guardianLastName, "N/A"), 73, 470);
    draw(val(enrollment.guardianFirstName, "N/A"), 73, 435);
    draw(val(enrollment.guardianMiddleName, "N/A"), 73, 400);
    draw(val(enrollment.guardianRelation, "N/A"), 320, 470);
    draw(val(enrollment.guardianContact, "N/A"), 320, 435);
    draw(val(enrollment.guardianEmail, "N/A"), 320, 400);

    draw(val(paymentModeText[enrollment.paymentMode], "N/A"), 73, 332);
    draw(`PHP ${amount}`, 320, 332);
    draw(val(paymentTypeText[enrollment.paymentType], "N/A"), 73, 297);
    draw(val(enrollment.paymentNo, ""), 73, 262);
    page.drawText(idText, {
      x: idX,
      y: idY,
      size: 9,
      font: fontItalic,
      color: rgb(0, 0, 0),
    });
    page.drawText(subText, {
      x: subX,
      y: idY - lineHeight,
      size: 9,
      font: fontItalic,
      color: rgb(0, 0, 0),
    });

  const pdfBytes = await pdfDoc.save();
  saveAs(
    new Blob([pdfBytes], { type: "application/pdf" }),
    `${val(enrollment.lastName, "LastName")}, ${val(
      enrollment.firstName,
      "FirstName"
    )}.pdf`
  );
}

// ============================================================
// 🔹 DEFAULT COMPONENT (BUTTON EXPORT)
// ============================================================
export default function ExportEnrollment({ enrollment }) {
  return (
    <button onClick={() => generateEnrollmentPDF(enrollment)}>
      📄 Export Enrollment
    </button>
  );
}
