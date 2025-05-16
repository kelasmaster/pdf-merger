let allFiles = [];

// Trigger hidden file input
document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("pdfInput").click();
});

// Handle file selection and append to list
document.getElementById("pdfInput").addEventListener("change", () => {
  const files = Array.from(document.getElementById("pdfInput").files);

  // Filter only PDFs
  const pdfFiles = files.filter(file => file.type === "application/pdf");

  // Append to global list
  allFiles = [...allFiles, ...pdfFiles];

  updateFileList();
  document.getElementById("pdfInput").value = ""; // Reset input to allow same file re-selection
});

// Update UI with selected files
function updateFileList() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (allFiles.length === 0) {
    fileList.innerHTML = "<li>No files selected</li>";
    return;
  }

  allFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    fileList.appendChild(li);
  });
}

// Merge button logic
document.getElementById("mergeBtn").addEventListener("click", async () => {
  if (allFiles.length < 2) {
    alert("Please select at least 2 PDF files.");
    return;
  }

  document.getElementById("status").textContent = "Merging PDFs...";

  const { PDFDocument } = window.pdfLib;

  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
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
