FROM python:3.11-alpine
RUN apk add --no-cache gcc musl-dev postgresql-dev
WORKDIR /app
RUN pip install django==4.2.0 psycopg2-binary
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
