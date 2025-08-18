//pegar o textarea
const textarea= document.getElementById("pergunta")

// Seleciona os novos botões
const botaoLimpar = document.getElementById("botaoLimpar");
const botaoCopiar = document.getElementById("botaoCopiar");

// Cria a div de feedback de cópia
const feedbackCopiar = document.createElement('div');
feedbackCopiar.className = 'feedback-copiar';
feedbackCopiar.innerText = 'Resposta copiada!';
document.body.appendChild(feedbackCopiar);

// 01 - Funcionalidade "Limpar Resposta"
botaoLimpar.addEventListener("click", () => {
// Confirmar ação antes de limpar
const confirmar = confirm("Tem certeza que deseja limpar a resposta?");
if (confirmar) {
document.getElementById("pergunta").value = "";
document.getElementById("resposta").innerText = "";
document.getElementById("secao-resposta").style.display = "none";
}
});

// 02 - Funcionalidade "Copiar Resposta"
botaoCopiar.addEventListener("click", () => {
const respostaTexto = document.getElementById("resposta").innerText;

if (navigator.clipboard) {
navigator.clipboard.writeText(respostaTexto)
.then(() => {
// Feedback visual de sucesso
feedbackCopiar.classList.add('show');
setTimeout(() => {
feedbackCopiar.classList.remove('show');
}, 2000);
})
.catch(err => {
// Tratamento de erro
alert("Erro ao copiar a resposta: " + err);
});
} else {
// Tratamento de erro se a API não estiver disponível
alert("Seu navegador não suporta a API de cópia.");
}
});

textarea.addEventListener("keydown",(e)=>{
          if(e.key==="Enter" && !e.shiftKey){
            e.preventDefault();
            document.getElementById("botaoPerguntar").click();
          }
      })
async function consultarGemini(event) {
      event.preventDefault();
      
      const pergunta = document.getElementById("pergunta").value;
      const respostaDiv = document.getElementById("resposta");
      const apiKey = document.getElementById("chaveApi").value;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: pergunta }] }]
      };

      document.getElementById("secao-resposta").style.display = "block";

      try {
        const resposta = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const dados = await resposta.json();
        const texto = dados?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Sem resposta.";
        respostaDiv.innerText = texto;
      } catch (erro) {
        respostaDiv.innerText = "Erro: " + erro.message;
      }

      
    }
  

    // Código acima feito por Maíra Kaminski & Rui Gomes
    // Novas funcionalidades por Lô Gurgel