# M&H Pressing — static preview

> ## This repository is NOT the website and cannot be deployed as one.
>
> It contains **43 flat HTML pages and zero PHP files**. It is a *photograph* of
> the site, published so that tools like PageSpeed Insights and Google's Rich
> Results Test could read the pages from a public address.
>
> The actual website is a **WordPress theme** — 56 PHP files — and it is not in
> this repository.

The live site is https://pressingagadir.ma

## Why this exists

Analysis tools need a public URL. The real site was not deployed yet, so these
pages were captured from a local WordPress install and published here for
measurement only.

Every page carries `noindex, nofollow` so this copy can never be indexed or
compete with the real domain in search.

## What works here

42 pages (14 routes × French/Arabic/English), rendered HTML, JSON-LD structured
data, canonical and hreflang tags, CSS, images, internal links, sitemaps.

## What cannot work here

GitHub Pages serves files; it does not run PHP. So:

- no page can be generated — these are frozen copies
- the booking form renders but cannot be received (the endpoint returns `405`)
- there is no WordPress admin, so nothing can be edited
- 301 / 404 / 410 status codes are not reproduced

## To actually deploy the site

Use the WordPress theme, not this. The deployment guide is `DEPLOYMENT.md` in
the theme project.

Generated from theme commit `eb2591f`.
