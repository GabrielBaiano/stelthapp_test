<p align="center">
  <img src="/src/assets/icons/icon.jpg" alt="StelthApp Logo" width="200"/>
</p>

<h1 align="center">StelthApp</h1>

<p align="center">
  <a href="README.md" target="_blank">Português</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/GabrielBaiano/stelthapp_test/issues/new?title=Suggestion%20or%20Bug%20in%20StelthApp&body=**Describe%20your%20idea%20or%20the%20issue%20here:**%0A%0A%0A**Steps%20to%20reproduce%20(if%20it's%20a%20bug):**%0A1.%20...%0A2.%20...%0A%0A**Any%20other%20relevant%20information?**%0A" target="_blank">Report Bug / Suggestion</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/gabriel-nascimento-gama-5b0b30185/" target="_blank">Linkedin</a>
</p>

---

<p align="center">
  <img src="https://i.imgur.com/your-showcase-image.gif" alt="StelthApp Showcase"/>
</p>

**StelthApp** is a minimalist and secure desktop client for the Google Gemini API, designed with a focus on privacy and productivity. Chat with the AI directly from your desktop with the unique screen protection feature, which makes the window invisible to screen recording and sharing software.

## ✨ Key Features

* ** Screen Sharing Protection**: Activate protection mode to prevent the window's content from being captured by recording tools or during live streams. Ideal for privacy.
* ** Native Desktop Experience**: A clean, distraction-free interface built with Electron to run perfectly on your operating system.

## 🛠️ Tech Stack

* **Framework**: Electron
* **Language**: TypeScript
* **Native Module**: C++ with `node-addon-api` for the screen protection feature.
* **Interface**: HTML, CSS
* **Packaging**: electron-builder
* **Libraries**: `marked.js` (Markdown), `highlight.js` (Code Highlighting)

## 🚀 How to Use & Install

Installation is simple and straightforward.

1.  Go to the **[Releases Page here](https://github.com/GabrielBaiano/stelthapp_test/tags)**.
2.  Download the latest installer for your operating system (e.g., `StelthApp-Setup-X.X.X.exe` for Windows).
3.  Run the installer.
    * **Note for Windows users:** SmartScreen might show a warning for an "Unknown Publisher." This is normal. Click on "More info" and then "Run anyway."

## 💻 For Developers

If you want to clone the repository and run the project locally:

```bash
# 1. Clone the repository
git clone [https://github.com/GabrielBaiano/stelthapp_test.git](https://github.com/GabrielBaiano/stelthapp_test.git)

# 2. Navigate to the project folder
cd stelthapp_test

# 3. Install dependencies
npm install

# 4. Run in development mode
npm start

# 5. To build the installers
npm run package