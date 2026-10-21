AUKLET FIXED FILES

IMPORTANT: This package uses the complete HTML template with a separate app.js file. Do not mix these files with older versions.

GitHub upload: replace the repository root index.html, app.js, manifest.json, and sw.js with these four files. Keep all four at the repository root.

This should fix raw Vue template expressions by matching index.html to its correct app.js. Sports scores remain sample/demo data, not verified live scores.

After committing, open the Pages website and refresh with a cache-busting query such as ?v=2. If an old service worker is still cached, browser site data may need clearing.
