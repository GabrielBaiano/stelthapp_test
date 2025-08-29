const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=";
const chatForm = document.getElementById("chat-form");
const promptInput = document.getElementById("prompt-input");
const chatContainer = document.getElementById("chat-container");
const apiKeyInput = document.getElementById("api-key");
// NOVO: Referência para o botão de mostrar/ocultar
const toggleApiKeyButton = document.getElementById("toggle-api-key");

// --- Funções de UI e Atalhos ---

// Carrega a API Key do localStorage ao iniciar
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('googleApiKey');
  if (savedKey) apiKeyInput.value = savedKey;
});

// Salva a API Key no localStorage ao digitar
apiKeyInput.addEventListener('input', () => {
  localStorage.setItem('googleApiKey', apiKeyInput.value.trim());
});

// NOVO: Lógica para mostrar/ocultar a API Key
toggleApiKeyButton.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleApiKeyButton.querySelector('.eye-icon').style.display = isPassword ? 'none' : 'block';
    toggleApiKeyButton.querySelector('.eye-off-icon').style.display = isPassword ? 'block' : 'none';
});

// NOVO: Lógica para enviar com a tecla Enter (e pular linha com Shift+Enter)
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Impede que uma nova linha seja criada
        chatForm.requestSubmit(); // Envia o formulário
    }
});

// NOVO: Ouvinte para o atalho Ctrl+F vindo do Electron
// Garante que o código não quebre se 'window.api' não existir (ex: rodando no navegador)
if (window.api && window.api.on) {
    window.api.on('focus-input-box', () => {
        console.log('Comando Ctrl+F recebido, focando na caixa de texto...');
        promptInput.focus(); // Foca na caixa de texto
        promptInput.select(); // Seleciona todo o texto (opcional)
    });
}

// --- Funções de Chat (sem alteração) ---

function addMessage(sender, message) {
  const div = document.createElement("div");
  div.classList.add("chat-message", sender);
  const content = document.createElement("div");
  content.classList.add("message-content");
  content.innerHTML = marked.parse(message);
  content.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
  div.appendChild(content);
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendToGemini(prompt, apiKey) {
  addMessage("user", prompt);
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("chat-message", "model");
  loadingDiv.innerHTML = `<div class="message-content loading"><p>Digitando...</p></div>`;
  chatContainer.appendChild(loadingDiv);

  try {
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    const res = await fetch(`${API_URL}${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    chatContainer.removeChild(loadingDiv);
    let modelText = "Erro: resposta vazia ou malformada.";
    if (data.candidates && data.candidates[0].content.parts) {
      modelText = data.candidates[0].content.parts[0].text;
    }
    addMessage("model", modelText);
  } catch (err) {
    chatContainer.removeChild(loadingDiv);
    addMessage("model", "Erro: " + err.message);
  }
}

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const prompt = promptInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) return alert("Insira sua API Key.");
  if (prompt) {
    sendToGemini(prompt, apiKey);
    promptInput.value = "";
  }
});