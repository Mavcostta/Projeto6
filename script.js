let historicoMensagens = [];

function obterPergunta() {
  const perguntaInput = document.getElementById("pergunta");
  const pergunta = perguntaInput.value.trim();
  perguntaInput.value = "";
  return pergunta;
}

function mostrarSecaoResposta() {
  document.getElementById("secao-resposta").style.display = "block";
}

function adicionarMensagemAoHistorico(tipo, conteudo) {
  const timestamp = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const mensagem = {
    tipo: tipo,
    conteudo: conteudo,
    timestamp: timestamp,
  };

  historicoMensagens.push(mensagem);
  atualizarExibicaoHistorico();
}

function atualizarExibicaoHistorico() {
  const respostaDiv = document.getElementById("resposta");
  respostaDiv.innerHTML = "";

  historicoMensagens.forEach((mensagem) => {
    const mensagemDiv = document.createElement("div");
    mensagemDiv.className = `mensagem ${mensagem.tipo}`;

    if (mensagem.tipo === "pergunta") {
      mensagemDiv.innerHTML = `
        <div class="mensagem-header">
          <strong>🙋‍♂️ Você</strong>
          <span class="timestamp">${mensagem.timestamp}</span>
        </div>
        <div class="mensagem-conteudo">${mensagem.conteudo}</div>
      `;
    } else {
      mensagemDiv.innerHTML = `
        <div class="mensagem-header">
          <strong>🤖 IA DEVersidade</strong>
          <span class="timestamp">${mensagem.timestamp}</span>
        </div>
        <div class="mensagem-conteudo">${mensagem.conteudo}</div>
      `;
    }

    respostaDiv.appendChild(mensagemDiv);
  });

  // fazer scroll para a última mensagem
  respostaDiv.scrollTop = respostaDiv.scrollHeight;
}

async function enviarPerguntaParaAPI(pergunta, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: pergunta }] }],
  };
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();
  return (
    dados?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Sem resposta."
  );
}

function mostrarMensagemCarregando() {
  const respostaDiv = document.getElementById("resposta");
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-message";
  loadingDiv.className = "mensagem resposta loading";
  loadingDiv.innerHTML = `
    <div class="mensagem-header">
      <strong>🤖 IA DEVersidade</strong>
    </div>
    <div class="mensagem-conteudo">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      Digitando...
    </div>
  `;
  respostaDiv.appendChild(loadingDiv);
  respostaDiv.scrollTop = respostaDiv.scrollHeight;
}

function removerMensagemCarregando() {
  const loadingDiv = document.getElementById("loading-message");
  if (loadingDiv) {
    loadingDiv.remove();
  }
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
  adicionarMensagemAoHistorico("pergunta", pergunta);
  mostrarMensagemCarregando();

  // desabilita o botão durante o carregamento
  const botao = document.getElementById("botaoPerguntar");
  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const resposta = await enviarPerguntaParaAPI(pergunta, apiKey);

    removerMensagemCarregando();

    adicionarMensagemAoHistorico("resposta", resposta);
  } catch (erro) {
    removerMensagemCarregando();

    adicionarMensagemAoHistorico("resposta", "Erro: " + erro.message);
  } finally {
    botao.disabled = false;
    botao.textContent = "Perguntar";
  }
}

const perguntaInput = document.getElementById("pergunta");
perguntaInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    consultarGemini();
  }
});