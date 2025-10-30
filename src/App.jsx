import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function App() {
  const [status, setStatus] = useState("Glissez un fichier ici pour l’envoyer");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    setStatus("📤 Envoi en cours...");

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus(`✅ ${file.name} envoyé avec succès !`);
      } else {
        const err = await response.json();
        setStatus(`❌ Erreur : ${err.error}`);
      }
    } catch (error) {
      setStatus(`❌ Erreur réseau : ${error.message}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed gray",
        borderRadius: "10px",
        padding: "50px",
        textAlign: "center",
        margin: "50px",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Déposez le fichier ici...</p>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
}
