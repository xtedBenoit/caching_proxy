import http from "http";
import fetch from "node-fetch";
import { loadCache, saveCache } from "./cache.js";

const httpsAgent = new http.Agent({
  rejectUnauthorized: false,
});

export function startServer(port, origin) {
  http
    .createServer(async (req, res) => {
      try {
        const cache = loadCache();
        const cacheKey = req.method + req.url;

        if (cache[cacheKey]) {
          res.writeHead(200, {
            ...cache[cacheKey].headers,
            "X-Cache": "HIT",
          });
          return res.end(cache[cacheKey].body);
        }

        const targetUrl = origin + req.url;

        const response = await fetch(targetUrl, {
          method: req.method,
          headers: req.headers,
          agent: targetUrl.startsWith("https") ? httpsAgent : undefined,
        });

        const body = await response.text();
        const headers = Object.fromEntries(response.headers.entries());

        cache[cacheKey] = { body, headers };
        saveCache(cache);

        res.writeHead(response.status, {
          ...headers,
          "X-Cache": "MISS",
        });

        res.end(body);
      } catch (err) {
        res.writeHead(500);
        res.end("Proxy error: " + err.message);
      }
    })
    .listen(port, () => {
      console.log(`Caching proxy running on port ${port}`);
    });
}
