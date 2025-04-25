## AI Prompt Marketplace

![PromptHash Dashboard](image/landing-page.png)

**PromptHash** is a dynamic, AI-powered marketplace connecting prompt creators with users seeking inspiration, productivity, and cutting-edge solutions. Our platform enables users to explore, create, buy, and sell high-quality AI prompts across various categories.


## Vision

Our vision is to become the go-to resource where creators and users converge—leveraging advanced AI models, privacy-focused blockchain infrastructure, and intuitive design—to spark transformative ideas across industries.

## Key Features

- 🔍 **Browse & Discover**: Explore curated collections of AI prompts from top creators
- 💰 **Buy & Sell Prompts**: Monetize your expertise or find the perfect prompt
- 🤖 **Advanced AI Integration**: Powered by Secret Network AI models including DeepSeek R1 (70B) and Llama 3.2 Vision
- 🔒 **Blockchain Security**: Built on Secret Network's privacy-preserving infrastructure
- 💬 **Conversational AI**: Maintain chat sessions with context awareness.
- 🏛️ **Governance**: Community-driven platform development
- ✨ **Prompt Engineering**: Tools to improve and optimize AI prompts.
- 👨‍💻 **Creator Profiles**: Dedicated space for top prompt creators
- 🖼️ **Multi-Format Support**: Generate images, text & code with ease
- 📚 **Comprehensive Documentation**: Detailed API documentation available via Swagger UI and ReDoc.

## Features & Overview

- **Discover & Explore**: Browse a curated collection of AI prompts across categories like Coding, Marketing, Creative Writing, and Business.
- **Sell & Share**: List and monetize your top AI prompts.
- **Interactive Chat**: Use our AI chatbox to get prompt recommendations and marketplace insights.
- **Responsive UI**: Built with Next.js, React, and Tailwind CSS for a seamless experience.
- **API Integration**: Easy integration with your applications via our RESTful API endpoints.

## 🛠️ Categories

- 📸 **Image Prompts**: For visual content generation
- 📝 **Text & Writing**: Creative writing, copywriting, and content creation
- 📊 **Marketing Copy**: Advertising, emails, and conversion-focused content
- 💡 **Creative Ideas**: Brainstorming and concept development
- 🚀 **Productivity Boosters**: Efficiency and workflow optimization
- 💻 **Code Generation**: Programming assistance and development

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI (for API endpoints)
- **AI Integration**: Secret Network AI API
- **Authentication**: Wallet Connect for blockchain integration
- **Server**: Uvicorn as the ASGI server
- **Blockchain**: Secret Network for privacy-preserving operations
- **Icons & UI**: Lucide for icon components


## Prerequisites

- Python 3.12.0
- Secret AI API Key
- Node.js 18+ and npm
- Secret AI API Key
- Web browser with wallet extension (for blockchain features)


## Installation

### Clone the Repository:
```sh
git clone https://github.com/OkeyAmy/PromptHash
cd PromptHash
```

### Create a Virtual Environment:
```sh
python -m venv venv
```

#### On Windows:
```sh
venv\Scripts\activate
```

#### On Linux/Mac:
```sh
source venv/bin/activate
```

### Install Dependencies:
```sh
pip install -r requirements.txt
```

### Set Environment Variables:
#### Windows PowerShell:
```sh
$env:SECRET_AI_API_KEY="your_api_key_here"
```

#### Windows CMD:
```sh
set SECRET_AI_API_KEY=your_api_key_here
```

#### Linux/Mac:
```sh
export SECRET_AI_API_KEY="your_api_key_here"
```

## Running the API

Start the API using Uvicorn:
```sh
uvicorn app.main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## API Documentation

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## API Endpoints

### Models
#### `GET /api/models`
Retrieves available AI models.

### Chat
#### `GET /api/chat`
Chat with an AI model.

**Parameters:**
- `prompt`: The user's question or prompt.
- `model` (Optional): The AI model to use.

### Prompt Improvement
#### `POST /api/improve-prompt`
Analyze and improve a provided prompt.

**Body:**
- `prompt`: The prompt text to improve.

### Health Check
#### `GET /api/health`
Check the health status of the API.

## Usage Examples

### Chat with AI Model
```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "http://localhost:8000"
headers = {
    "X-API-Key": API_KEY
}

response = requests.get(
    f"{BASE_URL}/api/chat",
    params={
        "prompt": "Explain the benefits of Secret Network for AI applications",
        "model": "deepseek-r1:70b"
    },
    headers=headers
)

print(response.json())
```

### Improve a Prompt
```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "http://localhost:8000"
headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

data = {
    "prompt": "Create an image of a futuristic city"
}

response = requests.post(
    f"{BASE_URL}/api/improve-prompt",
    json=data,
    headers=headers
)

print(response.json())
```

## Deployment on Render

### Automatic Deployment
1. Create a new Render account or sign in at [dashboard.render.com](https://dashboard.render.com).
2. Click on the "New +" button and select "Blueprint".
3. Connect your GitHub or GitLab account and select your repository.
4. Render will detect the `render.yaml` file and set up your service automatically with the required environment variables.

### Manual Deployment
1. Create a new Web Service on Render.
2. Connect your repository.
3. Use the following settings:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the environment variable:
   - **Key**: `SECRET_AI_API_KEY`
   - **Value**: `your_api_key_here`

Your API will be available at your Render URL once deployment is complete.

## Configuration

The API’s configuration is managed through environment variables and the `app/config.py` file:

| Variable           | Description                                       | Default                           |
|--------------------|---------------------------------------------------|-----------------------------------|
| SECRET_AI_API_KEY  | API key for Secret Network AI                     | Pre-configured in `render.yaml`   |
| API_KEY            | Optional API key for authentication               | `frontend-access-key-2025`        |
| CORS_ORIGINS       | Allowed origins for CORS                          | `[*]` (All origins)               |
| ENVIRONMENT        | Current environment (production/dev)              | `production`                      |

## Project Structure
```
PromptHash/
├── app/
│   ├── __init__.py
│   ├── config.py         # Application configuration
│   ├── main.py           # Application entry point
│   ├── models.py         # Pydantic models
│   ├── security.py       # API security mechanisms
│   └── routers/          # API route handlers
├── requirements.txt      # Project dependencies
└── README.md             # Project documentation
```

## Dependencies
Key dependencies include:
- **FastAPI**: Fast web framework for building APIs.
- **Pydantic**: Data validation and settings management.
- **Secret AI SDK**: Official SDK for interacting with Secret Network AI models.
- **Uvicorn**: ASGI server for running the API.
- **React, Next.js & Tailwind CSS**: For a responsive and intuitive frontend.
- **Lucide**: Icon library for UI components.

For a complete list, refer to the `requirements.txt` and `package.json` files.
