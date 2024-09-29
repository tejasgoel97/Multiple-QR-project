import React, { useState } from "react";
import QRForm from "../components/QRForm";

function SingleQRPage() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [data, setData] = useState("");
  const [prefix, setPrefix] = useState("");

  const handleSubmit = async (formData) => {
    const {
      data,
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
    body.append("data", data);
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
      // const blob = await response.blob();
      // const zipURL = URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = zipURL;
      // link.download = "qr_codes.zip";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setGeneratedImage(imageURL);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate a Single QR Code</h2>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-2">
          <QRForm
            onSubmit={handleSubmit}
            data={data}
            setData={setData}
            prefix={prefix}
            setPrefix={setPrefix}
          />
        </div>
        <div className="col-span-2 max-w-auto">
          {generatedImage && (
            <div className="mt-4">
              <h3 className="text-xl font-bold">Generated Image</h3>
              <img
                src={generatedImage}
                alt="Generated QR Code"
                className="mt-2"
              />
              <button
                onClick={handleDownload}
                className="mt-2 bg-blue-500 text-white p-2 rounded"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleQRPage;
