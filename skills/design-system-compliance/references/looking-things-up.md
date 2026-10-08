# Looking things up

Base URL: `https://design-system.service.alpha.gov.bb`.

## Discover once, retrieve selectively

Fetch `/llms.txt` first. It groups the available documentation, styles,
components, patterns, templates, public skills and design decisions, with links
to Markdown pages and package versions for the documentation build. Follow
those links rather than reconstructing a component inventory or fetching every
page. `/sitemap/` is a human-readable fallback if the index is unavailable.

Content Markdown replaces the trailing slash with `.md`, including nested
styles such as `/styles/typography/lists.md`. Section indexes do not necessarily
have Markdown twins. Useful starting points after discovery are:

| Need                                            | Page                                            |
| ----------------------------------------------- | ----------------------------------------------- |
| Adoption and rendering targets                  | `/documentation/using-the-design-system.md`     |
| Form semantics and submission                   | `/documentation/form-implementation.md`         |
| Page structure and spacing                      | `/styles/layout.md`, `/styles/spacing.md`       |
| Token names, declared/resolved values and notes | `/styles/tokens.md`                             |
| A task or page scaffold                         | The relevant pattern or template from the index |
| Component markup and React equivalent           | The relevant component's `.md` page             |
| Dated guidance decisions                        | The relevant `/design-log/<slug>.md` page       |

Read usage guidance as well as examples. HTML and TSX code fences describe the
two rendering targets. Interactive examples link to their rendered HTML page;
open it when interaction or layout matters.

## Separate documentation from installed capabilities

The live site is not an archive pinned to the consumer's installed release.
Check `package.json`, the lockfile and the actual resolved packages before
copying names, props, imports or behaviour. The index's versions tell you what
built the documentation. They do not authorize an upgrade.

Verify CSS names and tokens through the installed frontend package, React props
through its installed types/source, and enhancement through the frontend entry
point. Prefer exported paths such as `@govtech-bb/frontend/css` and
`@govtech-bb/frontend/tokens.css`; resolve them from the consumer directory.
Check that `@govtech-bb/frontend/tailwind` exists before using that integration.
A local checkout can be ahead of or behind both npm and the live site.

When documentation and installed code disagree, record the versions and the
specific difference. Use an existing supported alternative where possible;
propose an upgrade only when it is needed for the requested task. A documented
class with no CSS rule is an inconsistency to investigate, not an instruction
to invent a local implementation under the `govbb-` prefix.

## Design decisions and spacing

Read relevant design-log entries before choosing content or journey structure.
Their date and kind matter: a `decision` records guidance, while research and
notes do not automatically impose requirements. Check later relevant decisions
before treating an older entry as current. Preserve the user's scope when a
change suggested by guidance would require a larger migration.

For spacing behaviour, inspect the installed base, layout and component CSS.
Token tables give values; they do not tell you whether a component already owns
a margin. Where a source comment and shipped declarations disagree, record the
mismatch and use the declarations to understand rendered behaviour.

## Offline or unavailable index

1. If `/llms.txt` is unavailable but the site works, use `/sitemap/` and known
   Markdown routes. State that discovery used the fallback.
2. If a GovBB source checkout exists, read guidance under
   `apps/site/src/content/`, frontend sources under `packages/frontend/`, and
   React source/types under `packages/react/`. Check its version against the
   consumer before copying an API.
3. If only packages are installed, read their exports, shipped CSS, tokens,
   types and source. This verifies available capabilities, not all usage
   guidance. Mark inferred component choices for later documentation review.
4. If neither guidance nor package evidence is available, inventory the current
   interface and explain the missing verification. Do not invent GovBB names
   or claim compliance from memory.

Public skill Markdown pages show only their entrypoints. Use `npx skills` for
installation so references and scripts accompany the skill.
