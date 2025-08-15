# Mudanças implementadas - Sistema de histórico de mensagens

## Objetivo

Implementar um sistema de histórico de mensagens similar ao ChatGPT, onde perguntas e respostas ficam salvas e exibidas em sequência durante a sessão do usuário.

## 🔄 Principais Alterações

### 1. **Adição de Variável Global para Histórico**

```javascript
// NOVO: array para armazenar o histórico de mensagens
let historicoMensagens = [];
```

- **O que faz**: Armazena todas as mensagens da sessão
- **Estrutura**: Array de objetos com `tipo`, `conteudo` e `timestamp`

### 2. **Nova Função: `adicionarMensagemAoHistorico()`**

```javascript
function adicionarMensagemAoHistorico(tipo, conteudo) {
  const timestamp = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const mensagem = {
    tipo: tipo, // 'pergunta' ou 'resposta'
    conteudo: conteudo,
    timestamp: timestamp,
  };

  historicoMensagens.push(mensagem);
  atualizarExibicaoHistorico();
}
```

- **O que faz**: Adiciona uma nova mensagem ao histórico
- **Parâmetros**: `tipo` ("pergunta" ou "resposta") e `conteudo` (texto da mensagem)
- **Timestamp**: Formato HH:MM (hora e minutos apenas)

### 3. **Nova Função: `atualizarExibicaoHistorico()`**

```javascript
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
```

- **O que faz**: Reconstrói toda a exibição do histórico
- **Interface**: Cada mensagem tem header com emoji, nome e timestamp
- **Auto-scroll**: Sempre mostra a mensagem mais recente

### 4. **Novas Funções de Loading**

```javascript
function mostrarMensagemCarregando() {
}

function removerMensagemCarregando() {
}
```

- **O que fazem**: Feedback visual durante o carregamento da API
- **UX**: Mostra "Digitando..." com pontos animados

### 5. **Modificação da Função Principal: `consultarGemini()`**

#### **ANTES** (código original):

```javascript
async function consultarGemini() {
  const pergunta = obterPergunta();
  const apiKey = document.getElementById("chaveApi").value.trim();

  // validações...
  mostrarSecaoResposta();

  try {
    const resposta = await enviarPerguntaParaAPI(pergunta, apiKey);
    mostrarResposta(resposta); // apenas substitui o conteúdo
  } catch (erro) {
    mostrarResposta("Erro: " + erro.message);
  }
}
```

#### **DEPOIS** (código modificado):

```javascript
async function consultarGemini() {
  const pergunta = obterPergunta();
  const apiKey = document.getElementById("chaveApi").value.trim();

  // adiciona pergunta ao histórico IMEDIATAMENTE
  mostrarSecaoResposta();
  adicionarMensagemAoHistorico("pergunta", pergunta);

  // mostra loading
  mostrarMensagemCarregando();

  // desabilita botão
  const botao = document.getElementById("botaoPerguntar");
  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const resposta = await enviarPerguntaParaAPI(pergunta, apiKey);
    removerMensagemCarregando();
    // adiciona resposta ao histórico
    adicionarMensagemAoHistorico("resposta", resposta);
  } catch (erro) {
    removerMensagemCarregando();
    adicionarMensagemAoHistorico("resposta", "Erro: " + erro.message);
  } finally {
    // reabilita botão
    botao.disabled = false;
    botao.textContent = "Perguntar";
  }
}
```

### 6. **Remoção da Função `mostrarResposta()`**

- **Motivo**: Não é mais necessária, pois o histórico é gerenciado pela nova função
- **Substituída por**: `adicionarMensagemAoHistorico()`

## Mudanças no CSS

### **Novos Estilos para Mensagens**

```css
/* container de resposta com scroll */
#resposta {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

/* estilos para cada mensagem */
.mensagem {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  animation: fadeIn 0.3s ease-out;
}

.mensagem.pergunta {
  background-color: var(--bg-secondary);
  margin-left: 2rem; /* alinhamento à direita */
}

.mensagem.resposta {
  background-color: var(--bg-tertiary);
  margin-right: 2rem; /* alinhamento à esquerda */
}
```

### **Animação de Loading**

```css
.loading-dots {
  display: flex;
  gap: 0.2rem;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background-color: var(--text-secondary);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite both;
}
```

## Responsividade

### **Adaptações Mobile**

```css
@media (max-width: 768px) {
  .mensagem.pergunta {
    margin-left: 0.5rem;
  }

  .mensagem.resposta {
    margin-right: 0.5rem;
  }

  .mensagem-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
```
