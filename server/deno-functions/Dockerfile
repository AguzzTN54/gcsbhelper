# Buld the app first then build docker
FROM denoland/deno:alpine


WORKDIR /app

COPY ./dist /app

ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT

CMD ["sh","-c","deno run  --unstable-kv --allow-net --allow-env --allow-read --unstable-cron ./deploy.js"]