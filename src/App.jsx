import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { ManagedIdentityCredential } from "@azure/identity";

function App() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const accountName = "comptecorenthin";        // nom de ton compte de stockage
  const containerName = "testcorenthin";         // ton conteneur
  const blobServiceUrl = `https://${accountName}.blob.core.windows.net`;

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setMessage("Authentification avec Managed Identity...");

      // 🔐 Authentification avec l’identité managée du container app
      const credential = new ManagedIdentityCredential();
      const blobServiceClient = new BlobServiceClient(blobServiceUrl, credential);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      setMessage(`Téléversement du fichier ${file.name}...`);
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      await blockBlobClient.uploadBrowserData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      setMessage(`✅ Fichier ${file.name} téléversé avec succès !`);
    } catch (error) {
      console.error("Erreur d’upload :", error);
      setMessage(`❌ Erreur : ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        width: "400px",
        height: "200px",
        border: "2px dashed #888",
        borderRadius: "10px",
        textAlign: "center",
        lineHeight: "200px",
        margin: "100px auto",
        background: uploading ? "#eee" : "#fafafa",
      }}
    >
      {message || "Glisse un fichier ici pour l’envoyer vers Azure Blob Storage"}
    </div>
  );
}

export default App;
