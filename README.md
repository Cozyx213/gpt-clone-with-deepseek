AI Chat with Flask, Ollama, and Next.js 🚀

An AI-powered chat application using Flask (Python) as the backend and Next.js (React) as the frontend, integrated with Ollama for LLM inference. The app streams AI-generated responses in real-time and supports syntax-highlighted code output.

📌 Features

✅ Real-time AI responses using Server-Sent Events (SSE)✅ Streaming text generation for a smoother chat experience✅ Syntax highlighting for code blocks (supports multiple languages)✅ Next.js frontend with Tailwind CSS for a clean UI✅ Flask backend using Ollama with DeepSeek-Coder integration

📦 Installation

1. Clone the Repository

git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Install and Start the Flask Backend


python -m venv venv   # Create a virtual environment
source venv/bin/activate   # Activate virtual environment (Mac/Linux)
venv\Scripts\activate   # Activate virtual environment (Windows)
pip install -r requirements.txt   # Install dependencies
python app.py   # Start Flask backend

By default, Flask runs on http://localhost:5000/.

3. Install and Start the Next.js Frontend

cd frontend   # Move into the Next.js frontend folder
npm install   # Install dependencies
npm run dev   # Start Next.js frontend

By default, the frontend runs on http://localhost:3000/.

4. Install Ollama and Pick a Model

Before running the backend, you must install Ollama and select a model.

pip install ollama  # Install Ollama
ollama pull deepseek-coder  # Download the DeepSeek-Coder model

By default, Ollama runs on http://localhost:11434/.

🛠️ Usage

Enter a prompt in the chatbox and press Enter to send.

The AI will stream responses in real-time (similar to ChatGPT).

Code blocks are auto-detected and syntax-highlighted.

📌 Tech Stack

Backend: Flask, Ollama, DeepSeek-Coder

Frontend: Next.js (React), Tailwind CSS

Streaming: Server-Sent Events (SSE)

Code Highlighting: react-syntax-highlighter

🎨 Screenshots



🚀 Future Enhancements

🔹 Add a database to store chat history
🔹 Deploy to Vercel (frontend) and Render (backend)
🔹 Add copy-to-clipboard button for code snippets
🔹 Improve UI with animations and loading indicators
