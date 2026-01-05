import fs from "fs";

const CACHE_FILE = "./cache.json";

export function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      fs.writeFileSync(CACHE_FILE, "{}");
      return {};
    }

    const data = fs.readFileSync(CACHE_FILE, "utf-8");

    if (!data.trim()) {
      fs.writeFileSync(CACHE_FILE, "{}");
      return {};
    }

    return JSON.parse(data);
  } catch (err) {
    console.log("⚠️ Cache corrompu → réinitialisation");
    fs.writeFileSync(CACHE_FILE, "{}");
    return {};
  }
}

export function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export function clearCache() {
  fs.writeFileSync(CACHE_FILE, "{}");
}
