FROM python:3.12.6

ENV PYTHONBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app
RUN apt-get update

COPY . .
RUN pip install -r requirements.txt

ENTRYPOINT [ "sh", "entrypoint.sh" ]