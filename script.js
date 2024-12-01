const loadingSpinner = $('.loading');
let numeroInicio = 1;
let totalCarregados = 0;
let quantidade = 12;
let discosTotais = 105; // Total de discos disponíveis
let carregando = false; // Flag para evitar múltiplos carregamentos simultâneos

$(document).ready(function() {
    loadingSpinner.show();

    // Autenticação e carregamento inicial dos discos
    $.ajax({
        url: "https://ucsdiscosapi.azurewebsites.net/Discos/autenticar",
        method: "POST",
        headers: {
            "ChaveAPI": "8175fA5f6098c5301022f475da32a2aa"
        },
        success: function(response) {
            if (response) {
                localStorage.setItem("auth_token", response);
                console.log("Autenticação realizada, token recebido:", response);
                carregarDiscos(); // Carregar discos após autenticação
            } else {
                console.log("Resposta da autenticação sem token:", response);
            }
        },
        error: function(xhr, status, error) {
            console.error("Erro na autenticação:", xhr.status, xhr.responseText);
        }
    });

    // Adicionando evento de rolagem para o infinite scroll
    $(window).on('scroll', function() {
        if (!carregando && $(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            carregarDiscos(); // Carregar discos ao chegar no final da página
        }
    });
});

// Função para carregar discos
function carregarDiscos() {
    // Impedir carregamento múltiplo ao mesmo tempo
    if (carregando) return;

    carregando = true;
    const token = localStorage.getItem("auth_token");
    console.log("Token recuperado:", token); // Verifique se o token está correto

    if (totalCarregados === 0) {
        quantidade = 12; // Carregar 12 discos inicialmente
    } else {
        quantidade = 4; // Carregar 4 discos após o primeiro carregamento
    }

    // Garantir que numeroInicio não ultrapasse 105 discos
    if (numeroInicio > discosTotais) {
        numeroInicio = 1; // Reiniciar o carregamento dos discos a partir do primeiro
        totalCarregados = 0; // Resetar o contador de discos carregados
    }

    // Ajustar quantidade de discos se o número de discos restantes for menor do que a quantidade solicitada
    if (numeroInicio + quantidade - 1 > discosTotais) {
        quantidade = discosTotais - numeroInicio + 1; // Ajustar para carregar apenas os discos restantes
    }

    $.ajax({
        url: "https://ucsdiscosapi.azurewebsites.net/Discos/records",
        method: "GET",
        data: {
            numeroInicio: numeroInicio,
            quantidade: quantidade
        },
        headers: {
            "TokenApiUCS": token
        },
        success: function(response) {
            loadingSpinner.hide();
            totalCarregados += response.length;
            console.log("Discos carregados com sucesso:", response);
            console.log(`Total de discos carregados: ${totalCarregados}`); // Exibe o número total de discos carregados
            exibirDiscos(response);

            // Incrementar o número de início para carregar os próximos discos
            numeroInicio += quantidade;

            carregando = false; // Permitir novo carregamento
        },
        error: function(xhr, status, error) {
            console.error("Erro ao carregar discos:", xhr.status, xhr.responseText);
            carregando = false; // Liberar carregamento em caso de erro
        }
    });
}

// Função para carregar detalhes do disco e exibir no modal
function carregarDetalhesDisco(discoId) {
    const token = localStorage.getItem("auth_token");

    $.ajax({
        url: "https://ucsdiscosapi.azurewebsites.net/Discos/record",
        method: "GET",
        data: {
            numero: discoId,
        },
        headers: {
            "TokenApiUCS": token
        },
        success: function(disco) {
            $('#modalImagemDisco').attr('src', `data:image/jpeg;base64,${disco.imagemEmBase64}`);
            $('#descricaoPrimaria').text(disco.descricaoPrimaria || 'Sem descrição primária disponível.');
            $('#descricaoSecundaria').text(disco.descricaoSecundaria || 'Sem descrição secundária disponível.');

            const modal = new bootstrap.Modal(document.getElementById('modalDisco'));
            modal.show();
        },
        error: function(xhr, status, error) {
            console.error("Erro ao carregar detalhes do disco:", xhr.status, xhr.responseText);
        }
    });
}

// Função para exibir discos
function exibirDiscos(discos) {
    if (!discos || discos.length === 0) {
        console.log("Nenhum disco encontrado.");
        return;
    }

    const container = $('#discosContainer');
    discos.forEach(disco => {
        const discoHTML = `
            <div class="disco">
                <img 
                    src="data:image/jpeg;base64,${disco.imagemEmBase64}" 
                    alt="Imagem do disco" 
                    class="imagem-disco" 
                    data-id="${disco.id}" 
                />
            </div>
        `;
        container.append(discoHTML);
    });

    // Adicionar eventos de clique às imagens
    $('.imagem-disco').on('click', function() {
        const discoId = $(this).data('id');
        carregarDetalhesDisco(discoId);
    });
}
