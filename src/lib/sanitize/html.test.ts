import { describe, expect, it } from "vitest";

import {
  htmlToPlainText,
  sanitizeBlogHtml,
  sanitizeProductShortHtml,
} from "@/lib/sanitize/html";

describe("sanitizeBlogHtml", () => {
  it("keeps allowed tags and strips disallowed markup", () => {
    const input =
      '<p>Hello <strong>world</strong></p><img src=x onerror=alert(1) /><script>alert(1)</script>';
    expect(sanitizeBlogHtml(input)).toBe("<p>Hello <strong>world</strong></p>");
  });

  it("allows safe anchor hrefs and rejects javascript URLs", () => {
    expect(
      sanitizeBlogHtml(
        '<a href="/blog/post">Local</a><a href="https://example.com">Remote</a>',
      ),
    ).toBe(
      '<a href="/blog/post">Local</a><a href="https://example.com">Remote</a>',
    );

    expect(
      sanitizeBlogHtml('<a href="javascript:alert(1)">Bad</a>'),
    ).toBe("Bad");
  });

  it("removes style blocks and on* handlers", () => {
    expect(
      sanitizeBlogHtml(
        '<p onclick="alert(1)">Text</p><style>.x{color:red}</style>',
      ),
    ).toBe("<p>Text</p>");
  });

  it("preserves lists and headings", () => {
    expect(
      sanitizeBlogHtml(
        "<h2>Title</h2><ul><li>One</li><li>Two</li></ul><blockquote>Quote</blockquote>",
      ),
    ).toBe(
      "<h2>Title</h2><ul><li>One</li><li>Two</li></ul><blockquote>Quote</blockquote>",
    );
  });
});

describe("sanitizeProductShortHtml", () => {
  it("keeps bold, italic, links, and safe text colors", () => {
    expect(
      sanitizeProductShortHtml(
        '<b>Bold</b> <i>Italic</i> <span style="color: #EF4444">Red</span> <a href="https://marco.am">Link</a>',
      ),
    ).toBe(
      '<b>Bold</b> <i>Italic</i> <span style="color: #EF4444">Red</span> <a href="https://marco.am">Link</a>',
    );
  });

  it("converts font color and rgb colors to safe hex spans", () => {
    expect(
      sanitizeProductShortHtml('<font color="#3b82f6">Blue</font>'),
    ).toBe('<span style="color: #3B82F6">Blue</span>');
    expect(
      sanitizeProductShortHtml('<span style="color: rgb(34, 197, 94)">Green</span>'),
    ).toBe('<span style="color: #22C55E">Green</span>');
    expect(
      sanitizeProductShortHtml('<span style="color: rgb(239 68 68)">Red</span>'),
    ).toBe('<span style="color: #EF4444">Red</span>');
  });

  it("keeps bold and italic CSS from the editor", () => {
    expect(
      sanitizeProductShortHtml(
        '<span style="font-weight: bold; font-style: italic; color: #111827">Hi</span>',
      ),
    ).toBe(
      '<span style="color: #111827; font-weight: bold; font-style: italic">Hi</span>',
    );
  });

  it("drops unsafe styles, scripts, and javascript links", () => {
    expect(
      sanitizeProductShortHtml(
        '<span style="color:red;background:url(x)">X</span><script>alert(1)</script><a href="javascript:alert(1)">Bad</a>',
      ),
    ).toBe("XBad");
  });
});

describe("htmlToPlainText", () => {
  it("strips tags for metadata", () => {
    expect(htmlToPlainText("<b>Soft</b> cotton")).toBe("Soft cotton");
  });
});
