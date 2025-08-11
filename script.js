const inputApiKey = document.getElementById("chaveApi");
const inputPergunta = document.getElementById("pergunta");
const botaoPerguntar = document.getElementById("botaoPerguntar");
const secaoResposta = document.getElementById("secao-resposta");
const divResposta = document.getElementById("resposta");

// Seção usando localStorage para não precisar digitar toda vez a chave
if (localStorage.getItem("gemini_api_key")) {
  inputApiKey.value = localStorage.getItem("gemini_api_key");
}

// função de loading
function mostrarLoading() {
  secaoResposta.style.display = "block";
  divResposta.textContent = "⏳ A IA está pensando... calma que ela não é mágica (e nunca vai ser).";
}

// Função para mostrar erro
function mostrarErro(mensagem) {
  secaoResposta.style.display = "block";
  divResposta.textContent = "❌ Erro: " + mensagem;
}

// Função que lê os inputs
function getInputs() {
  const apiKey = inputApiKey.value.trim();
  const pergunta = inputPergunta.value.trim();

  if (!apiKey) {
    mostrarErro("Você precisa inserir a chave de API!");
    return null;
  }
  if (!pergunta) {
    mostrarErro("Digite uma pergunta para a IA responder.");
    return null;
  }
  return { apiKey, pergunta };
}

// Fuhnção que salva a API Key
function saveApiKey(apiKey) {
  localStorage.setItem("gemini_api_key", apiKey);
}


// Função que faz a requisição para o Geminai
async function fetchRespostaIA(apiKey, pergunta) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: pergunta }
          ]
        }
      ]
    })
  });

  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status} - Erro ao conectar com Gemini.`);
  }

  const dados = await resposta.json();

  // Acessa o texto retornado pelo Gemini
  return dados.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta gerada.";
}

// Código acima feito por Maíra Kaminski

/*Esse comentário aqui você pode apagar Rui, é só pra falar o que eu fiz e o que eu acho que ainda precisa fazer: Eu fiz as variáveis pegando o conteúdo do HTML, uma função de loading, uma de erro, e um if com localStorage para que não precise digitar a chave toda vez, e a função que faz isso. Por último, a função que faz a requisição.

Aí vai faltar fazer a que renderiza a resposta, e a principal que controla tudo. Acho que o evento de clicar no botão pergunta e o de enter. Se achar que sobrou muita coisa pra ti me avisa!*/
