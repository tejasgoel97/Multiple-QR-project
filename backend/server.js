const express = require("express");
const QRCode = require("qrcode");
const sharp = require("sharp");
const TextToSVG = require("text-to-svg");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const archiver = require("archiver");
const PDFDocument = require("pdfkit");
const { v4 } = require("uuid");

const app = express();
const port = 3001;
const upload = multer({ dest: "uploads/" });
const textToSVG = TextToSVG.loadSync();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.post("/generateSingle", upload.single("background"), async (req, res) => {
  try {
    const {
      data,
      prefix,
      width,
      height,
      qrTop,
      qrLeft,
      textOrientation,
      textTop,
      textLeft,
      fontSize,
      qrColor,
      textColor,
      backgroundType,
      backgroundColor,
    } = req.body;
    const backgroundImage = req.file.path;
    let bgQrColor = "#0000";
    if (backgroundType === "color" && backgroundColor) {
      bgQrColor = backgroundColor;
    } else if (backgroundType === "white") {
      bgQrColor = "#FFFFFF";
    }
    // Generate QR Code with specified width, height, and color
    let qrData = data;
    if (prefix) {
      qrData = prefix + data;
    }
    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      color: {
        dark: qrColor,
        light: bgQrColor,
      },
      width: parseInt(width) || 150,
      margin: 1,
    });

    // Load the background image
    const background = sharp(backgroundImage);

    // Get metadata of the background image to position the QR code and text
    const metadata = await background.metadata();

    // Generate SVG text
    let svgText = textToSVG.getSVG(data, {
      x: 0,
      y: 0,
      fontSize: fontSize,
      anchor: "top",
      attributes: { fill: textColor },
    });
    console.log(fontSize);
    // If text orientation is vertical, modify the SVG to rotate the text
    if (textOrientation === "vertical") {
      svgText = svgText.replace("<text ", '<text transform="rotate(90)" ');
    }

    // Get width of the generated text to center it if positions are not specified
    const textSVGWidth = textToSVG.getMetrics(data, {
      fontSize: parseInt(fontSize),
    }).width;

    // Calculate text top and left positions
    const textTopPosition =
      parseInt(textTop) || parseInt(qrTop) + parseInt(height) + 10;
    const textLeftPosition =
      parseInt(textLeft) || Math.round(metadata.width / 2 - textSVGWidth / 2);

    // Composite the QR code and text onto the background image
    const finalImage = await background
      .composite([
        {
          input: qrCodeBuffer,
          top: parseInt(qrTop) || Math.round(metadata.height / 2 - height / 2),
          left: parseInt(qrLeft) || Math.round(metadata.width / 2 - width / 2),
        },
        {
          input: Buffer.from(svgText),
          top: textTopPosition, // Adjust the text position accordingly
          left: textLeftPosition,
        },
      ])
      .toBuffer();

    // Send the generated image as response
    res.set("Content-Type", "image/png");
    return res.send(finalImage);

    // Cleanup uploaded background image
    fs.unlinkSync(backgroundImage);
  } catch (error) {
    console.error("Error generating QR code and text:", error);
    res.status(500).send("Error generating QR code and text");
  }
});

app.post("/generateMultiple", upload.single("background"), async (req, res) => {
  try {
    const {
      numberInZip,
      randomLength,
      prefix,
      width,
      height,
      qrTop,
      qrLeft,
      textOrientation,
      textTop,
      textLeft,
      fontSize,
      qrColor,
      textColor,
      backgroundType,
      backgroundColor,
    } = req.body;
    const backgroundImage = req.file.path;

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment("qr_codes.zip");
    archive.pipe(res);
    for (let i = 0; i < numberInZip; i++) {
      let randomV4 = v4().replace(/-/g, "");
      const randomData = randomV4.substring(0, randomLength);
      let bgQrColor = "#0000";
      if (backgroundType === "color" && backgroundColor) {
        bgQrColor = backgroundColor;
      } else if (backgroundType === "white") {
        bgQrColor = "#FFFFFF";
      }
      // Generate QR Code with specified width, height, and color
      let qrData = randomData;
      if (prefix) {
        qrData = prefix + randomData;
      }
      const qrCodeBuffer = await QRCode.toBuffer(qrData, {
        type: "png",
        color: {
          dark: qrColor,
          light: bgQrColor,
        },
        width: parseInt(width) || 150,
        margin: 1,
      });

      // Load the background image
      const background = sharp(backgroundImage);

      // Get metadata of the background image to position the QR code and text
      const metadata = await background.metadata();

      // Generate SVG text
      let svgText = textToSVG.getSVG(randomData, {
        x: 0,
        y: 0,
        fontSize: fontSize,
        anchor: "top",
        attributes: { fill: textColor },
      });
      // If text orientation is vertical, modify the SVG to rotate the text
      if (textOrientation === "vertical") {
        svgText = svgText.replace("<text ", '<text transform="rotate(90)" ');
      }

      // Get width of the generated text to center it if positions are not specified
      const textSVGWidth = textToSVG.getMetrics(randomData, {
        fontSize: parseInt(fontSize),
      }).width;

      // Calculate text top and left positions
      const textTopPosition =
        parseInt(textTop) || parseInt(qrTop) + parseInt(height) + 10;
      const textLeftPosition =
        parseInt(textLeft) || Math.round(metadata.width / 2 - textSVGWidth / 2);

      // Composite the QR code and text onto the background image
      const finalImage = await background
        .composite([
          {
            input: qrCodeBuffer,
            top:
              parseInt(qrTop) || Math.round(metadata.height / 2 - height / 2),
            left:
              parseInt(qrLeft) || Math.round(metadata.width / 2 - width / 2),
          },
          {
            input: Buffer.from(svgText),
            top: textTopPosition, // Adjust the text position accordingly
            left: textLeftPosition,
          },
        ])
        .toBuffer();
      archive.append(finalImage, { name: `${randomData}.png` });
    }

    // Send the generated image as response
    await archive.finalize();

    // Cleanup uploaded background image
    // fs.unlinkSync(backgroundImage);
  } catch (error) {
    console.error("Error generating QR code and text:", error);
    res.status(500).send("Error generating QR code and text");
  }
});

