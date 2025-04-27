FROM python:3.12
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
COPY . .
RUN poetry install

CMD ["poetry", "run","start"]
