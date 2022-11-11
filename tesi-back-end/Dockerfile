# 1
FROM python:3.8

# 2
RUN pip install Flask gunicorn flask_cors

# 3
COPY / /
WORKDIR /

RUN pip install -r requirements.txt

EXPOSE 8081
# 4
ENV PORT 8081
# 5
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 my-backend:app

