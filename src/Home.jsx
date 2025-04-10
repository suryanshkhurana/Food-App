import React, { useState } from "react";
import Product from "./Product";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
        <h1 className="text-center text-3xl font-bold my-4">Our Products</h1>

    <div className="flex justify-center">
      <Product searchTerm={searchTerm} />
    </div>
    </>
  );
}
