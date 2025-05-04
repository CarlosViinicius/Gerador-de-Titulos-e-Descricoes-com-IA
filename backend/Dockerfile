# Dockerfile - BACKEND
FROM python:3.11-slim

WORKDIR /app

# Instala dependências do sistema (se necessário)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia apenas a pasta do código refatorado
COPY app/ ./app
COPY .env .env

# Evita buffering nos logs
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Comando de inicialização
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
