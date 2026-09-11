# M&H Pressing — static preview

A read-only snapshot of the M&H Pressing (Agadir) WordPress theme, published here
so the pages can be run through external analysis tools — PageSpeed Insights, the
Rich Results Test, crawlers — before the real deployment.

**This is not the live site.** The live site is https://pressingagadir.ma

Every page carries `noindex, nofollow` so this copy can never be indexed or
compete with the real domain in search.

## What works

42 pages (14 routes × FR/AR/EN), rendered HTML, JSON-LD structured data,
canonical and hreflang tags, CSS, images, internal links, sitemaps.

## What does not

GitHub Pages serves static files only, so the PHP is not running here:

- the booking form renders but cannot submit (no REST endpoint)
- 301/404/410 status codes are not reproduced (verified locally instead)
- no WordPress admin

Generated from theme commit `785b0bb`.
