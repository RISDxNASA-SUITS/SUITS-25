FROM debian:bookworm-slim
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      build-essential \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY .. .
RUN chmod +x build.bat
RUN ./build.bat
RUN chmod +x server.exe
CMD ["./server.exe --local"]