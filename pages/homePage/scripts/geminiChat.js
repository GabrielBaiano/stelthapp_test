        // Seletores de elementos do DOM
        const chatForm = document.getElementById('chat-form');
        const promptInput = document.getElementById('prompt-input');
        const sendButton = document.getElementById('send-button');
        const chatContainer = document.getElementById('chat-container');
        const apiKeyInput = document.getElementById('api-key');

        // URL da API do Gemini Pro
        const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=';

        // Função para adicionar mensagem ao chat
        const addMessage = (sender, message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', sender);
            
            const contentElement = document.createElement('div');
            contentElement.classList.add('message-content');
            
            // Substitui \n por <br> para renderizar quebras de linha
            contentElement.innerHTML = message.replace(/\n/g, '<br>');

            messageElement.appendChild(contentElement);
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight; // Rola para a mensagem mais recente
        };

        // Função para chamar a API do Gemini
        const getGeminiResponse = async (prompt, apiKey) => {
            if (!apiKey) {
                alert('Por favor, insira sua API Key do Google AI.');
                return;
            }

            addMessage('user', prompt);
            
            const loadingMessageElement = document.createElement('div');
            loadingMessageElement.classList.add('chat-message', 'model');
            loadingMessageElement.innerHTML = `<div class="message-content loading"><p>Digitando...</p></div>`;
            chatContainer.appendChild(loadingMessageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            sendButton.disabled = true;
            promptInput.disabled = true;

            try {
                const response = await fetch(`${API_URL}${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `Erro na API: ${response.statusText}`);
                }

                const data = await response.json();
                
                if (!data.candidates || data.candidates.length === 0) {
                     throw new Error('A API retornou uma resposta vazia. Verifique sua chave e as permissões.');
                }
              
                const modelResponse = data.candidates[0].content.parts[0].text;

                chatContainer.removeChild(loadingMessageElement);
                addMessage('model', modelResponse);

            } catch (error) {
                console.error('Erro:', error);
                chatContainer.removeChild(loadingMessageElement);
                addMessage('model', `Desculpe, algo deu errado. Verifique sua API Key e a conexão. Detalhes: ${error.message}`);
            } finally {
                sendButton.disabled = false;
                promptInput.disabled = false;
                promptInput.focus();
            }
        };

        // Event listener para o envio do formulário
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const prompt = promptInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            
            if (prompt && apiKey) {
                getGeminiResponse(prompt, apiKey);
                promptInput.value = '';
            } else if (!apiKey) {
                 alert('Por favor, insira sua API Key do Google AI antes de enviar uma mensagem.');
            }
        });