# 💐 A Love Letter to Mom

An interactive Mother's Day gift built with React — a single-page experience designed to make her smile, pause, and feel deeply loved.

> *"This little page is my way of saying what words alone never quite capture."*

---

## ✨ What's Inside

A scrollable, four-part interactive journey:

- **💌 The Envelope** — A gently floating envelope with falling petals invites her to open the letter.
- **📜 The Letter** — A handwritten-style message types itself out, word by word.
- **❤️ The Heart Button** — Press to reveal reasons you love her, one by one, with bursts of confetti and floating hearts.
- **🌸 The Memory Garden** — A garden of flowers, each holding a little memory or inside joke on hover.

All wrapped in soft pinks, warm creams, and smooth spring animations.

---

## 🛠️ Built With

- **[React](https://react.dev/)** — UI framework
- **[Vite](https://vitejs.dev/)** — build tool
- **[Tailwind CSS](https://tailwindcss.com/)** — styling
- **[Framer Motion](https://www.framer.com/motion/)** — animations
- **[react-type-animation](https://www.npmjs.com/package/react-type-animation)** — typewriter effect
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** — celebration bursts
- **[Lucide React](https://lucide.dev/)** — icons

Fonts: *Playfair Display* & *Dancing Script* via Google Fonts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone or download this project
cd mothers-day-letter

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder — ready to deploy anywhere.

---

## 🌐 Deploying (So She Can Open It Anywhere)

The easiest ways to share this with Mom:

**Vercel (recommended):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
Drag and drop the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

Both are free and give you a shareable link in under a minute.

---

## 💝 Personalizing It

Want to make it more hers? Edit `src/data/content.js`:

- **`reasons`** — the reasons she'll see when pressing the heart button. Make some specific to her (her laugh, her cooking, her handwriting).
- **`memories`** — the little notes that appear on the garden flowers. Inside jokes land best here.

You can also tweak the opening letter in `src/components/Letter.jsx` and the sign-off in `src/App.jsx`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Envelope.jsx        # Opening hero section
│   ├── Letter.jsx          # Typewriter letter
│   ├── HeartButton.jsx     # Interactive heart + reasons
│   ├── MemoryGarden.jsx    # Hoverable flower garden
│   ├── FallingPetals.jsx   # Background petal animation
│   └── Flower.jsx          # Individual flower SVG
├── data/
│   └── content.js          # Reasons & memories arrays
├── App.jsx
├── index.css
└── main.jsx
```

---

## 🎨 Design Notes

- **Colors:** Blush pink, warm cream, dusty rose, burgundy, soft gold
- **Feel:** Handwritten love letter meets flower garden
- **Respects `prefers-reduced-motion`** for accessibility
- **Mobile-friendly** — works beautifully on phones so she can open it wherever

---

## 💌 A Note

This project was made with love. If you're using it for your own mom, feel free to change anything — the words, the flowers, the colors. What matters most is that it comes from you.

Happy Mother's Day. 🌷

---

*Made with 💕*