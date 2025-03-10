import json
import requests
from flask import Flask, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route("/generate", methods=["POST"])
def generate():
    """
    Streams AI response from Ollama to Next.js frontend.
    """
    data = request.get_json()
    if not data or "prompt" not in data:
        return Response(json.dumps({"error": "No prompt provided"}), status=400, mimetype="application/json")

    prompt = data["prompt"]
    model = "deepseek-coder"
    model2 = "deepseek-r1:14b"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True  # Enable streaming in Ollama
    }

    response = requests.post(OLLAMA_URL, json=payload, stream=True)

    def stream():
        for line in response.iter_lines(decode_unicode=True):
            if line:
                try:
                    chunk_data = json.loads(line)  # Ensure valid JSON
                except json.JSONDecodeError:
                    continue  # Skip invalid JSON lines

                if "done" in chunk_data and chunk_data["done"]:
                    break  # End the stream

                if "response" in chunk_data:
                    yield json.dumps({"text": chunk_data["response"]}) + "\n"  # Add newline to separate JSON objects

    return Response(stream(), content_type="application/x-ndjson")  # Fix content type

if __name__ == "__main__":
    app.run(debug=True, port=5000)
