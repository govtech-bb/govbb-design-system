# Changelog

## 1.0.0-alpha.22 (2026-08-21)

### button
- Space button groups 24px apart by @AaronHarris

### date-input
- Explain the fieldset's explicit group role by @AaronHarris

### file-upload
- Always give remove buttons an accessible name by @AaronHarris

### form
- Mark optional fields with an (optional) label suffix by @AaronHarris

### header
- Read the hydration signal with useSyncExternalStore by @AaronHarris

### input
- Add prefix and suffix adornments by @AaronHarris

### layout
- Keep the width container full width inside the page column by @AaronHarris

### service-heading
- Add the service heading component by @AaronHarris

### site
- Publish the AI skills section from the skills themselves by @Tarika
- Replace widened lookups with maps and new Function with a vite-ignored import by @AaronHarris
- Apply the search result styles to runtime-rendered results by @Tarika
- Keep the design system focus state on search result links by @Tarika
- Centre the primary nav past the width container cap by @Tarika

### table
- Label the scroll region with the caption element by @AaronHarris

### tokens
- Rename the colour ramp to figma's 10-90 steps and fill the gaps by @AaronHarris

### General
- Add an accessibility-review skill for WCAG 2.2 AA reviews by @Tarika
- Make the govbb plugin load on older Claude Code versions by @Tarika
- Stop the plugin description naming skills that do not exist by @Tarika
- Remove the ambiguous regex CodeQL flagged in the focus walk by @Tarika
- Pick the newest axe-core in the pnpm store, not the last alphabetically by @Tarika
- Trace repeated accessibility defects to their shared source by @Tarika
- Plan the design-system AI skills and record where they live by @Tarika
- Add the design-system-compliance skill by @Tarika
- Add the skill eval harness and its grader by @Tarika
- Stop the eval grader passing checks it never performed by @Tarika
- Stop the eval grader crashing on a symlinked node_modules by @Tarika
- Remove the skill eval harness by @Tarika
- Teach the compliance skill where things go on a page by @Tarika
- Use import.meta.dirname in the vitest config by @AaronHarris
- Read svg-safe class names in the focus-order script by @AaronHarris
- Drop the unused prop-types dependency by @AaronHarris
- Keep the compliance skill from overruling the docs site by @Tarika
- Move the compliance skill's reference material out of SKILL.md by @Tarika
- Align the form templates with the pattern library by @AaronHarris
- Install the packages from the alpha tag by @AaronHarris
- Update visual regression baselines by @github-actions[bot]
## 1.0.0-alpha.21 (2026-07-28)

### button
- Pad the text variant like the other buttons by @AaronHarris
- Hold the text button's colour on hover and press by @AaronHarris
- Outline the tertiary button in forced-colors mode by @AaronHarris
- Document the text, negative and inverse variants by @AaronHarris

### form
- Space a fieldset hint like a form field hint by @AaronHarris

### header
- Match responsive navigation design by @AaronHarris
- Shorten the nav link comment by @AaronHarris

### General
- Update visual regression baselines by @github-actions[bot]
- Release v1.0.0-alpha.21 by @github-actions[bot]
## 1.0.0-alpha.20 (2026-07-28)

### header
- Restore responsive navigation by @AaronHarris

### General
- Release v1.0.0-alpha.20 by @github-actions[bot]
## 1.0.0-alpha.19 (2026-07-28)

### format
- Ignore generated changelog by @AaronHarris

### General
- Push annotated release tags and mark alpha releases as prereleases by @AaronHarris
- **Breaking:** Align component APIs with existing consumers by @AaronHarris
- Release v1.0.0-alpha.19 by @github-actions[bot]
## 1.0.0-alpha.18 (2026-07-28)

### back-button
- Add vanilla css back button styles by @Work
- Use the figma swept arrow and share the link states by @Work
- Keep the arrow visible in forced-colors mode by @AaronHarris
- Add linkComponent by @AaronHarris

