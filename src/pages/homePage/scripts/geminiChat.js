const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

// Elementos do DOM
const chatForm = document.getElementById("chat-form");
const promptInput = document.getElementById("prompt-input");
const chatContainer = document.getElementById("chat-container");
const apiKeyInput = document.getElementById("api-key");
const toggleApiKeyButton = document.getElementById("toggle-api-key");
const attachButton = document.getElementById("attach-button");
const imageInput = document.getElementById("image-input");
const imagePreviewContainer = document.getElementById("image-preview-container");
const themeToggle = document.getElementById("theme-toggle"); // NOVO

// Variáveis de estado para a imagem
let stagedImage = { base64: null, mimeType: null, dataUrl: null };

// --- Funções de UI, Atalhos e Tema ---

window.addEventListener('DOMContentLoaded', () => {
    // Carrega API Key
    const savedKey = localStorage.getItem('googleApiKey');
    if (savedKey) apiKeyInput.value = savedKey;

    // NOVO: Carrega e aplica o tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
});

apiKeyInput.addEventListener('input', () => {
    localStorage.setItem('googleApiKey', apiKeyInput.value.trim());
});

toggleApiKeyButton.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleApiKeyButton.querySelector('.eye-icon').style.display = isPassword ? 'none' : 'block';
    toggleApiKeyButton.querySelector('.eye-off-icon').style.display = isPassword ? 'block' : 'none';
});

// NOVO: Listener para o botão de tema
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
});


promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

attachButton.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
});

document.addEventListener('paste', (e) => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
    if (item) {
        const file = item.getAsFile();
        handleImageFile(file);
    }
});

// --- Lógica de Pré-visualização da Imagem (sem alterações) ---

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
        const [metadata, base64Data] = evt.target.result.split(',');
        stagedImage = {
            base64: base64Data,
            mimeType: metadata.split(':')[1].split(';')[0],
            dataUrl: evt.target.result
        };
        displayImagePreview();
    };
    reader.readAsDataURL(file);
}

function displayImagePreview() {
    if (!stagedImage.dataUrl) return;
    imagePreviewContainer.innerHTML = `
        <img src="${stagedImage.dataUrl}" alt="Pré-visualização da imagem">
        <button id="remove-image-btn" title="Remover imagem">×</button>
    `;
    imagePreviewContainer.style.display = 'block';
    document.getElementById('remove-image-btn').addEventListener('click', clearImagePreview);
}

function clearImagePreview() {
    stagedImage = { base64: null, mimeType: null, dataUrl: null };
    imageInput.value = "";
    imagePreviewContainer.innerHTML = '';
    imagePreviewContainer.style.display = 'none';
}

// --- Funções de Chat (sem alterações) ---

function addMessage(sender, message, imageUrl = null) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender);
    const content = document.createElement("div");
    content.classList.add("message-content");
    if (message) content.innerHTML = marked.parse(message);
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        content.appendChild(img);
    }
    content.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    div.appendChild(content);
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendToGemini(prompt, apiKey) {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("chat-message", "model");
    loadingDiv.innerHTML = `<div class="message-content loading"><p>Pensando...</p></div>`;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const parts = [];
    if (prompt) parts.push({ text: prompt });
    if (stagedImage.base64 && stagedImage.mimeType) {
        parts.push({
            inline_data: {
                mime_type: stagedImage.mimeType,
                data: stagedImage.base64
            }
        });
    }

    try {
        const body = { contents: [{ parts }] };
        const res = await fetch(`${API_URL}${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || `Erro HTTP: ${res.status}`);
        }

        const data = await res.json();
        chatContainer.removeChild(loadingDiv);
        let modelText = "Desculpe, não consegui processar a resposta.";
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
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

    if (!apiKey) return alert("Por favor, insira sua Google AI API Key.");
    if (!prompt && !stagedImage.base64) return;
    
    addMessage("user", prompt, stagedImage.dataUrl);
    sendToGemini(prompt, apiKey);
    
    promptInput.value = "";
    clearImagePreview();
});