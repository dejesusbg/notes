var materialTheme = document.createElement("style");
materialTheme.setAttribute("id", "material-theme");
document.head.appendChild(materialTheme);

const SCHEME_TONES = [100, 99, 95, 90, 80, 60, 50, 40, 30, 20, 10]
const SCHEMES = {
  "primary": [[0, 0, 100], [59, 100, 99], [14, 100, 96], [7, 100, 93], [2, 100, 82], [0, 55, 68], [1, 40, 57], [0, 34, 48], [1, 43, 38], [3, 58, 28], [5, 100, 18]],
  "secondary": [[0, 0, 100], [55, 100, 99], [10, 100, 96], [3, 65, 92], [3, 27, 81], [0, 12, 60], [1, 9, 49], [-1, 11, 40], [-2, 13, 31], [-2, 18, 22], [-7, 26, 13]],
  "tertiary": [[0, 0, 100], [-330, 100, 99], [2, 100, 96], [0, 100, 92], [3, 63, 83], [0, 25, 61], [0, 19, 50], [-2, 21, 41], [-1, 25, 31], [-4, 33, 22], [-4, 48, 13]],
  "neutral": [[0, 0, 100], [-8, 100, 99], [15, 19, 95], [27, 9, 89], [3, 5, 78], [0, 2, 57], [0, 2, 47], [-9, 3, 37], [-5, 2, 28], [-25, 3, 19], [-30, 10, 10]],
  "neutral-variant": [[0, 0, 100], [51, 100, 99], [11, 55, 96], [11, 24, 90], [6, 11, 79], [0, 5, 58], [6, 4, 47], [-4, 5, 38], [0, 7, 29], [-2, 8, 20], [1, 13, 12]],
}

function colorScheme(p, s = null) {
  const PRIMARY_COLOR = {
    h: chroma(p).hsl()[0],
    s: chroma(p).hsl()[1],
    l: chroma(p).hsl()[2]
  }

  const COLORS_HUE = {
    "primary": PRIMARY_COLOR.h,
    "secondary": (PRIMARY_COLOR.h - 12) % 360,
    "tertiary": s ? chroma(s).get("hsl.h") : (PRIMARY_COLOR.h + 88) % 360,
    "neutral": (PRIMARY_COLOR.h - 16) % 360,
    "neutral-variant": (PRIMARY_COLOR.h + 8) % 360
  }

  let cssText = "";
  for (let schemeName in SCHEMES) {
    const SCHEME = SCHEMES[schemeName]
      , HUE = COLORS_HUE[schemeName];

    for (var i = 0; i < 11; i++) {
      const NAME = `--${schemeName}-${SCHEME_TONES[i]}`
      const COLOR = {
        h: parseInt(HUE + SCHEME[i][0]),
        s: SCHEME[i][1] / 100,
        l: SCHEME[i][2] / 100
      }

      cssText += `${NAME}: ${chroma(COLOR)};`
      if (["neutral", "neutral-variant"].includes(schemeName) && [10, 20, 30, 90, 99].includes(SCHEME_TONES[i])) {
        for (var j = 1; j < 5; j++) {
          let alpha, source, backdrop, overlay;

          alpha = Math.abs((j - 1) * 0.05);
          source = COLOR;
          backdrop = PRIMARY_COLOR;

          overlay = {
            h: COLORS_HUE[schemeName],
            s: source.s * 0.9 + (backdrop.s - source.s) * (1 - alpha) * alpha * 0.20833333,
            l: source.l * 0.957142857 + (backdrop.l - source.l) * (1 - alpha) * alpha * 0.77
          }

          overlay.l += (COLOR.l > 0.5) ? ((j + 5.5) / 200) : ((j + 1.5) / 150);
          cssText += `${NAME}-e${j}: ${chroma(overlay)};`
        }
      }
    }
  }

  materialTheme.textContent = `body{${cssText}}`
}

function colorSchemeImg(path) {
  let i = document.createElement("img");
  i.crossOrigin = "Anonymous";
  i.setAttribute("src", path);

  let s, v, m;
  i.addEventListener("load", function () {
    s = new Vibrant(i).swatches();
    v = (s.Vibrant ?? s.DarkVibrant ?? s.LightVibrant).getHex();
    m = (s.Muted ?? s.DarkMuted ?? s.LightMuted).getHex() ?? null;
    colorScheme(v, m)
  })
}

function toggleDarkMode() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark")
}

document.body.classList.add(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
