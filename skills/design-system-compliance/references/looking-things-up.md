# Looking things up

The design system publishes itself in a machine-readable form. Read it live
rather than trusting any list — including any list in this skill.

Base URL: `https://design-system.service.alpha.gov.bb`

## The contract

Three facts are all you need to find anything:

1. **`/sitemap/` lists every page on the site.** Components, patterns,
   templates, styles, documentation and design-log entries. This is the
   discovery entry point; it needs no maintenance because it is generated from
   the content collections.
2. **Every content page has a raw-markdown twin at the same URL plus `.md`.**
   `/components/button/` → `/components/button.md`. Serves `text/markdown`,
   built for exactly this purpose.
3. **A component's `.md` page contains its canonical markup**, in fenced code
   blocks, with every class it exposes. A ` ```tsx ` fence after an ` ```html `
   one is the React equivalent.

So: `/sitemap/` to find out what exists, then `<page>.md` to read it.

## How to use it

**Do not fetch everything.** The sitemap has around sixty pages. Fetch the
index once to learn what exists, then fetch only the pages for the components
you are actually using.

```
# What exists
/sitemap/                      → every page
/components/                   → the 28 components with one-line descriptions

# What a specific thing is
/components/summary-list.md    → guidance + canonical markup + React tab
/patterns/check-answers.md     → the whole task, already solved
/templates/confirmation.md     → a page to start from
/styles/layout.md              → the grid and width container
/styles/spacing.md             → the spacing scale
/documentation/using-the-design-system.md → install, targets, standards
```

**Copy the markup from the page rather than reconstructing it.** Multi-part
components — date input, number input, file upload, payment, summary section —
have structural requirements that the CSS and the accessibility behaviour both
depend on. The page shows the shape that works.

**Read the guidance, not just the markup.** Each page says when a component is
the _wrong_ answer. `status-banner` looks like the obvious choice for
"application under review" and is actually for service phase (alpha, beta,
migrated); only its page tells you that.

## Design-log decisions are binding

`/design-log/` holds dated decisions that constrain what you build, not just
notes. They are easy to miss because they are not component guidance.

At the time of writing: `no-faqs` (FAQ sections are not used — fix the content
instead) and `short-pages`. Fetch `/sitemap/` for the current list, and read
any entry whose title touches what you are building. A content-led page in
particular should not be written without checking.

## What the site does not currently expose

Two things a crawl cannot get cleanly. Work around them, and note that both are
tracked as site improvements:

- **Token values.** `/styles/tokens.md` carries the prose but not the values —
  the tables are generated into the rendered HTML at build time. Fetch
  `/styles/tokens/` (the HTML page) when you need actual values, or read
  `packages/frontend/src/tokens.css` if you have the repo. The token _names_ and
  the two-tier rule are in the markdown.
- **Per-component margin behaviour.** Not published anywhere. Components differ
  in whether they own a block margin, and it matters for page rhythm — see
  `layout-and-spacing.md`, which is derived from the stylesheets rather than the
  site, and says so.

## When you have the repo checked out

If you are working inside `govbb-design-system` itself, the local source is
ahead of the deployed site — read `packages/frontend/src/` directly. Every
component page on the site also links to its stylesheet on GitHub, so the source
is one hop away even without a checkout.

For service teams consuming the published packages, the site is the better
source: it reflects what is actually released.

## Why this skill holds no component list

An earlier version of this skill shipped a generated index of every component,
class and token. It went out of date three times while the skill was being
written, each time in the same way: a list derived by walking one source missed
whatever that source did not enumerate — BEM child classes, layout utilities,
a component whose stylesheet had no guidance page.

A list of facts about a living system is a liability. The site is generated from
the same source the components are, so reading it live cannot drift. That is
worth one network request.
