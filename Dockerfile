FROM debian:bookworm-slim

WORKDIR /app
COPY . .

RUN chmod +x server.exe
CMD ["./server.exe --local"]