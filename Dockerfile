FROM debian:bookworm-slim
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      build-essential git \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
# 3. init / update submodules
RUN git submodule update --init --recursive

# 4. apply the tiny tweak
RUN git -C src/tss apply ../patches/tss-fix.patch
RUN chmod +x build.bat
RUN ./build.bat
RUN chmod +x server.exe
CMD ["./server.exe --local"]