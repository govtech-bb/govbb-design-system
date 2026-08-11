# Looking things up

The design system publishes itself in a machine-readable form. Read it live
rather than trusting any list — including any list in this skill.

Base URL: `https://design-system.service.alpha.gov.bb`

## The contract

Three facts are all you need to find anything:

1. **`/sitemap/` lists every page on the site.** Components, patterns,
   templates, styles, documentation and design-log entries. It is generated from
   the content collections, so it needs no maintenance, and it is the only
   discovery mechanism the site offers — there is no `llms.txt`, no
   `sitemap.xml` and no per-section `index.md`. Those all return 404, so do not
   spend requests on them.
2. **Content pages have a raw-markdown twin at the same URL plus `.md`.**
   `/components/button/` → `/components/button.md`. Serves `text/markdown`,
   built for exactly this purpose. It covers the five sections generated from
   markdown — `/components/`, `/patterns/`, `/templates/`, `/styles/` and
   `/documentation/` — including nested pages such as
   `/styles/typography/lists.md`. Section index pages (`/components.md`) and
   design-log entries (`/design-log/no-faqs.md`) have no twin; read those as
   HTML.
3. **A component's `.md` page contains its canonical markup**, in fenced code
   blocks, with every class it exposes. A ` ```tsx ` fence after an ` ```html `
   one is the React equivalent.

So: `/sitemap/` to find out what exists, then `<page>.md` to read it.

## Discovery is the rough edge

Everything else here is clean markdown; `/sitemap/` alone is an HTML page, so
this one step means parsing markup. Worth knowing in advance so it does not read
as a broken endpoint. Every page URL ends in a trailing slash, which is enough
to separate the links you want from the noise:

```sh
curl -s https://design-system.service.alpha.gov.bb/sitemap/ \
  | grep -oE 'href="/[a-z0-9/-]+/"' | sort -u
```

The trailing slash excludes the `/_astro/` build assets and the `#main-content`
skip link; `sort -u` absorbs the header and footer navigation, which only
repeats the section indexes. That leaves around seventy-five paths — roughly
sixty content pages, plus the indexes and site furniture such as `/support/`.
If your fetch tool hands you rendered text rather than raw HTML you still get
the list, as a nested set of page titles you can map back to slugs; grep the
HTML when you can, since it is more reliable.

## How to use it

**Do not fetch everything.** Fetch the index once to learn what exists, then
fetch only the pages for the components you are actually using.

```
# What exists
/sitemap/                      → every page
/components/                   → every component, with one-line descriptions

# What a specific thing is
/components/summary-list.md    → guidance + canonical markup + React tab
/patterns/check-answers.md     → the whole task, already solved
/templates/confirmation.md     → a page to start from
/styles/layout.md              → the grid and width container
/styles/spacing.md             → the spacing scale
/documentation/using-the-design-system.md → install, targets, standards
/design-log/                   → binding decisions (HTML only, no .md twin)
```

**Copy the markup from the page rather than reconstructing it.** Multi-part
components — date input, number input, file upload, payment, summary section —
have structural requirements that the CSS and the accessibility behaviour both
depend on. The page shows the shape that works.

**Read the guidance, not just the markup.** Each page says when a component is
the _wrong_ answer. `status-banner` looks like the obvious choice for
"application under review" and is actually for service phase (alpha, beta,
migrated); only its page tells you that.

## Read the design log before writing content

`/design-log/` holds dated decisions that constrain what you build. They are
binding — a decision recorded there has already been argued and settled, and a
page that contradicts one is wrong however good it looks. They are easy to miss
because they are not component guidance and nothing in the markup points at
them.

So treat this as part of the lookup, not an optional extra: fetch `/sitemap/`
for the current set of entries and read any whose title touches what you are
building. `no-faqs` alone rules out a whole page section people reach for by
default — an FAQ list is not a formatting choice available to you, it is a
content bug to fix at source. There were two entries when this was written;
assume the set has grown, which is why it comes from the sitemap rather than
from here.

A content-led page should not be written without this check. Skip it and you can
produce something entirely valid class-by-class that still has to be thrown
away.

## What the site does not currently expose

Two things a crawl cannot get cleanly. Work around them, and note that both are
tracked as site improvements:

- **Token values.** `/styles/tokens.md` carries the prose but not the values —
  the tables are generated into the rendered HTML at build time. Fetch
  `/styles/tokens/` (the HTML page) when you need actual values, or read
  `packages/frontend/src/tokens.css` if you have the repo. The token _names_ and
  the two-tier rule are in the markdown.
- **Per-component margin behaviour, and whether content elements carry their own
  margins.** Not published anywhere. Components differ in whether they own a
  block margin, and it decides how much spacing CSS a page needs — so read it
  from the stylesheets each time. Step 4 of `SKILL.md` gives the three questions
  to answer and warns that the source is currently inconsistent about it. This
  skill deliberately keeps no summary of it: one existed, and it stated the
  strategy backwards within days of the base stylesheet changing.

## If the site is unreachable

This skill depends on a network request, and that request can fail: no
connection, DNS failure, the site down, a sandbox without egress, or no fetch
tool available at all. Work down these rungs in order and use the first that is
open to you.

**1. Fetch the site.** The normal path, and the only one that gives you both
the class names and the guidance about when to use them.

**2. Read the source locally, if it is on disk.** Two shapes of local copy, and
they are not equivalent:

- **The `govbb-design-system` repo checked out.** This loses you nothing.
  Classes are in `packages/frontend/src/components/*/*.css` (plus `layout.css`
  and `utilities.css` for the layout and type utilities); tokens in
  `packages/frontend/src/tokens.css`; and the guidance pages themselves — the
  same markdown the site serves — in `apps/site/src/content/`. It can run ahead
  of the deployed site, which cuts both ways: if you are writing code for a
  service that installs the published package, something present here may not
  be released yet, so prefer the site whenever you can reach it.
- **A service repo with the package installed.** `@govtech-bb/frontend` ships
  its sources, so `node_modules/@govtech-bb/frontend/src/` gives you the same
  CSS and tokens, and `dist/govbb.css` is a complete list of every class that
  exists. What you do not get is the guidance, so component _choice_ and markup
  structure become inferences from CSS. Say so in your report: note which
  components you assembled from stylesheets rather than copying from a
  canonical example, so someone can check them against the site later.

**3. If neither is available, stop and say so.** Report that you could not
reach the design system, that you therefore cannot verify a single class name,
and ask how to proceed.

Do not continue from memory. You have a rough sense of what these classes look
like, and that is exactly the trap: the names you would produce are fluent,
correctly prefixed, plausible to a reviewer — and mostly wrong. Wrong ones
render as unstyled markup and assert that the design system supports components
it does not, a claim that outlives the pull request. Worse, the output _looks
finished_, so nobody re-checks it and the whole conversion has to be redone once
someone notices. Stopping costs one message; guessing costs the work twice and
leaves misinformation in the codebase in between.

You can still make real progress offline: inventory the prototype and describe
every distinct UI element by behaviour rather than by name. That is the slow half
of the job, it needs no network, and it hands over ready to be matched against
the system the moment the site is reachable.

## Why this skill holds no component list

An earlier version of this skill shipped a generated index of every component,
class and token. It went out of date three times while the skill was being
written, each time in the same way: a list derived by walking one source missed
whatever that source did not enumerate — BEM child classes, layout utilities,
a component whose stylesheet had no guidance page.

A list of facts about a living system is a liability. The site is generated from
the same source the components are, so reading it live cannot drift. That is
worth one network request — and when that request is impossible, it is worth
saying so rather than substituting a list from memory.
