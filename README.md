# ProgWeb-TDE3

API alimentada utilizando CSS, Bootstrap, HTML, e JS para implementar as chamadas via AJAX com tratamento de erros. Quando qualquer chamada HTTP ou processamento for realizado deve ter um loading na página (o usuário deve entender que a página esta trabalhando em algo)

Os métodos que retornam os valores utilizam o token retornado no método autenticar.

Página de exibição das imagens retornadas pela API. Ao abrir a página deve carregar automaticamente 12 registros. A página deve possuir um mecanismo de rolagem infinita, na medida que chega ao final deve carregar os próximos 4 registros e assim por diante. Quando clicar na capa do álbum deve ser exibido uma modal usando bootstrap com todas as informações daquele registro. As informações usadas para serem exibidas na modal deve ser o retorno da chamada HTTP que retorna apenas as informações de 1 registro e não de todos. Deve ser utilizado a última versão do bootstrap consumida via CDN conforme orientações de instalação na página do bootstrap.

Na exibição inicial deve ser visualizado apenas as imagens em colunas. Deve ser utilizado no máximo 2 colunas quando a largura da tela for maior que 768px. Quando a largura for menor que isso utilizar apenas 1 coluna de exibição. Um exemplo das visualizações está na figura abaixo, sendo que os tamanhos das imagens são ilustrativos.

A quantidade total de registros salvos no sistema é de 105, ou seja, como existe a rolagem infinita ao chegar no 105 deve retornar para o primeiro item da lista. A autenticação deve ser otimizada.
