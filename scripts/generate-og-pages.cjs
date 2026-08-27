// Three things, all driven by the same book list fetched once:
//
// 1. A static HTML snapshot per book at dist/book/<name>/<id>/index.html
//    with that book's real Open Graph / Twitter Card meta tags baked
//    directly into the initial HTML.
//
//    Why this exists: this app is a client-rendered SPA. Link-preview
//    crawlers (Facebook, WhatsApp, Messenger) do NOT execute JavaScript, so
//    they only ever see whatever raw HTML Firebase Hosting returns for a
//    given URL - the per-page <title>/meta tags react-helmet injects in
//    BookDetails.jsx are invisible to them. Firebase Hosting serves an
//    exact static file match before falling back to the SPA rewrite, so
//    placing a real file at the exact book URL path fixes this without
//    needing Cloud Functions (which would require upgrading off the free
//    Spark plan).
//
//    Each generated file is the real built dist/index.html with only the
//    <title>/meta tags swapped - same JS/CSS bundle references - so human
//    visitors get the exact same working SPA; React Router boots normally
//    and renders the actual BookDetails page. Only what a crawler sees
//    differs.
//
// 2. A plain, unmodified copy of dist/index.html at every other client-side
//    route the SPA defines (dist/books/index.html, dist/dashboard/allOrders/
//    index.html, etc) - see buildShellPages() below for exactly why.
//
// 3. dist/sitemap.xml, overwriting the stale ~24-URL one that was manually
//    generated once (Sept 2024) and never touched again - it had zero of
//    the actual book pages in it, so search engines could only discover
//    them by crawling links, which doesn't work here either: book listing
//    pages paginate via React state, not the URL, so a crawler can only
//    ever see page 1 of any category. Listing every book URL directly in
//    the sitemap sidesteps that entirely.
//
// Runs automatically after `npm run build` via the "postbuild" script in
// package.json - do not run it standalone before building, it needs the
// freshly-built dist/index.html to know the current hashed asset filenames.

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "..", "dist");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");
const API_URL = "https://book-ocean-bd-server.vercel.app/books";
const SITE_URL = "https://bookoceanbd.com";
const FALLBACK_IMAGE = "https://i.ibb.co/yhDbPYf/logo2.jpg";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// matches the same slug pattern used everywhere else in the app
// (Link to={`/book/${name.replace(/\s/g, "_")}/${_id}`})
function slugifyName(name) {
  return (name || "").replace(/\s/g, "_");
}

// matches a whole <meta ...> tag by its property/name attribute, regardless
// of attribute order or whitespace/newlines inside the tag (the source
// index.html spans these across multiple lines, which literal-space regexes
// don't match)
function metaTagRegex(attr, value) {
  return new RegExp(`<meta[^>]*${attr}=["']${value}["'][^>]*>`);
}

function replaceMeta(html, regex, replacement) {
  if (!regex.test(html)) {
    console.warn(`[generate-og-pages] pattern not found in index.html, skipping one replacement: ${regex}`);
    return html;
  }
  return html.replace(regex, replacement);
}

