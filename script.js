document.getElementById("mergeBtn").addEventListener("click", async () => {
  const input = document.getElementById("pdfInput");
  const files = input.files;

  // Enforce minimum of 2 files
  if (files.length < 2) {
    alert("Please select at least 2 PDF files.");
    return;
  }

  document.getElementById("status").textContent = "Merging PDFs...";

  const { PDFDocument } = window.pdfLib;

  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const uint8Array = await mergedPdf.save();

  // Generate random number
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const filename = `mergedpdf-${randNum}.pdf`;

  download(uint8Array, filename, "application/pdf");

  document.getElementById("status").textContent = "Merge complete!";
});

// Helper function to download blob
function download(bytes, filename, mimeType) {
  const blob = new Blob([bytes], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
