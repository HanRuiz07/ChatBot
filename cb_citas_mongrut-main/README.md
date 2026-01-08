## Docker
```
docker build . -t chat_bot_citas:latest
```

```
docker rm -f bot 2>/dev/null
docker run \
  --name "chat_bot_citas" \
  --env-file .env \
  -p 6001:6001/tcp \
  -v "$(pwd)/bot_sessions:/app/bot_sessions:rw" \
  --cap-add SYS_ADMIN \
  --restart always \
  chat_bot_citas:latest
```
