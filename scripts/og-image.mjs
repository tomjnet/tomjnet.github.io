// Generates public/og-image.png (1200x630), the link preview image used site wide.
// Uses public/images/headshot.jpg when it exists, otherwise a technical graphic.
// Run: npm run og   (re-run after adding or changing the headshot)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Keep in sync with src/data/site.ts and src/styles/global.css.
const name = ["Tomas", "Jimenez"];
const title = "Principal Software Engineer";
const focus = ["C++", "Low latency", "Mainframe"];
const color = { ink: "#0d0d0d", paper: "#ffffff", signal: "#ff3d1f" };
const headshot = "public/images/headshot.jpg";

/** Fetch a TTF from Google Fonts (without a browser user agent the CSS API serves TrueType). */
async function font(family, weight) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)).text();
  const src = css.match(/src: url\((.+?)\)/)?.[1];
  if (!src) throw new Error(`No font URL for ${family} ${weight}`);
  return (await fetch(src)).arrayBuffer();
}

const h = (type, style, children) => ({ type, props: { style: { display: "flex", ...style }, children } });

const brush = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 60" preserveAspectRatio="none"><g fill="${color.signal}"><path d="M8 38 C120 20 300 14 590 10 L594 22 C400 30 200 40 14 52 Z"/><path d="M40 46 C200 34 380 28 560 26 L562 32 C380 38 200 46 44 54 Z" opacity="0.7"/></g></svg>`,
)}`;

const grid = {
  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
  backgroundSize: "40px 40px",
};

const visual = existsSync(headshot)
  ? { type: "img", props: { src: `data:image/jpeg;base64,${readFileSync(headshot).toString("base64")}`, width: 380, height: 380, style: { objectFit: "cover", flexShrink: 0 } } }
  : h("div", { position: "relative", width: 380, height: 380, flexShrink: 0, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden", ...grid }, [
      h("div", { position: "absolute", right: 0, bottom: -40, width: 360, height: 200, backgroundColor: color.signal, transform: "skewY(-6deg)" }),
      h("div", { position: "absolute", left: 40, top: 10, fontFamily: "Anton", fontSize: 200, color: color.paper }, "μs"),
    ]);

const tree = h(
  "div",
  { width: 1200, height: 630, boxSizing: "border-box", backgroundColor: color.ink, color: color.paper, paddingTop: 64, paddingBottom: 64, paddingLeft: 72, paddingRight: 72, alignItems: "center", justifyContent: "space-between", fontFamily: "Inter" },
  [
    h("div", { flexDirection: "column" }, [
      h("div", { alignItems: "center", gap: 12, fontSize: 18, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }, [
        h("div", { width: 10, height: 10, borderRadius: 5, backgroundColor: color.signal }),
        "Portfolio",
      ]),
      h("div", { flexDirection: "column", marginTop: 28, fontFamily: "Anton", fontSize: 128, lineHeight: 0.92, textTransform: "uppercase" }, [
        h("div", {}, name[0]),
        h("div", { position: "relative" }, [
          name[1],
          h("div", { color: color.signal }, "."),
          { type: "img", props: { src: brush, width: 520, height: 44, style: { position: "absolute", left: 20, bottom: -40 } } },
        ]),
      ]),
      h("div", { marginTop: 48, fontSize: 30, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: color.signal }, title),
      h("div", { marginTop: 24, gap: 14 }, focus.map((k) =>
        h("div", { border: "2px solid rgba(255,255,255,0.4)", padding: "8px 16px", fontSize: 22, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }, k),
      )),
    ]),
    visual,
  ],
);

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Anton", data: await font("Anton", 400), weight: 400 },
    { name: "Inter", data: await font("Inter", 700), weight: 700 },
    { name: "Inter", data: await font("Inter", 800), weight: 800 },
  ],
});
writeFileSync("public/og-image.png", new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
console.log(`public/og-image.png written (${existsSync(headshot) ? "with headshot" : "technical graphic, no headshot yet"})`);
