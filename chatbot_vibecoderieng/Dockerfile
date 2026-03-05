# Use python 3.10 slim (best compatibility with current langchain/onnx wheels)
FROM python:3.10-slim-bullseye

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    python3-dev \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies using uv
# --system to install into the system python, avoiding venv complexity in Docker
RUN uv pip install --system --no-cache -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory for RAG file uploads
RUN mkdir -p /app/uploads

# Expose port
EXPOSE ${PORT:-8888}

# Run the application
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8888}"]
