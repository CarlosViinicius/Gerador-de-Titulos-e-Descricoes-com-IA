import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Carrega variáveis do .env
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY não encontrada. Verifique o arquivo .env.")

client = OpenAI(api_key=API_KEY)
