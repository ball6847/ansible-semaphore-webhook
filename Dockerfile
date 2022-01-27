FROM denoland/deno:alpine-1.18.0

COPY . /app
WORKDIR /app
USER deno

RUN deno cache main.ts

EXPOSE 3000

CMD ["run", "--allow-env", "--allow-net", "--allow-read", "main.ts"]
