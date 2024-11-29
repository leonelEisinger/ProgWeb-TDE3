// script.js
const API_KEY = "8175fA5f6098c5301022f475da32a2aa";
const BASE_URL = "https://ucsdiscosapi.azurewebsites.net";
let token = null;
let offset = 0; // Para controle da rolagem infinita
const LIMIT = 12; // Quantidade de registros por requisição

document.addEventListener("DOMContentLoaded", async () => {
  token = await autenticar();
  if (token) {
    carregarDiscos();
    window.addEventListener("scroll", verificarScroll);
  }
});

// Função para autenticar
async function autenticar() {
  try {
    exibirLoading(true);
    const response = await fetch(`https://ucsdiscosapi.azurewebsites.net/swagger/index.html/discos/autenticar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: "8175fA5f6098c5301022f475da32a2aa" }),
    });
    const data = await response.json();
    exibirLoading(false);
    return data.token;
  } catch (error) {
    exibirLoading(false);
    alert("Erro ao autenticar!");
    console.error(error);
  }
}

// Função para carregar discos
async function carregarDiscos() {
  try {
    exibirLoading(true);
    const response = await fetch(`${BASE_URL}/discos/records?offset=${offset}&limit=${LIMIT}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const discos = await response.json();
    renderizarDiscos(discos);
    offset = (offset + LIMIT) % 105; // Atualiza offset e reinicia ao chegar em 105
    exibirLoading(false);
  } catch (error) {
    exibirLoading(false);
    alert("Erro ao carregar discos!");
    console.error(error);
  }
}

// Função para renderizar os discos
function renderizarDiscos(discos) {
  const container = document.getElementById("discos-container");
  discos.forEach((disco) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6";
    col.innerHTML = `
      <img src="${disco.capaUrl}" alt="${disco.titulo}" data-id="${disco.id}">
    `;
    col.querySelector("img").addEventListener("click", () => abrirModal(disco.id));
    container.appendChild(col);
  });
}

// Função para abrir o modal com detalhes
async function abrirModal(id) {
  try {
    exibirLoading(true);
    const response = await fetch(`${BASE_URL}/discos/record?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const disco = await response.json();
    document.getElementById("modal-body").innerHTML = `
      <p><strong>Título:</strong> ${disco.titulo}</p>
      <p><strong>Artista:</strong> ${disco.artista}</p>
      <p><strong>Gênero:</strong> ${disco.genero}</p>
      <p><strong>Ano:</strong> ${disco.ano}</p>
      <img src="${disco.capaUrl}" alt="${disco.titulo}" class="img-fluid">
    `;
    new bootstrap.Modal(document.getElementById("detailsModal")).show();
    exibirLoading(false);
  } catch (error) {
    exibirLoading(false);
    alert("Erro ao carregar detalhes!");
    console.error(error);
  }
}

// Verifica se o usuário chegou ao final da página
function verificarScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    carregarDiscos();
  }
}

// Exibe ou oculta o loading
function exibirLoading(ativo) {
  document.getElementById("loading").style.display = ativo ? "block" : "none";
}
