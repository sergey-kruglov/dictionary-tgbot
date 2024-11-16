FROM denoland/deno:2.0.6

WORKDIR /app
USER deno

COPY . .

RUN deno cache ./src/

CMD ["deno", "task", "start"]