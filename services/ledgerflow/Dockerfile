FROM python:3.12-alpine
RUN apk add --no-cache gcc musl-dev postgresql-dev
WORKDIR /app
RUN pip install django==5.2.4 psycopg2-binary
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
