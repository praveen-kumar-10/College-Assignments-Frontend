import React from "react";

import { FileUploader } from "react-drag-drop-files";

import "./Upload.scss";

const Upload = ({ handleChange, fileTypes, file, multiple = false, name }) => {
  return (
    <div className="upload-wrapper">
      <div className="file_upload__wrapper">
        <FileUploader
          multiple={multiple}
          handleChange={handleChange}
          name={name}
          types={fileTypes}
          required
        />
      </div>
      <p className="file__name">
        {file ? `File name: ${file.name}` : "No Files Uploaded Yet"}
      </p>
    </div>
  );
};

export default Upload;