### banner
- Use official coat of arms in the gov banner by @TarikaBirch
- Use the navy brand blue for the gov banner background by @TarikaBirch

### breadcrumbs
- Add vanilla css breadcrumb trail styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Wrap long labels whole instead of breaking every word by @AaronHarris
- Render crumbs through a linkComponent by @AaronHarris
- Mark current page crumb with aria-current by @AaronHarris

### button
- Use the real @govtech-bb/styles library, not placeholder CSS by @TarikaBirch
- Add real button styles with secondary, tertiary and link variants by @Work
- Forward the ref from the react wrapper by @AaronHarris
- Fold the button group into the button component by @AaronHarris
- Note that aria-disabled still fires on keyboard by @AaronHarris
- Add LinkButton for the start-button pattern by @AaronHarris
- Add linkComponent to link button by @AaronHarris

### button-group
- Add vanilla css button group layout by @Work
- Add react wrapper by @AaronHarris

### checkbox
- Add checkbox component documentation page by @Work
- Add vanilla css checkbox styles by @Work
- Merge checkbox and radio styles into one shared file by @AaronHarris
- Add react wrapper by @AaronHarris
- Add CheckboxGroup fieldset wrapper by @AaronHarris
- Add per-option hints with aria-describedby support by @AaronHarris
- Keep checked marks visible in forced-colors mode by @AaronHarris
- Wire the group hint to the fieldset in examples by @AaronHarris
- Drop group hint when an error is shown by @AaronHarris
- Add conditional reveal by @AaronHarris
- Announce group error and forward fieldset ref and props by @AaronHarris

### css
- Ensure stylesheet remains unlayered to prevent consumer resets from outranking components by @AaronHarris

### date-input
- Add date input component documentation page by @Work
- Announce hint and error text to screen readers by @Work
- Add vanilla css date input styles by @Work
- Reuse the shared text input styles for date fields by @AaronHarris
- Add react wrapper by @AaronHarris
- Support an error message in the react wrapper by @AaronHarris
- Respect consumer-supplied ids on the day, month and year inputs by @AaronHarris
- Add bday autocomplete to date of birth examples by @AaronHarris
- Drop hint when an error is shown by @AaronHarris
- Add controlled value object, name prefix and iso format helpers by @AaronHarris
- Forward fieldset attributes and ref props by @AaronHarris

