
# Technical Specification (TS)

## Project Name

**Landing Builder SSR Platform**

## Project Goal

Creation of an SSR application on NestJS that displays different landings (white/black) depending on incoming traffic (IP, User-Agent, OS, etc.). The system should include cloaking, caching, dynamic manifest.json, and centralized settings in a configuration file.

---

## Technologies

* NestJS (SSR)
* MongoDB (logging, event storage)
* Redis (cache, throttling, blocklist)
* Docker / docker-compose
* ESLint, Prettier, Husky

---

## Main Requirements

### 1. Incoming Request Handling

* On request to `/`:

    * Extract IP, User-Agent, Referer
    * Perform simple bot checks, for example on suspicious User-Agent ('curl', 'wget', 'python-requests', 'Go-http-client', 'libwww-perl',
      'bot', 'spider', 'crawler', 'scrapy', 'httpclient', 'java', 'scan',
      'headless', 'phantomjs', 'node-fetch', 'axios')
    * If suspicious — show white page
    * Otherwise — check via VPN API ([https://vpnapi.io](https://vpnapi.io))
    * If suspicious — show white page
    * Cache the key and check result
    * If all is okay - black page

### 2. Page Rendering

* White page — if bot/suspicious traffic
* Black page — if live user, supports PWA

### 3. manifest.json

Dynamically assembled from the configuration file, available at endpoint `/manifest.json` for Black page

### 4. Configuration file `config.json`

Located in the project root

Example structure (sample content):

```json
{
  "cloaking": {
    "enabled": true,
    "enabledChecks": {
      "local": true,
      "vpnapi": true,
      // ...
    },
  },
  "osWhitelist": ["Android", "iOS", "Windows"],
  "pages": {
    "white": {
      "html": "./landings/white/index.html",
      "title": "White page title",
      "description": "White page description",
      // ...
    },
    "black": {
      "html": "./landings/black/index.html",
      "title": "Black page title",
      "description": "Black page description",
      // ...
    },
  },
  "pwa": {
    "manifest": {
      "name": "My PWA",
      "short_name": "PWA",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#ffffff",
      "theme_color": "#000000"
    }
  },
  "rateLimit": {
    "enabled": true,
    "limit": 100,
    "duration": 60
  },
}
```

### 5. Throttling

Check with saving blocks in Redis, settings from `config.json`

### 6. Settings Service

Implement a separate `SettingsService` for working with `config.json`.

Interface for reading/updating.

### 7. Docker and DevOps

* `docker-compose.yml`: Redis, MongoDB, NestJS application
* ESLint + Prettier + Husky
* ENV variables:

    * `ENV=production|development`
    * `MONGO_URL`
    * `REDIS_URL`
    * `VPN_API_KEY`

### 8. Healthcheck Endpoint

Show services status

### 9. MongoDB

Store request logs: IP, UA, time, result, block — allows making reports, debugging, banning by history.

Add TTL indexes for automatic deletion by time.

### 10. ESLint, Prettier, Husky (+lint-staged)

For analysis/formatting/type checking etc. on git hook

---

## MVP Functionality

1. Processing requests `/`
2. Simple bot filtering
3. Checking via vpnapi.io
4. Caching blocks in Redis
5. SSR rendering of white/black landings
6. Dynamic manifest.json
7. Docker, docker-compose
8. Saving request/block info
9. ESLint, Prettier, Husky

---

## For Discussion

### 1. Caching rendered pages (SSR)

With high traffic and repeated requests from real users, it is possible to additionally cache already rendered HTML pages (black/white landings). This:

* Reduces SSR rendering load
* Eliminates repeated calls to third-party APIs (vpnapi.io)
* Speeds up response

Cache key: `hash(IP + User-Agent + Accept-Language)` if pages are personalized or global landing caching.

TTL 5–10 minutes or simple reset on config update.

### 2. Consider replacing or supplementing vpnapi with Cloudflare bot detection

### 3. In the future, the settings service will be migrated to work with a configuration microservice; the service interface should not change

### 4. Security events (suspicious activity) can be stored in Mongo.

### 5. GeoIP check (MaxMind) + automatic database update implementation

### 6. Swagger — if REST API will be implemented

### 7. REST API for logs, status, settings management, etc.
