import { useState, useEffect } from "react";
import "./styles/BlackTube.css";

function BlackTube() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  // Obtener los posts de todos los usuarios
  const fetchPosts = async () => {
  try {
    const response = await fetch("blackback01.vercel.app/papa/all-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // El cuerpo puede estar vacío si no necesitas enviar datos
    });
    const data = await response.json();
    if (response.ok) {
      setPosts(data);
    } else {
      alert(`Error al obtener los posts: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al obtener posts:", error);
    alert("Hubo un problema al cargar los posts.");
  }
};

  // Filtrar los posts desde el backend
  const fetchFilteredPosts = async () => {
    if (!filter && filterType !== "all") {
      alert("Por favor, escribe un filtro válido.");
      return;
    }
  
    try {
      const response = await fetch("blackback01.vercel.app/papa/filter-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter, filterType }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        alert(`Error al filtrar los posts: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al filtrar posts:", error);
      alert("Hubo un problema al aplicar el filtro.");
    }
  };
  
  

  // Determinar si es imagen
  const isImage = (url) => /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);

  // Determinar si es video
  const isVideo = (url) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  return (
    <div className="black-tube">
      <header className="black-tube-header">
        <h1>BlackTube</h1>
        <div className="filter-section">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="user">Por Usuario</option>
          </select>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
            placeholder="Escribe tu filtro aquí..."
          />
          <button onClick={fetchFilteredPosts} className="filter-button">
            Aplicar Filtro
          </button>
        </div>
      </header>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No hay posts que mostrar.</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="post-item">
              <h3 className="post-username">@{post.username}</h3>
              {isImage(post.fileURL) ? (
                <img src={post.fileURL} alt={post.fileName} className="post-media" />
              ) : isVideo(post.fileURL) ? (
                <video
                  src={post.fileURL}
                  controls
                  className="post-media"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <p>Formato no soportado.</p>
              )}
              <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlackTube;