### docs
- Scaffold Storybook documentation site (#113) by @TarikaBirch

### error-summary
- Add error summary component documentation page by @Work
- Add vanilla css error summary styles by @Work
- Add react wrapper by @AaronHarris
- Always show the summary on a failed submission by @AaronHarris
- Compose error links with the link component by @AaronHarris
- Focus the field on link click, add onErrorClick by @AaronHarris
- Focus non-focusable targets and label the alert by @AaronHarris

### example
- Show code below preview with language tabs by @TarikaBirch
- Left-align previews, auto-fit height, resize and open-in-new-tab by @AaronHarris
- Add src mode embedding a real route in the preview iframe by @AaronHarris
- Drop the page flag and blob open-in-tab machinery by @AaronHarris

### feedback
- Add the Was this helpful feedback block by @AaronHarris
- Document the feedback block by @AaronHarris

### file-upload
- Add file upload component documentation page by @Work
- Give the file input a single accessible name by @Work
- Add vanilla css file upload styles with visible keyboard focus by @Work
- Add react wrapper by @AaronHarris
- Add chosen-file list progressive enhancement module by @AaronHarris
- Name each remove button after its file for screen readers by @AaronHarris
- Name each remove button after its file in the react wrapper by @AaronHarris
- Announce file removal and keep keyboard focus by @AaronHarris
- Remove hint from the error example by @AaronHarris

### footer
- Add dark blue site footer styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Run the mobile divider full-bleed at every viewport width by @AaronHarris
- Render footer links through a linkComponent by @AaronHarris
- Reuse govbb-link for footer links instead of drifting by @AaronHarris
- Apply govbb-link on the footer link markup by @AaronHarris

### form
- Add shared label, hint, error message and fieldset styles by @Work
- Add react wrapper by @AaronHarris
- Render hint and error text as span, not p or div by @AaronHarris
- Space stacked form groups by @AaronHarris
- Correct fieldset legend spacing by @AaronHarris
- Announce error messages with a hidden error prefix by @AaronHarris
- Make field hint and error mutually exclusive by @AaronHarris
- Default composed field ids to the name by @AaronHarris

### frontend
- Ship favicon, app icons and web manifest by @AaronHarris
- Harden consumer runtime behavior by @AaronHarris

### header
- Add gold site header styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Render the home link through a linkComponent by @AaronHarris
- Match the Figma design and add a nav slot by @AaronHarris
- Add a progressive-enhancement Menu toggle by @AaronHarris
- Make the Menu toggle universal with a full-width nav band by @AaronHarris

### input
- Add input component documentation page by @Work
- Add vanilla css text input styles by @Work
- Add react wrapper by @AaronHarris
- Compose label, hint and error when given them by @AaronHarris
- Drop hint when an error is shown by @AaronHarris

### label
- Add label component documentation page by @Work
- Use a label-focused example instead of duplicating input's by @Work

### layout
- Add the main wrapper and a 12-column grid by @AaronHarris
- Demo the grid in the playground by @AaronHarris
- Add from-desktop grid column variants by @AaronHarris
- Make the width container fluid with clamped gutters per the figma frames by @AaronHarris
- Cap the width container at the desktop frame by @AaronHarris
- Pin the footer to the viewport bottom on short pages by @AaronHarris

### link
- Add opt-in link styles with hover and focus highlight states by @AaronHarris
- Add react wrapper by @AaronHarris
- Focus links with the gold highlight instead of the outline ring by @AaronHarris
- Adapt link states to dark and tinted surfaces per the Figma links sheet by @AaronHarris
- Add a linkComponent escape hatch for client-side routing by @AaronHarris

### list
- Add plain, bullet and numbered list styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Add the missing component page by @AaronHarris
- Keep list semantics on the plain variant by @AaronHarris

### number-input
- Add number input component documentation page by @Work
- Name the stepper group and document required JS by @Work
- Add vanilla css number input styles by @Work
- Add react wrapper by @AaronHarris
- Add stepper progressive enhancement module by @AaronHarris
- Document the stepper runtime the package ships by @AaronHarris
- Show the focus ring on keyboard focus only by @AaronHarris
- Emit both input and change events from the steppers by @AaronHarris

### official-banner
- Add official government website banner styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Add linkComponent by @AaronHarris

### patterns
- Add the pattern library composed from the Figma designs by @AaronHarris

### payment
- Add the payment component by @AaronHarris
- Document payment as a component, not a pattern by @AaronHarris
- Document how to announce the payment outcome by @AaronHarris
- Add react wrapper by @AaronHarris

### pill
- Add vanilla css status pill styles by @Work
- Match the quiet grey service-type label from the figma by @Work
- Remove the pill component by @AaronHarris

### radio
- Add radio component documentation page by @Work
- Use shipped govbb-hint for per-option hints by @Work
- Add vanilla css radio styles by @Work
- Add react wrapper by @AaronHarris
- Support a per-option hint in the react wrapper by @AaronHarris
- Expose the conditional reveal state to assistive tech by @AaronHarris
- Add RadioGroup for controlled single-choice groups by @AaronHarris
- Drop invalid aria-expanded from conditional radios by @AaronHarris
- Drop group hint when an error is shown by @AaronHarris
- Announce group error and forward fieldset ref and props by @AaronHarris

### react
- Export the new form composition components by @AaronHarris
- Export Heading, Text and the LinkComponent type by @AaronHarris
- List payment and skip-link wrappers in readme and migration guide by @AaronHarris
- Keep control input types fixed by @AaronHarris

### search
- Add alpha.gov.bb search bar with Pagefind results by @TarikaBirch
- Add joined search input and button styles by @AaronHarris
- Add react wrapper by @AaronHarris
- Add disabled states and the search landmark role by @AaronHarris

### select
- Add select component documentation page by @Work
- Make the placeholder option non-selectable by @Work
- Add vanilla css select styles by @Work
- Paint hover as a plain inset shadow instead of re-declaring the chevron layers by @AaronHarris
- Confine the hover shadow to the field, keeping one layer stack by @AaronHarris
- Add react wrapper by @AaronHarris
- Compose label, hint and error when given them by @AaronHarris
- Fall back to the native arrow in forced-colors mode by @AaronHarris
- Drop hint when an error is shown by @AaronHarris
- Add options prop by @AaronHarris

### service-list
- Add the service navigation list with whole-card links by @AaronHarris
- Document the service list and whole-card click by @AaronHarris
- Keep hover and focus on the link and bold the link text by @AaronHarris
- Put padding on a wrapper so the whole padded card is clickable by @AaronHarris
- Add the signpost variant for in-category links by @AaronHarris
- Document the signpost variant by @AaronHarris
- Drop standalone code examples the site cannot render by @AaronHarris

### show-hide
- Add show/hide component documentation page by @Work
- Add vanilla css show/hide styles by @Work
- Add react wrapper by @AaronHarris

### site
- Scaffold bespoke Astro documentation site (#123) by @TarikaBirch
- Address code-review findings (#123) by @TarikaBirch
- Resolve second-round code-review findings (#123) by @TarikaBirch
- Use real @govtech-bb/styles tokens, font, and crest by @Work
- Reserve crest space and shrink the crest svg by @Work
- Route the changelog through an explore card, not homepage feeds by @Work
- Give the search bar the design system focus ring by @Work
- Move the primary nav to its own bar under the header by @Work
- Show the component index as grouped cards by @Work
- Keep placeholder links inert in the example preview by @Work
- Type the token note as optional so astro check passes by @AaronHarris
- Add view source and view as markdown links to article pages by @AaronHarris
- Redesign documentation experience by @AaronHarris
- Improve documentation guidance by @AaronHarris
- Document and wrap fieldsets by @AaronHarris
- Add comprehensive forms guidance by @AaronHarris
- Add form field anatomy diagram by @AaronHarris
- Redraw form field anatomy with labelled callouts by @AaronHarris
- Replace changelog with design log by @AaronHarris
- Lift code-block comment colour to meet contrast minimum by @AaronHarris
- Style example previews opened in a new tab by @AaronHarris
- Consume favicon assets from the frontend package by @AaronHarris

### skip-link
- Move styles into frontend package and add react wrapper by @AaronHarris

### status-banner
- Add lifecycle status banner with alpha, beta, migrated and service variants by @AaronHarris
- Add react wrapper by @AaronHarris
- Render content as-is instead of wrapping it in a p by @AaronHarris
- Show the paragraph inside the React examples by @AaronHarris
- Add a fullWidth modifier for page-level banners by @AaronHarris
- Show page-level fullWidth and inline usage by @AaronHarris
- Explain when to add a live region by @AaronHarris

### summary-list
- Add vanilla css summary list styles by @Work
- Match the figma check-your-answers block by @Work
- Add row actions by @AaronHarris
- Add check-your-answers section wrapper by @AaronHarris
- Give the section rule breathing room before following content by @AaronHarris

### table
- Add vanilla css table styles by @Work
- Key the header rule off the semantic thead by @Work
- Restyle to match the figma comps with highlighted row headers by @AaronHarris
- Pad cells uniformly by @AaronHarris
- Add a scrollable container for wide tables by @AaronHarris
- Add a keyboard-reachable scroll container option by @AaronHarris

### templates
- Add page templates section (errors, service, auth, forms) by @AaronHarris
- Match error pages to Figma with the full page shell by @AaronHarris
- Extract page examples into standalone html partials by @AaronHarris
- Render each template example at its own chrome-less route by @AaronHarris
- Embed the real example routes on template pages by @AaronHarris
- Restore inline template examples, drop /examples routes by @AaronHarris

### textarea
- Style multi-line answers with the shared input recipe by @AaronHarris

### tokens
- Put figtree first in the font stack and drop unused colour tokens by @AaronHarris
- Add the figma type ramp and rename font-size-base to caption by @AaronHarris

### typography
- Add Heading and Text components and a bold utility by @AaronHarris
- Document Heading, Text and the bold utility by @AaronHarris

### General
- First commit by @TarikaBirch
- Auto-add new issues to project 12 by @phrogwrld
- Set up pnpm workspace with Node 24 / pnpm 11 by @AaronHarris
- Add session summary for docs-site scaffold (#113) by @TarikaBirch
- Add commitlint with lefthook commit-msg hook by @AaronHarris
- Record Astro-over-Storybook decision and session summary (#123) by @TarikaBirch
- Replace Storybook scaffold with CSS-first pipeline by @AaronHarris
- Merge css-first pipeline into astro site scaffold by @AaronHarris
- Merge remote review fixes, regenerate lockfile by @AaronHarris
- Make lint and format checks cross-platform by @TarikaBirch
- Approve lefthook build so pnpm exec works on pnpm 11 by @AaronHarris
- Add git-cliff for commit-driven per-component changelog by @AaronHarris
- Merge css-first pipeline, keep git-cliff changelog by @AaronHarris
- Add contributing guide (setup, commit conventions, changelog) by @AaronHarris
- Add CLAUDE.md for agent contributors by @AaronHarris
- Update contributing guide for css-first stack by @AaronHarris
- Add new issues as sub-issues of the design-system epic by @AaronHarris
- Exclude docs/plans from prettier checks by @TarikaBirch
- Redesign example code-preview block by @AaronHarris
- Wire all component styles into the bundle and playground by @Work
- Workspace packages, reworked components and CSS foundation layers by @AaronHarris
- Move component and doc pages to markdown content collections by @AaronHarris
- Collapse transitions under prefers-reduced-motion by @AaronHarris
- Correct breakpoint names in the breakpoints comment by @AaronHarris
- Ship figtree fonts and brand images, wire new components into bundle and playground by @AaronHarris
- Add type scale text utilities and wire link and list into the bundle by @AaronHarris
- Consolidate the keyboard focus ring into one shared rule by @AaronHarris
- Add vitest and testing-library harness for the react package by @AaronHarris
- Export all component wrappers from the react package by @AaronHarris
- Run typecheck and tests on pre-push by @AaronHarris
- Add lint, typecheck, test and build workflow by @AaronHarris
- Add usage readme for the react package by @AaronHarris
- Add vitest harness for the frontend package by @AaronHarris
- Register behavioural modules in the pe runtime and playground by @AaronHarris
- Move frontend components into per-component folders by @AaronHarris
- Move docs site onto the workspace frontend package by @AaronHarris
- Compile the react package with tsup for publish by @AaronHarris
- Run an axe wcag a/aa check in every component test by @AaronHarris
- Verify the react package against react 18 by @AaronHarris
- Potential fix for pull request finding 'CodeQL / Workflow does not contain permissions'

Co-authored-by: Copilot Autofix powered by AI <62310815+github-advanced-security[bot]@users.noreply.github.com> by @phrogwrld
- Mark both packages public with provenance and prepublish builds by @AaronHarris
- Add one-button lockstep release workflow by @AaronHarris
- Document the release process by @AaronHarris
- Add react tabs to every component example by @AaronHarris
- Match the docs code preview to the figma design by @AaronHarris
- Lift the code preview's muted text to wcag aa contrast by @AaronHarris
- Document page layout under documentation by @AaronHarris
- Add a resizable full-page layout demo by @AaronHarris
- Compile custom media in the dev playground so it matches the built css by @AaronHarris
- Give the layout page sgds-style spec tables and grid diagrams by @AaronHarris
- Annotate the grid diagrams with sgds-style measurements by @AaronHarris
- Enlarge the grid diagrams to render at article width by @AaronHarris
- Keep the grid diagram generator with the site by @AaronHarris
- Style tables, inline code and lists in the docs prose by @AaronHarris
- Stack the mobile grid diagram and add the breakpoint ruler by @AaronHarris
- Add a styles section to the docs site and move layout into it by @AaronHarris
- Use the package banner, footer and layout classes on the site by @AaronHarris
- Wire the five new components into the bundle and playground by @Work
- Align the playground demos with the corrected components by @Work
- Match the gov banner to figma and fix its missing landmark by @AaronHarris
- Restyle the banner and sidebar to match figma and fix aa contrast by @AaronHarris
- Add playwright visual regression over the playground by @AaronHarris
- Gate prs on visual regression with a baseline update workflow by @AaronHarris
- Add interaction-state visual baselines by @AaronHarris
- Post visual diffs as a pr comment by @AaronHarris
- Render visual baselines in isolation from playground markup by @AaronHarris
- Compile custom media in the dev playground so it matches the built css by @AaronHarris
- Soften section assertions and boot the pe runtime in the harness by @AaronHarris
- Move visual regression into a kumo-style ci directory by @AaronHarris
- Add amplify hosting build config by @AaronHarris
- Add 404 page and robots.txt to the docs site by @AaronHarris
- Add guidance pages for the remaining 14 components by @AaronHarris
- Restructure the site nav into styles, patterns and components by @AaronHarris
- Add tokens, colour, spacing and typography style pages by @AaronHarris
- Nest lists under typography in the styles section by @AaronHarris
- Stop repeating parent style pages in the sidebar by @AaronHarris
- Run the design system runtime inside example previews by @AaronHarris
- Rename the misspelled crest asset to govbb-crest.svg by @AaronHarris
- Remove em dashes and tighten copy across the site by @AaronHarris
- Add more docs by @AaronHarris
- Add react wrappers for back-button, summary-list and table by @AaronHarris
- Repair the visual-regression harness and refresh darwin baselines by @AaronHarris
- Require node 24 and document component packaging expectations by @AaronHarris
- Update visual regression baselines by @github-actions[bot]
- Pair the react snippets directly with their html fences in the docs by @AaronHarris
- Tokenize the state overlays and home the pressed teal in the ramp by @AaronHarris
- Guard initAll against double initialisation by @AaronHarris
- Cover animations in the reduced-motion guard by @AaronHarris
- Size fixed control details in rem so they track text zoom by @AaronHarris
- Link the stylesheet into example previews instead of inlining it by @AaronHarris
- Preload the figtree latin subset in the site head by @AaronHarris
- Align site tokens with the package ramp and stop shadowing package names by @AaronHarris
- Render search results with textcontent and the ramp yellow by @AaronHarris
- Use rem breakpoints on the site and put content before nav on phones by @AaronHarris
- Drop stale redirects that shadowed the list and payment component pages by @AaronHarris
- Record the decision to keep pages short by @Work
- Add a migration guide from the alpha packages to the rewrite by @AaronHarris
- Update visual regression baselines by @github-actions[bot]
- Correct misnamed crest asset so it stops 404ing by @AaronHarris
- Keep prettier out of agent worktree checkouts by @AaronHarris
- Update visual regression baselines by @AaronHarris
- Make number input steppers respect bounds by @AaronHarris
- Add Storybook component workshop by @AaronHarris
- Allow same-origin Storybook frames by @AaronHarris
- Improve package adoption guidance by @AaronHarris
- Harden release and site checks by @AaronHarris
- Publish via OIDC trusted publishing and target 1.x alpha releases by @AaronHarris
- Add per-PR Amplify preview workflow by @LaronGovT
- Simplify form component structure and improve accessibility by @AaronHarris
- Explain why we don't use placeholder text in fields by @Work
- Release v1.0.0-alpha.18 by @github-actions[bot]
<!-- generated by git-cliff -->
