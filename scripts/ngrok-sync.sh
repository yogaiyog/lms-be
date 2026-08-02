#!/bin/bash
set -e

BACKEND_ENV=".env"
NGROK_PORT=4000
NGROK_API="http://localhost:4040/api/tunnels"

# 1. Kill existing ngrok if any
if pgrep -x ngrok > /dev/null 2>&1; then
  echo "Stopping existing ngrok..."
  pkill ngrok 2>/dev/null || true
  sleep 1
fi

# 2. Start ngrok in background
echo "Starting ngrok on port $NGROK_PORT..."
ngrok http $NGROK_PORT --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!
echo "  PID: $NGROK_PID"

# 3. Wait for ngrok tunnel to be ready with a public URL
echo -n "Waiting for tunnel"
NGROK_URL=""
for i in $(seq 1 15); do
  NGROK_URL=$(curl -s $NGROK_API | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$NGROK_URL" ]; then break; fi
  sleep 1
  echo -n "."
done
echo ""

# 4. Verify public URL was obtained

if [ -z "$NGROK_URL" ]; then
  echo "ERROR: Could not get ngrok URL from API"
  echo "--- ngrok log ---"
  cat /tmp/ngrok.log
  exit 1
fi

echo "Tunnel: $NGROK_URL -> localhost:$NGROK_PORT"

# 5. Update backend .env
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|^PUBLIC_BASE_URL=.*|PUBLIC_BASE_URL=\"$NGROK_URL\"|" "$BACKEND_ENV"
else
  sed -i "s|^PUBLIC_BASE_URL=.*|PUBLIC_BASE_URL=\"$NGROK_URL\"|" "$BACKEND_ENV"
fi

echo ""
echo "PUBLIC_BASE_URL updated in $BACKEND_ENV"
echo "Restart backend to apply: npm run dev"
