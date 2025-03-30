FROM python:3.11.5-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gcc \
    g++ \
    git \
    ninja-build \
    libstdc++-12-dev \
    libgcc-12-dev \
    libopenblas-dev \
    libssl-dev \
    clang \
    python3-dev

ENV CC=clang
ENV CXX=clang++


RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001  

CMD ["python", "main.py"]