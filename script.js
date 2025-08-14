function obterPergunta() {
  const perguntaInput = document.getElementById("pergunta");
  const pergunta = perguntaInput.value.trim();
  perguntaInput.value = "";
  return pergunta;
}

function mostrarSecaoResposta() {
  document.getElementById("secao-resposta").style.display = "block";
}

async function enviarPerguntaParaAPI(pergunta, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: pergunta }] }]
  };
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const dados = await resposta.json();
  return dados?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Sem resposta.";
}

function mostrarResposta(texto) {
  const respostaDiv = document.getElementById("resposta");
  respostaDiv.innerText = texto;
}

async function consultarGemini() {
  const pergunta = obterPergunta();
  const apiKey = document.getElementById("chaveApi").value.trim();

  if (!pergunta) {
    alert("Digite uma pergunta antes de enviar!");
    return;
  }
  if (!apiKey) {
    alert("Digite a chave API antes de enviar!");
    return;
  }

  mostrarSecaoResposta();

  try {
    const resposta = await enviarPerguntaParaAPI(pergunta, apiKey);
    mostrarResposta(resposta);
  } catch (erro) {
    mostrarResposta("Erro: " + erro.message);
  }
}

const perguntaInput = document.getElementById("pergunta");
perguntaInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    consultarGemini();
  }
});

    // Código acima feito por Maíra Kaminski & Rui Gomes