import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">QR Code Generator</div>
        <div>
          <Link
            to="/"
            className="text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            Single QR
          </Link>
          <Link
            to="/multiple"
            className="text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            Multiple QR
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
