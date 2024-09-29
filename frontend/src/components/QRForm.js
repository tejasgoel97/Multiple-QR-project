import React, { useState, useEffect } from "react";

function QRForm(props) {
  const {
    onSubmit,
    data,
    setData,
    prefix,
    setPrefix,
    formData,
    setFormData,
    setSampleGenerated,
  } = props;
  const [background, setBackground] = useState(null);
  const [width, setWidth] = useState(150); // Default to 150 px
  const [height, setHeight] = useState(150); // Default to 150 px
  const [qrTop, setQrTop] = useState(null); // Optional top position
  const [qrLeft, setQrLeft] = useState(null); // Optional left position
  const [textOrientation, setTextOrientation] = useState("horizontal"); // Default to horizontal
  const [textTop, setTextTop] = useState(null); // Optional text top position
  const [textLeft, setTextLeft] = useState(null); // Optional text left position
  const [fontSize, setFontSize] = useState(24); // Default to 24 px
  const [qrColor, setQrColor] = useState("#000000"); // Default to black
  const [textColor, setTextColor] = useState("#000000"); // Default to black
  const [backgroundType, setBackgroundType] = useState("transparent"); // Default to transparent
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Default to white

  useEffect(() => {
    // Load data from localStorage if available
    const savedData = JSON.parse(localStorage.getItem("qrFormData"));
    if (savedData) {
      setPrefix(savedData.prefix || "");
      setData(savedData.data || "");
      setWidth(savedData.width || 150);
      setHeight(savedData.height || 150);
      setQrTop(savedData.qrTop || null);
      setQrLeft(savedData.qrLeft || null);
      setTextOrientation(savedData.textOrientation || "horizontal");
      setTextTop(savedData.textTop || null);
      setTextLeft(savedData.textLeft || null);
      setFontSize(savedData.fontSize || 24);
      setQrColor(savedData.qrColor || "#000000");
      setTextColor(savedData.textColor || "#000000");
      setBackgroundType(savedData.backgroundType || "transparent");
      setBackgroundColor(savedData.backgroundColor || "#ffffff");
    }
  }, []);
  useEffect(() => {
    let body = {};
    if (background) {
      body = { ...body, background };
    }
    body = {
      ...body,
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
    };
    if (!setFormData) return;
    setFormData(body);
    setSampleGenerated(false);
  }, [
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
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      data,
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
      prefix,
    });
  };

  const handleSave = () => {
    const formData = {
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
    };
    localStorage.setItem("qrFormData", JSON.stringify(formData));
    alert("Form data saved!");
  };

  const handleLoad = () => {
    const savedData = JSON.parse(localStorage.getItem("qrFormData"));
    if (savedData) {
      setData(savedData.data || "");
      setPrefix(savedData.prefix || "");
      setWidth(savedData.width || 150);
      setHeight(savedData.height || 150);
      setQrTop(savedData.qrTop || null);
      setQrLeft(savedData.qrLeft || null);
      setTextOrientation(savedData.textOrientation || "horizontal");
      setTextTop(savedData.textTop || null);
      setTextLeft(savedData.textLeft || null);
      setFontSize(savedData.fontSize || 24);
      setQrColor(savedData.qrColor || "#000000");
      setTextColor(savedData.textColor || "#000000");
      setBackgroundType(savedData.backgroundType || "transparent");
      setBackgroundColor(savedData.backgroundColor || "#ffffff");
      alert("Form data loaded!");
    } else {
      alert("No saved data found!");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Prefix:</label>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Data:(Ignore this in Multiple QR)
        </label>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Background Image:</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setBackground(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">QR Code Size (px):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">
          QR Code Top Position (px, optional):
        </label>
        <input
          type="number"
          value={qrTop}
          onChange={(e) => setQrTop(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          QR Code Left Position (px, optional):
        </label>
        <input
          type="number"
          value={qrLeft}
          onChange={(e) => setQrLeft(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">
          Text Top Position (px, optional):
        </label>
        <input
          type="number"
          value={textTop}
          onChange={(e) => setTextTop(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Text Left Position (px, optional):
        </label>
        <input
          type="number"
          value={textLeft}
          onChange={(e) => setTextLeft(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Font Size (px):</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">QR Code Color:</label>
        <input
          type="color"
          value={qrColor}
          onChange={(e) => setQrColor(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-700">Background Type:</label>
          <select
            value={backgroundType}
            onChange={(e) => setBackgroundType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="transparent">Transparent</option>
            <option value="color">Color</option>
            <option value="white">White</option>
          </select>
        </div>
        <div>
          {backgroundType === "color" && (
            <div>
              <label className="block text-gray-700">Background Color:</label>
              <input
                type="color"
                required
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Text Color:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Generate QR Code
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-green-500 text-white p-2 rounded"
        >
          Save Data
        </button>
        <button
          type="button"
          onClick={handleLoad}
          className="bg-yellow-500 text-white p-2 rounded"
        >
          Load Data
        </button>
      </div>
    </form>
  );
}

export default QRForm;