app.post("/generatePages", upload.single("background"), async (req, res) => {
  try {
    let {
      numberInZip,
      randomLength,
      prefix,
      width,
      height,
      qrTop,
      qrLeft,
      textOrientation,
      textTop,
      textLeft,
      fontSize,
      qrColor,
      textColor,
      backgroundType,
      backgroundColor,
      pageWidth,
      pageHeight,
      pageMargin,
      imagesPerRow,
      imagesPerColumn,
      imgGapHor,
      imgGapVer,
      marginLeft,
      marginTop,
      imageWidth,
      imageHeight,
      dpi,
    } = req.body;
    console.log({ dpi });
    console.log(pageHeight, pageWidth, imgGapHor, imgGapVer);
    if (dpi && typeof +dpi === "number") {
      dpi = +dpi;
    } else {
      dpi = 75;
    }
    imageWidth = +imageWidth * dpi || 225;
    imageHeight = +imageHeight * dpi || 300;
    console.log({ dpi });

    pageWidth = +pageWidth * dpi;
    pageHeight = +pageHeight * dpi;
    imgGapHor = +imgGapHor * dpi;
    imgGapVer = +imgGapVer * dpi;
    marginLeft = +marginLeft * dpi;
    marginTop = +marginTop * dpi;
    console.log({
      pageHeight,
      pageWidth,
      imgGapHor,
      imgGapVer,
      marginLeft,
      marginTop,
    });
    let xPosition = marginLeft;
    let yPosition = marginTop;
    const doc = new PDFDocument({
      size: [pageWidth, pageHeight],
      margin: 0,
    });
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="qr_codes_pages.pdf"'
    );
    doc.pipe(res);
    for (let i = 0; i < numberInZip; i++) {
      const backgroundImage = req.file.path;
      let bgQrColor = "#0000";
      if (backgroundType === "color" && backgroundColor) {
        bgQrColor = backgroundColor;
      } else if (backgroundType === "white") {
        bgQrColor = "#FFFFFF";
      }
      // Generate QR Code with specified width, height, and color
      let randomV4 = v4().replace(/-/g, "");
      const randomData = randomV4.substring(0, randomLength);
      let qrData = randomData;
      if (prefix) {
        qrData = prefix + randomData;
      }
      const qrCodeBuffer = await QRCode.toBuffer(qrData, {
        type: "png",
        color: {
          dark: qrColor,
          light: bgQrColor,
        },
        width: parseInt(width) || 150,
        margin: 1,
      });

      // Load the background image
      const background = sharp(backgroundImage);

      // Get metadata of the background image to position the QR code and text
      const metadata = await background.metadata();

      // Generate SVG text
      let svgText = textToSVG.getSVG(randomData, {
        x: 0,
        y: 0,
        fontSize: fontSize,
        anchor: "top",
        attributes: { fill: textColor },
      });

      // Get width of the generated text to center it if positions are not specified
      const textSVGWidth = textToSVG.getMetrics(randomData, {
        fontSize: parseInt(fontSize),
      }).width;

      // Calculate text top and left positions
      const textTopPosition =
        parseInt(textTop) || parseInt(qrTop) + parseInt(height) + 10;
      const textLeftPosition =
        parseInt(textLeft) || Math.round(metadata.width / 2 - textSVGWidth / 2);

      // Composite the QR code and text onto the background image
      const imageBuffer = await background
        .composite([
          {
            input: qrCodeBuffer,
            top:
              parseInt(qrTop) || Math.round(metadata.height / 2 - height / 2),
            left:
              parseInt(qrLeft) || Math.round(metadata.width / 2 - width / 2),
          },
          {
            input: Buffer.from(svgText),
            top: textTopPosition, // Adjust the text position accordingly
            left: textLeftPosition,
          },
        ])
        .toBuffer();
      if (imageBuffer) {
        if (i % imagesPerRow === 0 && i !== 0) {
          // New row after every 3 images
          xPosition = marginLeft;
          yPosition += imageHeight + imgGapVer;
        }

        if (yPosition + imageHeight > pageHeight) {
          // Check if new row exceeds page height
          doc.addPage({ size: [pageWidth, pageHeight], margin: 0 });
          yPosition = marginTop; // Reset y position for the new page
        }

        doc.image(imageBuffer, xPosition, yPosition, {
          width: imageWidth,
          height: imageHeight,
        });
        xPosition += imageWidth + imgGapHor; // Move right by the wid th of the image
      }
    }

    doc.end();
    // if (req.file) fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
