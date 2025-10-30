import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { BlobServiceClient } from "@azure/storage-blob";
import { ManagedIdentityCredential } from "@azure/identity";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer();

// === Serve les fichiers React buildés ===
app.use(express.static(path.join(__dirname, "../dist")));

// === Route d’upload ===
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const accountName = "comptecorenthin";
    const containerName = "testcorenthin";
    const blobServiceUrl = `https://${accountName}.blob.core.windows.net`;

    const credential = new ManagedIdentityCredential();
    const blobServiceClient = new BlobServiceClient(blobServiceUrl, credential);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobClient = containerClient.getBlockBlobClient(req.file.originalname);
    await blobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    res.status(200).json({ message: "✅ Fichier envoyé avec succès !" });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ error: err.message });
  }
});

// === Redirige toutes les routes vers index.html (React Router) ===
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`✅ Serveur Express lancé sur le port ${PORT}`));
