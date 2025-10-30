const onDrop = async (acceptedFiles) => {
  const file = acceptedFiles[0];
  const formData = new FormData();
  formData.append("file", file);

  setStatus("Envoi en cours...");

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
};
