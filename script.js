// Função para autenticar o usuário e armazenar o token
function autenticar(callback) {
  $.ajax({
    url: "https://ucsdiscosapi.azurewebsites.net/Discos/autenticar",
    method: "POST",
    headers: {
      "ChaveAPI": "8175fA5f6098c5301022f475da32a2aa",
    },
    success: function (response) {
      console.log("Resposta da autenticação:", response);
      if (response.token) {
        try {
          localStorage.setItem("auth_token", response.token);
          console.log("Token armazenado com sucesso:", response.token);
          if (callback) callback(response.token);
        } catch (e) {
          console.error("Erro ao salvar token no localStorage:", e);
        }
      } else {
        console.error("Token não recebido. Verifique a resposta.");
      }
    },
    error: function (erro) {
      console.error("Erro na autenticação:", erro);
    },
  });
}

// // Função para carregar discos e exibir no HTML
function carregarDiscos(token, numeroInicio, quantidade) {
  $.ajax({
    url: "https://ucsdiscosapi.azurewebsites.net//Discos/records",
    method: "GET",
    headers: {
      "TokenApiUCS": token, // Passa o token no cabeçalho
    },
    data: {
      numeroInicio: numeroInicio, // Índice inicial
      quantidade: quantidade,     // Quantidade de itens
    },
    success: function (response) {
      console.log("Discos recebidos:", response);
      exibirDiscos(response); // Exibe os discos no HTML
    },
    error: function (erro) {
      console.error("Erro ao carregar discos:", erro);
    },
  });
}

// Função para exibir os discos no container
function exibirDiscos(discos) {
  const container = $("#discos-container"); // Contêiner onde os discos serão exibidos
  discos.forEach(disco => {
    const discoElement = `
      <div class="disco">
        <img src="${disco.imagemUrl}" alt="${disco.nome}" class="disco-img" />
        <p>${disco.nome}</p>
      </div>
    `;
    container.append(discoElement);
  });
}

// Função inicial para configurar o carregamento
$(document).ready(function () {
  const token = localStorage.getItem("auth_token");
  let numeroInicio = 1; // Índice inicial dos discos

  if (token) {
    console.log("Token encontrado no localStorage:", token);
    carregarDiscos(token, numeroInicio, 12);

    // Incrementa o índice ao carregar mais discos
    $("#carregar-mais").click(function () {
      numeroInicio += 12;
      carregarDiscos(token, numeroInicio, 12);
    });
  } else {
    console.log("Token não encontrado. Iniciando autenticação...");
    autenticar((novoToken) => {
      console.log("Novo token obtido:", novoToken);
      carregarDiscos(novoToken, numeroInicio, 12);

      // Incrementa o índice ao carregar mais discos
      $("#carregar-mais").click(function () {
        numeroInicio += 12;
        carregarDiscos(novoToken, numeroInicio, 12);
      });
    });
  }
});