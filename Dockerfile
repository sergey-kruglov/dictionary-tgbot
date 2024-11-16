FROM denoland/deno:2.0.6

WORKDIR /app
USER deno

COPY . .

RUN deno cache --allow-import ./src/main.ts

CMD ["deno", "task", "start"]