itriX WEB (frontend) patch — v4.0.3 (realtime chat + live client-page generation)

HOW TO APPLY
  1. Unzip this file into the ROOT of your itrix-web repo
     (the folder that contains package.json). You'll get:
         itrix-web-patch/apply.sh
         itrix-web-patch/files/...
  2. From the repo root, run:
         bash itrix-web-patch/apply.sh
     It copies the fixed files into place, backs up whatever it overwrites into
     ./.patch-backup-<timestamp>/, adds that backup to .gitignore, then deletes the
     patch payload, the zip, and itself so nothing extra is committed.
  3. Commit & push:
         git add -A
         git commit -m "realtime chat + live client-page streaming"
         git push
  4. On Railway (web service): confirm NEXT_PUBLIC_ENABLE_REALTIME=true,
     NEXT_PUBLIC_ENABLE_AGENT_CHAT=true, and
     NEXT_PUBLIC_WS_URL=wss://itrix-backend-production.up.railway.app/ws . Redeploy.

FILES IN THIS PATCH (all against the shipped v3 frontend)
  src/app/api/client-page/[token]/chat/route.ts  normalize Django reply → ChatMessage (fixes crash)
  src/app/api/review/[id]/chat/route.ts           same normalization for the review chat
  src/hooks/useAgentChat.ts                        guarantee citations[]; handle live stream + under-review
  src/components/chat/ChatThread.tsx               defensive citations read (never white-screens)
  src/components/client-page/ClientPageLive.tsx    watch the page GENERATE live over the socket
  src/lib/realtime/socketEvents.ts                 + clientpage.delta / clientpage.final events
  src/lib/api/clientPageApi.ts                     typed ChatReply (message | under-review)

Deploy the itrix-backend patch too — the two work together.
