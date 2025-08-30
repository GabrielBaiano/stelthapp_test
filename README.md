<p align="center">
  <img src="/src/assets/icon.jpg" alt="StelthApp Logo" width="200"/>
</p>

<h1 align="center">StelthApp</h1>

<p align="center">
  <a href="README.en.md" target="_blank">English</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/GabrielBaiano/stelthapp_test/issues/new?title=Sugestão%20ou%20Bug%20no%20StelthApp&body=**Descreva%20sua%20ideia%20ou%20o%20problema%20aqui:**%0A%0A%0A**Passos%20para%20reproduzir%20(se%20for%20um%20bug):**%0A1.%20...%0A2.%20...%0A%0A**Qualquer%20outra%20informação%20relevante?**%0A" target="_blank">Reportar Bug / Sugestão</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/gabriel-nascimento-gama-5b0b30185/" target="_blank">Linkedin</a>
</p>

---

<p align="center">
  <img src="https://i.imgur.com/your-showcase-image.gif" alt="StelthApp Showcase"/>
</p>

**StelthApp** é um cliente de desktop minimalista e seguro para a API do Google Gemini, projetado com foco em privacidade e produtividade. Converse com a IA diretamente do seu computador com a funcionalidade única de proteção de tela, que torna a janela invisível para softwares de gravação e compartilhamento de tela.

##  Funcionalidades Principais

* ** Proteção de Compartilhamento de Tela**: Ative o modo de proteção para que o conteúdo da janela não possa ser capturado por ferramentas de gravação ou em transmissões ao vivo. Ideal para privacidade.
* ** Experiência de Desktop Nativa**: Interface limpa e sem distrações, construída com Electron para rodar perfeitamente no seu sistema operacional.

##  Tecnologias Utilizadas

* **Framework**: Electron
* **Linguagem**: TypeScript
* **Módulo Nativo**: C++ com `node-addon-api` para a funcionalidade de proteção de tela.
* **Interface**: HTML, CSS
* **Empacotamento**: electron-builder
* **Bibliotecas**: `marked.js` (Markdown), `highlight.js` (Destaque de Código)

##  Como Usar e Instalar

A instalação é simples e direta.

1.  Acesse a **[Página de Releases aqui](https://github.com/GabrielBaiano/stelthapp_test/tags)**.
2.  Baixe o instalador mais recente para o seu sistema operacional (ex: `StelthApp-Setup-X.X.X.exe` para Windows).
3.  Execute o instalador.
    * **Observação para Windows:** O SmartScreen pode exibir um aviso de "Editor Desconhecido". Isso é normal. Clique em "Mais informações" e depois em "Executar assim mesmo".

## 💻 Para Desenvolvedores

Se você deseja clonar o repositório e rodar o projeto localmente:

```bash
# 1. Clone o repositório
git clone [https://github.com/GabrielBaiano/stelthapp_test.git](https://github.com/GabrielBaiano/stelthapp_test.git)

# 2. Navegue até a pasta do projeto
cd stelthapp_test

# 3. Instale as dependências
npm install

# 4. Rode em modo de desenvolvimento
npm start

# 5. Para criar os instaladores
npm run package