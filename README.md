# road-games

https://roadgames.stefoo.sh

Find sporting events in a geographic radius by date range

---

- React 16.13.1
- Bootstrap 5.2.2
- OpenLayers 6.4.3

```
npm run build && npm start
```

- Stored objects are synchronized into a MongoDB Atlas via [sh.stefoosh.sportsdata.sync.Importer](https://github.com/stefoosh/sportsdata/blob/main/sync/src/main/java/sh/stefoosh/sportsdata/sync/Importer.java)
- [Pull requests](https://github.com/stefoosh/road-games/pulls?q=is%3Apr+is%3Aclosed) build and deploy to Cloudflare Pages
