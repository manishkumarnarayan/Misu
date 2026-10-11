# Happy Birthday, Misu

A mobile-first birthday surprise: a cinematic intro, three small games, a scratch-card letter and a photo scrapbook.
Built with Vite, React 19, Tailwind 4, Motion and canvas-confetti.

## Run it

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Personalise it (everything is in `src/config.js`)

| What | Where in `config.js` |
| --- | --- |
| Her birthday (enables age, "time since birth" counter, candle count) | `birthDate: 'YYYY-MM-DD'` |
| The letter from Kritika | `letter` |
| Intro story slides | `intro` |
| Photo captions and the notes on the back of each polaroid | `photos` |
| Fortune quiz questions and results | `quiz` |
| "Say thanks to Kritika" button (for example a WhatsApp link) | `replyUrl` |
| Background music file (otherwise a synthesised Happy Birthday tune plays) | `music` |

If `birthDate` is empty, the site hides the age and counter and uses 10 candles, so it never shows a wrong number.

### Add videos

1. Put the files in `public/videos/` (MP4, H.264, ideally under 20 MB each).
2. List them in `config.js`:

```js
videos: [{ src: '/videos/clip1.mp4', poster: '/videos/clip1.jpg', title: 'Remember this?' }],
```

A "Little moments" section appears on the final page.

### Add or swap photos

Drop the image in `src/assets/images/`, import it at the top of `config.js` and add an entry to `photos`.
Keep photos upright (rotate them first) and under about 1600 px wide.

## Deploy

Push this folder to GitHub and import it in Vercel (framework preset: Vite). Nothing else is needed.
The page includes `noindex`, so search engines will not list it. There are no analytics and nothing is sent anywhere.

## Notes

- The wish typed in the cake game stays in the browser tab and is never saved or sent.
- Progress (which trials are done) is remembered on her device only, via local storage.
- The microphone is only requested if she taps "Blow with the microphone", and tapping the flames always works.
