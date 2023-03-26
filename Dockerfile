FROM denoland/deno:alpine-1.32.1

COPY . /app
WORKDIR /app
USER deno

RUN deno cache src/main.ts

EXPOSE 3000

CMD ["run", "--allow-env", "--allow-net", "--allow-read", "src/main.ts"]
