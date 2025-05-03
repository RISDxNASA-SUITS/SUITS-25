FROM eclipse-temurin:24-jdk-alpine

RUN apk add maven --no-cache
WORKDIR /app
COPY . .
RUN mvn clean install
CMD ["mvn", "exec:java"]