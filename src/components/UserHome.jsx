import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/UserHome.css';

function UserHome() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURLs, setFileURLs] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("loggedUser");

  useEffect(() => {
    if (!currentUser) {
      alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      navigate("/");
    } else {
      fetchFileURLs(); // Cargar los archivos al montar el componente
    }
  }, );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo para subir.");
      return;
    }

    try {
      // Solicitar la URL prefirmada
      const response = await fetch("https://blackback01.vercel.app/papa/generate-presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser, fileName: selectedFile.name }),
      });

      const data = await response.json();

      if (response.ok) {
        const { uploadUrl, fileName } = data;

        // Subir el archivo a S3 usando la URL prefirmada
        const s3Response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream",
          },
          body: selectedFile,
        });

        if (s3Response.ok) {
          alert("Archivo subido exitosamente.");

          // Guardar la URL del archivo en la base de datos
          const fileURL = `https://bucket-page-rm23.s3.amazonaws.com/${fileName}`;
          await saveFileURL(fileURL, fileName);

          // Actualizar la lista de archivos
          fetchFileURLs();
          setSelectedFile(null); // Limpiar el archivo seleccionado
        } else {
          alert("Error al subir el archivo a S3.");
        }
      } else {
        alert(`Error al obtener la URL prefirmada: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Hubo un problema al subir el archivo.");
    }
  };

  const saveFileURL = async (fileURL, fileName) => {
    try {
      const response = await fetch("https://blackback01.vercel.app/papa/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser,
          fileName,
          fileURL,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`Error al guardar el archivo: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al guardar la URL del archivo:", error);
      alert("Hubo un problema al guardar el archivo.");
    }
  };

  const fetchFileURLs = async () => {
    try {
      const response = await fetch("https://blackback01.vercel.app/papa/user-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser }),
      });

      const data = await response.json();
      if (response.ok) {
        setFileURLs(data);
      } else {
        alert(`Error al obtener los archivos: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al obtener URLs de archivos:", error);
      alert("No se pudieron cargar los archivos.");
    }
  };

  const isImage = (url) => /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);

  const isVideo = (url) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  return (
    <div className="user-home">
      <header className="user-home-header">
        <h1>Bienvenido, {currentUser}</h1>
      </header>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          {selectedFile ? "Subir Archivo" : "Selecciona un Archivo"}
        </button>
      </div>

      <h2>Archivos Cargados</h2>
      <div className="files-list">
        {fileURLs.length === 0 ? (
          <p>No tienes archivos cargados.</p>
        ) : (
          fileURLs.map((file, index) => (
            <div key={index} className="file-item">
              {isImage(file.fileURL) ? (
                <img src={file.fileURL} alt={file.fileName} />
              ) : isVideo(file.fileURL) ? (
                <video controls>
                  <source src={file.fileURL} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <p>Archivo: {file.fileName}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserHome;
