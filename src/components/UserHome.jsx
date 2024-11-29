import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/UserHome.css';

function UserHome() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURLs, setFileURLs] = useState([]);
  const navigate = useNavigate();

  // Cargar el usuario desde LocalStorage
  const currentUser = localStorage.getItem("loggedUser");

  useEffect(() => {
    // Verificar si el usuario está en sesión
    if (!currentUser) {
      alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      navigate("/login");
    } else {
      fetchFileURLs(); // Cargar los archivos al montar el componente
    }
  }, );

  // Manejar la selección del archivo
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Subir archivo al servidor
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", currentUser);

    try {
      const response = await fetch("https://blackback01.vercel.app/papa/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Archivo subido exitosamente.");
        fetchFileURLs(); // Actualizar la lista de archivos
      } else {
        alert(`Error al subir el archivo: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Hubo un problema al subir el archivo.");
    }
  };

  // Obtener las URLs de los archivos del usuario
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
        setFileURLs(data); // Actualizar las URLs
      } else {
        alert(`Error al obtener los archivos: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al obtener URLs de archivos:", error);
      alert("No se pudieron cargar los archivos.");
    }
  };

  // Determinar si es imagen o video por el tipo MIME
  const isImage = (url) => {
    return /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);
  };

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };


  return (
    <div className="user-home">
      <header className="user-home-header">
        <h1>Bienvenido, {currentUser}</h1>
      </header>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Archivo</button>
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
                <p>Formato no soportado.</p>
              )}
              <p>{file.fileName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserHome;