function buildPageFor(book, baseHtml) {
  const title = `Buy ${book.name} by ${book.author} | Book Ocean BD`;
  const description = (book.description || "").replace(/\s+/g, " ").trim().slice(0, 300);
  const image = book.image || FALLBACK_IMAGE;
  const url = `${SITE_URL}/book/${slugifyName(book.name)}/${book._id}`;

  let html = baseHtml;
  // vite.config.js uses base: "/" (root-relative), so every asset reference
  // in the built index.html already resolves correctly regardless of how
  // deep these generated pages live (/book/<name>/<id>/index.html) - no
  // <base> tag shim needed here.
  html = replaceMeta(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, metaTagRegex("property", "og:title"), `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, metaTagRegex("property", "og:description"), `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, metaTagRegex("property", "og:image"), `<meta property="og:image" content="${escapeHtml(image)}" />`);
  html = replaceMeta(html, metaTagRegex("property", "og:url"), `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = replaceMeta(html, metaTagRegex("name", "twitter:title"), `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, metaTagRegex("name", "twitter:image"), `<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  return html;
}

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/books", priority: "0.9", changefreq: "daily" },
  { path: "/search", priority: "0.5", changefreq: "monthly" },
  { path: "/login", priority: "0.3", changefreq: "yearly" },
  { path: "/signup", priority: "0.3", changefreq: "yearly" },
];

// Routes that need a physical index.html on disk purely so a hard
// reload/deep link/bookmark doesn't 404 - NOT meant for search engines
// (dashboard pages are behind client-side auth, checkout has no content
// worth indexing), so these are deliberately kept out of the sitemap.
//
// Why this is needed at all: the site's .htaccess has a standard SPA
// catch-all rewrite (any unmatched path -> /index.html), which is correct
// and is exactly what makes /book/<name>/<id>/ work when that literal file
// doesn't exist. But Hostinger's "hcdn" edge layer in front of this hosting
// account was found to serve its own canned 404 for any path that isn't a
// literal file on disk, WITHOUT ever invoking Apache/.htaccess to run that
// rewrite - confirmed by every non-root, non-pre-generated route 404ing on
// direct load (e.g. reloading /dashboard/allOrders) while a literal file
// path like /book/women/<id>/ works fine. Since hcdn only serves what
// physically exists, the fix is the same one already used for book pages:
// put a real file at each of these URLs. It's the exact same built SPA
// shell - React Router boots normally and renders whatever route matches
// the current URL, same as if index.html rewrite had worked.
const SHELL_ROUTES = [
  "/books",
  "/search",
  "/login",
  "/signup",
  "/checkout",
  "/dashboard/adminhome",
  "/dashboard/addBook",
  "/dashboard/addBanner",
  "/dashboard/manageBanner",
  "/dashboard/manageBooks",
  "/dashboard/allUsers",
  "/dashboard/allOrders",
  "/dashboard/userhome",
  "/dashboard/orderHistory",
  "/dashboard/myProfile",
];

function buildShellPages(baseHtml, categories) {
  const routes = [
    ...SHELL_ROUTES,
    // /books/:category is also dynamic but fully enumerable from the live
    // category list, same idea as the per-book pages above
    ...categories.map((category) => `/books/${category}`),
  ];
  let count = 0;
  for (const route of routes) {
    const dir = path.join(DIST_DIR, ...route.split("/").filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), baseHtml);
    count++;
  }
  return count;
}

function xmlEscape(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSitemap(books) {
  const today = new Date().toISOString().slice(0, 10);
  const categories = [...new Set(books.map((b) => b.category).filter(Boolean))];

  const urlEntries = [
    ...STATIC_ROUTES.map(({ path: p, priority, changefreq }) => ({
      loc: `${SITE_URL}${p}`,
      priority,
      changefreq,
    })),
    ...categories.map((category) => ({
      loc: `${SITE_URL}/books/${encodeURIComponent(category)}`,
      priority: "0.7",
      changefreq: "weekly",
    })),
    ...books
      .filter((b) => b._id && b.name)
      .map((book) => ({
        loc: `${SITE_URL}/book/${slugifyName(book.name)}/${book._id}`,
        priority: "0.8",
        changefreq: "weekly",
      })),
  ];

  const body = urlEntries
    .map(
      ({ loc, priority, changefreq }) => `<url>
<loc>${xmlEscape(loc)}</loc>
<lastmod>${today}</lastmod>
<changefreq>${changefreq}</changefreq>
<priority>${priority}</priority>
</url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function main() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`[generate-og-pages] ${INDEX_HTML_PATH} not found - run "npm run build" first.`);
    process.exit(1);
  }
  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");

  console.log("[generate-og-pages] fetching book list...");
  const res = await fetch(API_URL);
  if (!res.ok) {
    console.error(`[generate-og-pages] failed to fetch books: HTTP ${res.status} - skipping (build output is still valid, just without per-book preview pages)`);
    return;
  }
  const books = await res.json();
  console.log(`[generate-og-pages] generating preview pages for ${books.length} books...`);

  let ok = 0;
  let skipped = 0;
  for (const book of books) {
    if (!book._id || !book.name) {
      skipped++;
      continue;
    }
    const dir = path.join(DIST_DIR, "book", slugifyName(book.name), String(book._id));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), buildPageFor(book, baseHtml));
    ok++;
  }
  console.log(`[generate-og-pages] done - ${ok} pages generated${skipped ? `, ${skipped} skipped (missing id/name)` : ""}.`);

  const categories = [...new Set(books.map((b) => b.category).filter(Boolean))];
  const shellCount = buildShellPages(baseHtml, categories);
  console.log(`[generate-og-pages] wrote ${shellCount} SPA shell pages (fixes hard-reload 404s on routes with no matching literal file).`);

  const sitemapPath = path.join(DIST_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, buildSitemap(books));
  console.log(`[generate-og-pages] wrote sitemap.xml with ${STATIC_ROUTES.length} static + ${new Set(books.map((b) => b.category)).size} category + ${ok} book URLs.`);
}

main().catch((err) => {
  // never fail the build over this - a missing preview page is much better
  // than a broken deploy
  console.error("[generate-og-pages] failed, continuing anyway:", err.message);
});
