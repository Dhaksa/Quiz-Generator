// FileUpload.js
import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ setFilename }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/upload/", form);
      setFilename(res.data.filename);
      alert("Uploaded: " + res.data.filename);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <h3>Upload Document</h3>
      <input type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUpload;