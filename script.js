// apiKey = "AIzaSyARz9SVBbErGgjhIv2HzuiZgEukP5zj54Q"; 

    async function consultarGemini() {
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