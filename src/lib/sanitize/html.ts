const BLOG_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "a",
  "blockquote",
]);

const PRODUCT_SHORT_TAGS = new Set([
  "p",
  "div",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "a",
  "span",
  "font",
]);

const VOID_TAGS = new Set(["br"]);

const TAG_REGEX = /<\/?([a-zA-Z][\w:-]*)\b([^>]*)>/g;
const EVENT_HANDLER_REGEX =
  /\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const RGB_REGEX =
  /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[,/]\s*[\d.]+)?\s*\)$/i;
const FONT_WEIGHT_SAFE = /^(bold|bolder|600|700|800|900)$/i;
const FONT_STYLE_SAFE = /^(italic|oblique)$/i;

type HtmlSanitizeConfig = {
  allowedTags: ReadonlySet<string>;
  formatOpenTag: (tag: string, attrs: string) => string | null;
};

function stripScriptAndStyle(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
}

function stripEventHandlers(html: string): string {
  return html.replace(EVENT_HANDLER_REGEX, "");
}

function parseAttr(attrs: string, name: string): string | null {
  const pattern = new RegExp(
    `\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = attrs.match(pattern);
  if (!match) return null;
  return match[2] ?? match[3] ?? match[4] ?? null;
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  const lower = value.toLowerCase().replace(/\s+/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return /^https?:\/\//i.test(value);
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toHexChannel(value: number): string {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function expandHex(hex: string): string | null {
  const raw = hex.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(raw)) {
    const r = raw[1];
    const g = raw[2];
    const b = raw[3];
    if (!r || !g || !b) return null;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

function rgbToHex(value: string): string | null {
  const match = value.trim().match(RGB_REGEX);
  if (!match) return null;
  const red = Number(match[1]);
  const green = Number(match[2]);
  const blue = Number(match[3]);
  if ([red, green, blue].some((channel) => channel < 0 || channel > 255)) {
    return null;
  }
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
}

function parseSafeColor(raw: string): string | null {
  return expandHex(raw) ?? rgbToHex(raw);
}

function parseStyleToken(
  style: string,
  property: string,
): string | null {
  const match = style.match(
    new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "i"),
  );
  const value = match?.[1]?.trim();
  return value ? value : null;
}

function parseSafeTextStyle(attrs: string): string | null {
  const style = parseAttr(attrs, "style");
  if (style && /url\s*\(|expression\s*\(/i.test(style)) return null;

  const color =
    (style ? parseSafeColor(parseStyleToken(style, "color") ?? "") : null) ??
    (parseAttr(attrs, "color")
      ? parseSafeColor(parseAttr(attrs, "color") ?? "")
      : null);
  const fontWeight = style
    ? parseStyleToken(style, "font-weight")
    : null;
  const fontStyle = style ? parseStyleToken(style, "font-style") : null;

  const declarations: string[] = [];
  if (color) declarations.push(`color: ${color}`);
  if (fontWeight && FONT_WEIGHT_SAFE.test(fontWeight)) {
    declarations.push(`font-weight: ${fontWeight.toLowerCase()}`);
  }
  if (fontStyle && FONT_STYLE_SAFE.test(fontStyle)) {
    declarations.push(`font-style: ${fontStyle.toLowerCase()}`);
  }
  if (declarations.length === 0) return null;
  return declarations.join("; ");
}

function formatAnchor(attrs: string): string | null {
  const href = parseAttr(attrs, "href");
  if (!href || !isSafeHref(href)) return null;
  return `<a href="${escapeHtmlAttr(href)}">`;
}

function formatColorSpan(attrs: string): string | null {
  const rawStyle = parseAttr(attrs, "style");
  if (rawStyle && /url\s*\(|expression\s*\(/i.test(rawStyle)) return null;
  const style = parseSafeTextStyle(attrs);
  if (!style) return "<span>";
  return `<span style="${style}">`;
}

function sanitizeWithConfig(html: string, config: HtmlSanitizeConfig): string {
  let input = stripScriptAndStyle(html);
  input = stripEventHandlers(input);

  let result = "";
  let lastIndex = 0;
  const openTags: string[] = [];
  let match: RegExpExecArray | null;

  TAG_REGEX.lastIndex = 0;
  while ((match = TAG_REGEX.exec(input)) !== null) {
    result += input.slice(lastIndex, match.index);

    const full = match[0];
    const isClosing = full.startsWith("</");
    const tag = (match[1] ?? "").toLowerCase();
    const attrs = match[2] ?? "";
    const outputTag = tag === "font" ? "span" : tag;

    if (isClosing) {
      if (config.allowedTags.has(tag) && !VOID_TAGS.has(tag)) {
        const index = openTags.lastIndexOf(outputTag);
        if (index !== -1) {
          openTags.splice(index, 1);
          result += `</${outputTag}>`;
        }
      }
    } else if (config.allowedTags.has(tag)) {
      if (VOID_TAGS.has(tag)) {
        result += `<${tag}>`;
      } else {
        const open = config.formatOpenTag(tag, attrs);
        if (open) {
          result += open;
          openTags.push(outputTag);
        }
      }
    }

    lastIndex = TAG_REGEX.lastIndex;
  }

  result += input.slice(lastIndex);
  return result;
}

/** Allowlists blog HTML and strips scripts, styles, and unsafe attributes. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeWithConfig(html, {
    allowedTags: BLOG_TAGS,
    formatOpenTag: (tag, attrs) => {
      if (tag === "a") return formatAnchor(attrs);
      return `<${tag}>`;
    },
  });
}

/** Allowlists product short-text HTML: bold, italic, links, and selection colors. */
export function sanitizeProductShortHtml(html: string): string {
  return sanitizeWithConfig(html, {
    allowedTags: PRODUCT_SHORT_TAGS,
    formatOpenTag: (tag, attrs) => {
      if (tag === "a") return formatAnchor(attrs);
      if (tag === "span" || tag === "font") return formatColorSpan(attrs);
      return `<${tag}>`;
    },
  });
}

/** Strips markup for metadata and JSON-LD. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>|<\/div>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
