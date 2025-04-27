FROM debian:bookworm-slim

WORKDIR /app
COPY tss ./tss

RUN chmod +x server.exe
CMD ["./server.exe --local"]