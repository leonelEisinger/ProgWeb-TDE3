const API_BASE = "https://ucsdiscosapi.azurewebsites.net/api";
const API_KEY = "8175fA5f6098c5301022f475da32a2aa";
let authToken = null;
let currentOffset = 0;

// Mostrar/ocultar loading
function toggleLoading(show) {
  const loading = document.getElementById("loading");
  if (show) loading.classList.remove("d-none");
  else loading.classList.add("d-none");
}

// Autenticação
async function authenticate() {
  try {
    const response = await fetch(`${API_BASE}/autenticar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: API_KEY }),
    });
    const data = await response.json();
    authToken = data.token;
  } catch (error) {
    console.error("Erro na autenticação:", error);
  }
}

// Buscar álbuns
async function fetchAlbums(offset, limit = 4) {
  try {
    toggleLoading(true);
    const response = await fetch(`${API_BASE}/discos?offset=${offset}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error);
  } finally {
    toggleLoading(false);
  }
}

// Adicionar álbuns no grid
async function loadAlbums() {
  const albums = await fetchAlbums(currentOffset, 4);
  const grid = document.getElementById("album-grid");

  if (!albums) return;

  albums.forEach((album) => {
    const col = document.createElement("div");
    col.className = "album-col col";
    col.innerHTML = `
      <img src="${album.capa}" alt="${album.titulo}" class="img-fluid album-image" data-id="${album.id}">
    `;
    col.querySelector(".album-image").addEventListener("click", () => showAlbumDetails(album.id));
    grid.appendChild(col);
  });

  currentOffset = (currentOffset + 4) % 105;
}

// Mostrar detalhes do álbum
async function showAlbumDetails(albumId) {
  try {
    toggleLoading(true);
    const response = await fetch(`${API_BASE}/discos/${albumId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const album = await response.json();

    // Criar modal dinamicamente
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${album.titulo}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Artista:</strong> ${album.artista}</p>
            <p><strong>Ano:</strong> ${album.ano}</p>
            <p><strong>Gênero:</strong> ${album.genero}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Remover modal após ser fechado
    modal.addEventListener("hidden.bs.modal", () => modal.remove());
  } catch (error) {
    console.error("Erro ao buscar detalhes do álbum:", error);
  } finally {
    toggleLoading(false);
  }
}

// Inicializar página
async function init() {
  await authenticate();
  await loadAlbums();

  // Scroll infinito
  window.addEventListener("scroll", async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      await loadAlbums();
    }
  });
}

init();
