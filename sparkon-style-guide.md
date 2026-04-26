# سباركون | Sparkon KFUPM — Style Guide

> Website: [sparkon-kfupm.com](https://www.sparkon-kfupm.com)  
> Direction: **RTL** (Right-to-Left) — Arabic-first

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sparkon Red** | `#EB1B26` | `rgb(235, 27, 38)` | Primary accent, CTA buttons, highlights, section backgrounds |
| **Pure Black** | `#000000` | `rgb(0, 0, 0)` | Main background, hero sections, dark sections |
| **Off-Black / Dark Navy** | `#0D1117` | `rgb(13, 17, 23)` | Dark card/section backgrounds |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Text on dark backgrounds, light UI elements |

### Secondary / Utility Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **White 50% Alpha** | `rgba(255,255,255,0.5)` | — | Subtle overlays, ghost elements |
| **Black 50% Alpha** | `rgba(0,0,0,0.5)` | — | Overlays on images |
| **Teal / Mint** | `#4BA181` | `rgb(75, 161, 129)` | Minor UI accents (Weglot language switcher) |
| **Link Blue** | `#116DFF` | `rgb(17, 109, 255)` | Default hyperlinks |

### Color Usage Rules

- Backgrounds alternate between **Black** and **Red** sections.
- All body text on dark backgrounds is **White**.
- The CTA button (سجّل الآن / للتسجيل) uses a **Red background with White text**.
- Navigation links are **White** on transparent/dark background.
- Section dividers and timeline lines use **Red** (`#EB1B26`).

---

## 🔤 Typography

### Font Families

The website uses **Wix/Parastorage**-hosted fonts (not Google Fonts).

#### Arabic Fonts (RTL content)

| Font Family | Weight | Usage |
|---|---|---|
| `janna-lt-w20-regular` | 400 (Regular) | Body text, navigation links, Arabic paragraph text |
| `almarai` | Variable | Arabic UI elements |
| `din-next-w01-light` | 300 (Light) | Secondary Arabic headings |

#### Latin / Display Fonts

| Font Family | Weight | Usage |
|---|---|---|
| `helveticaneueltw20-ligh` | 700 (Bold) | H1, H2 display headings |
| `helveticaneuew01-65medi` | 700 (Medium/Bold) | Headings, bold display text |
| `helveticaneuew01-45ligh` | 300 (Light) | Subheadings, lighter text |
| `madefor-display-bold` | 700 | Display / Hero text |
| `madefor-text` | Variable | Body text (Wix MadeFor) |
| `wix-madefor-text-v2` | Variable | Body text variant |
| `ibm-plex-mono` | Variable | Code / monospace elements |
| `inter` | Variable | General UI |
| `arial-w01-black` | 900 (Black) | Heavy display emphasis |

#### Fallback Stack

```css
font-family: Arial, Helvetica, sans-serif;
```

---

## 📐 Type Scale (Computed from live page)

| Element | Font Family | Size | Weight | Color | Line Height |
|---|---|---|---|---|---|
| `h1` | `helveticaneueltw20-ligh` | `~85px` | `700` | `#FFFFFF` | `1.0` (tight) |
| `h2` | `helveticaneueltw20-ligh` | `~56px` | `700` | `#FFFFFF` | `1.2` |
| `h3` | `janna-lt-w20-regular` | `~40px` | `400` | `#FFFFFF` | `1.2` |
| `h4` | `janna-lt-w20-regular` | `~28px` | `400` | `#FFFFFF` | `1.3` |
| `h5` | `janna-lt-w20-regular` | `~22px` | `400` | `#FFFFFF` | `1.3` |
| `h6` | `janna-lt-w20-regular` | `~16px` | `400` | `#FFFFFF` | `1.4` |
| `p` | `janna-lt-w20-regular` | `~18px` | `400` | `#FFFFFF` | `1.6` |
| `a` / nav links | `janna-lt-w20-regular` | `~33px` | `400` | `#EB1B26` | normal |
| `body` | `Arial, Helvetica, sans-serif` | `10px` base | `400` | `#000000` | normal |

---

## 🧱 Layout & Spacing

- **Direction:** `rtl` (Right-to-left)
- **Text Align:** `end` (right-aligned for Arabic)
- **Full-width sections** stacked vertically
- Section heights are **viewport-height** (`100vh`) for hero sections
- Cards have **rounded corners** and image overlays

---

## 🔘 Buttons / CTAs

### Primary Button (سجّل الآن / للتسجيل)

```css
background-color: #EB1B26;
color: #FFFFFF;
font-family: janna-lt-w20-regular, sans-serif;
font-size: ~24px;
font-weight: 400;
border-radius: 0px;        /* sharp corners on main CTA */
padding: 14px 32px;
text-align: center;
direction: rtl;
```

### Secondary / Ghost Button

```css
background-color: rgba(235, 27, 38, 0.15);
color: #EB1B26;
border: 1px solid #EB1B26;
border-radius: 0px;
padding: 10px 24px;
```

---

## 🗂 Section Styles

### Hero Section

```css
background-color: #000000;
background-image: /* dark industrial/robotic photo */;
background-size: cover;
background-position: center;
color: #FFFFFF;
min-height: 100vh;
```

### Red Section (مسارات سباركون)

```css
background-color: #EB1B26;  /* rgb(235, 27, 38) */
color: #FFFFFF;
padding: 60px 0;
```

### Dark / Stats Section

```css
background-color: #000000;
background-image: /* starfield / space texture */;
color: #FFFFFF;
padding: 80px 0;
```

### Cards (Track cards)

```css
background-color: rgba(0, 0, 0, 0.6);
background-image: /* track photo overlay */;
border-radius: 8px;
color: #FFFFFF;
overflow: hidden;
```

---

## 🧭 Navigation Bar

```css
background-color: #000000;      /* fully black */
color: #FFFFFF;
position: sticky / fixed;
top: 0;
direction: rtl;
padding: 0 40px;
height: ~70px;
```

**Nav links:**
```css
color: #FFFFFF;
font-family: janna-lt-w20-regular, sans-serif;
font-size: ~18-20px;
font-weight: 400;
text-decoration: none;
```

---

## ⏱ Timeline Component

```css
/* Vertical center line */
border-left: 2px dashed #EB1B26;

/* Event label */
color: #FFFFFF;
font-family: janna-lt-w20-regular, sans-serif;
font-size: ~20px;

/* Date */
color: #EB1B26;
font-family: janna-lt-w20-regular, sans-serif;
font-size: ~16px;
```

---

## 📊 Stats / Counter Section

Large numbers displayed in:
```css
font-family: helveticaneueltw20-ligh, sans-serif;
font-size: ~80-100px;
font-weight: 700;
color: #FFFFFF;
/* The "k" suffix in red */
color: #EB1B26;
```

---

## 🦶 Footer

```css
background-color: #000000;
color: #FFFFFF;
direction: rtl;
font-family: janna-lt-w20-regular, sans-serif;
font-size: ~14-16px;
```

Social icons: Instagram, X (Twitter), LinkedIn  
Handle: `@sparkon-kfupm`

---

## 🖼 Imagery Style

- **Industrial / engineering photography** (robotic arms, power lines, wind turbines, oil refineries)
- Dark, moody tone with high contrast
- Images used as **full-bleed section backgrounds** or **card covers**
- Overlay darkening: `rgba(0,0,0,0.4–0.6)` to ensure text readability

---

## 🔣 Iconography & Logo

- Logo: SVG mark with **Sparkon wordmark** in Arabic (سباركون) + "SPARKON" Latin
- Red spark/flame icon element
- Partner logos displayed in **white monochrome** on dark background

---

## 🌐 Localization

- Primary language: **Arabic (AR)**
- Script: **RTL**
- Language switcher via **Weglot** (Arabic / English toggle)
- All UI direction: `direction: rtl; text-align: right;`

---

## 📦 Tech Stack Notes

- Built on **Wix** (parastorage CDN for fonts and assets)
- Fonts served from `static.parastorage.com/fonts/v2/`
- Language switching via `cdn.weglot.com`
- No Google Fonts are used

---

*Style guide extracted from live site — April 2026*
