# LibreDesk local deployment

```bash
cd libredesk
LIBREDESK_SYSTEM_USER_PASSWORD='replace-this' docker compose up -d
```

Open `http://localhost:9000`, create a live-chat inbox, then set these variables when building H5:

```env
VITE_LIBREDESK_URL=http://localhost:9000
VITE_LIBREDESK_INBOX_ID=<inbox uuid>
```

The H5 support route loads LibreDesk's official `widget.js` when both variables are present. Without them, the existing authenticated support conversation remains available.

The app, PostgreSQL, Redis, and uploads use named volumes. Do not use `docker compose down -v` unless all support data should be deleted.
