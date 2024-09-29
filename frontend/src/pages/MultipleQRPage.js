import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import QRForm from "../components/QRForm";

function MultipleQRPage() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [data, setData] = useState("");
  const [prefix, setPrefix] = useState("");
  const [randomLength, setRandomLength] = useState(4);
  const [numberInZip, setNumberInZip] = useState(1);
  const [formData, setFormData] = useState(null);
  const [sampleGenerated, setSampleGenerated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageHeight, setPageHeight] = useState(29.7); // Default A4 height in cm
  const [pageWidth, setPageWidth] = useState(21.0); // Default A4 width in cm
  const [imgGapHor, setImgGapHor] = useState(1); // Default margin in cm
  const [imgGapVer, setImgGapVer] = useState(1); // Default margin in cm
  const [dpi, setDpi] = useState(75); // Default margin in cm
  const [imagesPerRow, setImagesPerRow] = useState(3);
  const [imagesPerColumn, setImagesPerColumn] = useState(4);
  const [imageWidth, setImageWidth] = useState(5); // Default image width in cm
  const [imageHeight, setImageHeight] = useState(5); // Default image height in cm
  const [marginLeft, setMarginLeft] = useState(1); // Default left margin in cm
  const [marginTop, setMarginTop] = useState(1); // Default top margin in cm
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [formData, randomLength, prefix]);

  const handleSubmit = async () => {
    if (!formData) {
      return;
    }
    const {
      prefix,
      background,
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
    } = formData;
    if (
      !background ||
      !width ||
      !height ||
      !qrTop ||
      !qrLeft ||
      !textTop ||
      !textLeft ||
      !fontSize ||
      !qrColor
    ) {
      return;
    }
    const body = new FormData();
    if (background) {
      body.append("background", background);
    }
    if (+randomLength > 30) {
      window.alert("Length Can't be greater then 20");
      return;
    }
    let randomV4 = v4().replace(/-/g, "");
    const randomData = randomV4.substring(0, randomLength);
    console.log(randomData);
    body.append("data", randomData);
    body.append("prefix", prefix);
    body.append("width", width);
    body.append("height", height);
    body.append("qrTop", qrTop);
    body.append("qrLeft", qrLeft);
    body.append("textOrientation", textOrientation);
    body.append("textTop", textTop);
    body.append("textLeft", textLeft);
    body.append("fontSize", fontSize);
    body.append("qrColor", qrColor);
    body.append("textColor", textColor);
    body.append("backgroundType", backgroundType);
    body.append("backgroundColor", backgroundColor);

    try {
      const response = await fetch("http://localhost:3001/generateSingle", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setGeneratedImage(imageURL);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleDownloadMultiple = async () => {
    if (!formData) return;
    let {
      prefix,
      background,
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
    } = formData;
    if (
      !background ||
      !width ||
      !height ||
      !qrTop ||
      !qrLeft ||
      !textTop ||
      !textLeft ||
      !fontSize ||
      !qrColor
    ) {
      return;
    }
    const body = new FormData();
    if (background) {
      body.append("background", background);
    }
    if (randomLength > 30) {
      window.alert("Length Can't be greater then 20");
      return;
    }
    let randomData = v4().replace(/-/g, "");
    randomData.substring(0, randomLength);
    body.append("data", randomData);
    body.append("prefix", prefix);
    body.append("width", width);
    body.append("height", height);
    body.append("qrTop", qrTop);
    body.append("qrLeft", qrLeft);
    body.append("textOrientation", textOrientation);
    body.append("textTop", textTop);
    body.append("textLeft", textLeft);
    body.append("fontSize", fontSize);
    body.append("qrColor", qrColor);
    body.append("textColor", textColor);
    body.append("backgroundType", backgroundType);
    body.append("backgroundColor", backgroundColor);
    body.append("randomLength", randomLength);
    body.append("numberInZip", numberInZip);

    try {
      const response = await fetch("http://localhost:3001/generateMultiple", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const zipURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = zipURL;
      link.download = "qr_codes.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInPages = () => {
    setIsModalOpen(true);
  };
  const handleModalSubmit = async () => {
    setIsModalOpen(false);
    if (!formData) return;
    const {
      prefix,
      background,
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
    } = formData;
    const body = new FormData();
    if (background) {
      body.append("background", background);
    }
    if (randomLength > 30) {
      window.alert("Length Can't be greater then 20");
      return;
    }
    const randomData = `${Math.random().toString(36).substring(randomLength)}`;
    body.append("data", randomData);
    body.append("prefix", prefix);
    body.append("width", width);
    body.append("height", height);
    body.append("qrTop", qrTop);
    body.append("qrLeft", qrLeft);
    body.append("textOrientation", textOrientation);
    body.append("textTop", textTop);
    body.append("textLeft", textLeft);
    body.append("fontSize", fontSize);
    body.append("qrColor", qrColor);
    body.append("textColor", textColor);
    body.append("backgroundType", backgroundType);
    body.append("backgroundColor", backgroundColor);
    body.append("randomLength", randomLength);
    body.append("numberInZip", numberInZip);
    body.append("pageHeight", pageHeight);
    body.append("pageWidth", pageWidth);
    body.append("imgGapHor", imgGapHor);
    body.append("imgGapVer", imgGapVer);
    body.append("dpi", dpi);
    body.append("imagesPerRow", imagesPerRow);
    body.append("imagesPerColumn", imagesPerColumn);
    body.append("imageWidth", imageWidth);
    body.append("imageHeight", imageHeight);
    body.append("marginLeft", marginLeft);
    body.append("marginTop", marginTop);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/generatePages", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const pdfURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pdfURL;
      link.download = "qr_codes_pages.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating pages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate a Random QR Code</h2>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-2" id="scrollable">
          <div>
            <label className="block text-gray-700">Random Length:</label>
            <input
              type="number"
              value={randomLength}
              onChange={(e) => setRandomLength(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <QRForm
            onSubmit={handleSubmit}
            data={data}
            setData={setData}
            prefix={prefix}
            setPrefix={setPrefix}
            formData={formData}
            setFormData={setFormData}
            setSampleGenerated={setSampleGenerated}
          />
        </div>
        <div className="col-span-2 max-w-auto">
          {generatedImage && (
            <div className="mt-4">
              <h3 className="text-xl font-bold">Generated Image</h3>
              <img
                src={generatedImage}
                alt="Generated QR Code"
                className="mt-2 h-[500px]"
              />
              <div>
                <div>
                  <label className="block text-gray-700">Number Of Qr's:</label>
                  <input
                    type="number"
                    value={numberInZip}
                    onChange={(e) => setNumberInZip(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={handleDownloadMultiple}
                  className="mt-2 bg-blue-500 text-white p-2 rounded"
                >
                  Download Zip Images
                </button>
                <button
                  onClick={handleDownloadInPages}
                  className="mt-2 bg-green-500 text-white p-2 rounded"
                >
                  Download in Pages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg grid grid-cols-2 gap-2">
            <h3 className="text-xl font-bold mb-4">Page Settings</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Page Height (cm):</label>
              <input
                type="number"
                value={pageHeight}
                onChange={(e) => setPageHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Page Width (cm):</label>
              <input
                type="number"
                value={pageWidth}
                onChange={(e) => setPageWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Gap B/w Images: (Horizontal)
              </label>
              <input
                type="number"
                value={imgGapHor}
                onChange={(e) => setImgGapHor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Gap B/wImages: (Vertical)
              </label>
              <input
                type="number"
                value={imgGapVer}
                onChange={(e) => setImgGapVer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">DPI (dots per Inch)</label>
              <input
                type="number"
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Images Per Row:</label>
              <input
                type="number"
                value={imagesPerRow}
                onChange={(e) => setImagesPerRow(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Images Per Column:</label>
              <input
                type="number"
                value={imagesPerColumn}
                onChange={(e) => setImagesPerColumn(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image Width (cm):</label>
              <input
                type="number"
                value={imageWidth}
                onChange={(e) => setImageWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image Height (cm):</label>
              <input
                type="number"
                value={imageHeight}
                onChange={(e) => setImageHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Margin Left (cm):</label>
              <input
                type="number"
                value={marginLeft}
                onChange={(e) => setMarginLeft(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Margin Top (cm):</label>
              <input
                type="number"
                value={marginTop}
                onChange={(e) => setMarginTop(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleModalSubmit}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-2 bg-red-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultipleQRPage;
