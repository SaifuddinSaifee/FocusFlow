export async function exportNotePdf(
  title: string,
  previewElementId: string
): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const element = document.getElementById(previewElementId);
  if (!element) throw new Error("Preview element not found");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: getComputedStyle(document.documentElement)
      .getPropertyValue("--b1") || "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = contentHeight;
  let position = margin;
  let pageNum = 0;

  pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    pageNum++;
    pdf.addPage();
    position = -(pageHeight * pageNum) + margin;
    pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(`${title.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "note"}.pdf`);
}

export function exportNoteHtml(title: string, body: string): void {
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="utf-8"><title>${safeTitle}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.6}h1{margin-bottom:24px}</style></head>\n<body><h1>${safeTitle}</h1>${body}</body>\n</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "note"}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
