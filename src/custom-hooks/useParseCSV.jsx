import React, { useState } from "react";
import Papa from "papaparse";

export const useParseCSV = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => setFile(file);

  const handleParse = () => {
    if (!file) return setError("Enter a valid file");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData({ headers: columns, data: parsedData });
    };
    reader.readAsText(file);
  };


  return [file, data, error, handleFileChange, handleParse];
};
