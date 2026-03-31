import fs from "fs";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";
import { v2 as cloudinary } from "cloudinary";

export const pdfGenerator = async (markdown: string): Promise<string> => {
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const fileName = `report_${Date.now()}.pdf`;
  const filePath = path.join(reportsDir, fileName);

  // ✅ Markdown → HTML
  const htmlContent = marked(markdown);

  // ✅ FULL HTML WITH UTF-8 + STYLING
  const fullHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 40px;
        line-height: 1.7;
        color: #222;
      }

      h1 { font-size: 28px; margin-bottom: 10px; }
      h2 { font-size: 22px; margin-top: 20px; }
      h3 { font-size: 18px; }

      p { margin: 8px 0; }

      ul {
        margin-left: 20px;
        padding-left: 10px;
      }

      li {
        margin-bottom: 6px;
      }

      strong {
        font-weight: bold;
      }

      hr {
        margin: 20px 0;
      }

      code {
        background: #f4f4f4;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
    </style>
  </head>

  <body>
    ${htmlContent}
  </body>
  </html>
  `;

  // 🚀 Launch puppeteer
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // ✅ LOAD HTML
  await page.setContent(fullHtml, {
    waitUntil: "networkidle0",
  });

  // ✅ GENERATE PDF
  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  // ☁️ Upload to Cloudinary
  let result;
  try {
    result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "autonomix-reports",
    });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  return result.secure_url;
};
