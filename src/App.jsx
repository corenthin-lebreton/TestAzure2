import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BlobServiceClient } from "@azure/storage-blob";
import { ManagedIdentityCredential } from "@azure/identity";

const accountName = "comptecorenthin"; 
const containerName = "testcorenthin";  
const blobServiceUrl = `https://${accountName}.blob.core.windows.net`;

function App() {
  const [status, setStatus] = useState("Glisse un fichier ici ou clique pour en sélectionner");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsUploading(true);
    setStatus(`Authentification...`);

    try {
      // ✅ Authentification avec Managed Identity (fonctionne dans Azure)
      const credential = new ManagedIdentityCredential();
      const blobServiceClient = new BlobServiceClient(blobServiceUrl, credential);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      setStatus(`Envoi du fichier ${file.name}...`);
      const blobClient = containerClient.getBlockBlobClient(file.name);

      await blobClient.uploadBrowserData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      setStatus(`✅ ${file.name} envoyé avec succès !`);
    } catch (err) {
      console.error("Erreur:", err);
      setStatus(`❌ Erreur : ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  }, []);

  // 🔹 Initialisation du dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        width: "400px",
        height: "200px",
        border: "2px dashed #666",
        borderRadius: "10px",
        textAlign: "center",
        lineHeight: "200px",
        margin: "100px auto",
        cursor: "pointer",
        background: isDragActive ? "#f0f0f0" : "#fafafa",
        opacity: isUploading ? 0.7 : 1,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <input {...getInputProps()} />
      <p>{status}</p>
    </div>
  );
}

export default App;
