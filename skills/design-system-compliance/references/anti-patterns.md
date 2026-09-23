# Anti-patterns

## Plausible but unverified names

A `govbb-` prefix does not make a class an API, and an undefined `--govbb-`
custom property silently loses its value. Search `/llms.txt`, read the relevant
example and verify names in the installed package. If nothing fits, compose
supported pieces or report the gap. Do not keep a fixed list of allegedly
missing components: the available set changes.

## Copying newer documentation into an older consumer

The live documentation and installed package can differ. Inspect the lockfile,
resolved versions, exports and types. An absent export may be a version mismatch,
not a misspelling. Use supported alternatives or propose the needed upgrade;
do not silently change package versions to make an example compile.

## Restyling component internals

Service CSS targeting `.govbb-button` or a component's child selectors couples
the service to its implementation. Use the documented variant or service-owned
composition. A missing variant is a gap to report, not a reason to quietly
replace a core component's colours and spacing.

## Rebuilding a solved task from isolated components

Check the index's patterns and templates before assembling a form journey or
confirmation page. Their content and validation guidance matters as much as
the visual structure. Copying classes alone does not preserve that contract.

## Rendering a component without its behaviour

HTML enhancement requires the documented `data-govbb-module` and initialisation
after the DOM exists. A page can look correct with inert navigation or controls.
Read the installed runtime and test the interaction. A module checker sees
only declared attributes, so a clean result does not detect omitted attributes.

React wrappers already own behaviour. Do not run `initAll()` over them. If
hand-written enhanced markup is needed inside React, initialise only its
subtree and manage its lifecycle according to the installed API.

## Treating Tailwind as a different rendering target

Tailwind can style React, Astro or other rendering stacks. Choose HTML versus
React from the renderer, preserve the framework and use supported GovBB token
integration. Remove utilities that override a converted component's internals;
do not turn an interface conversion into an unrequested Tailwind removal.

## Choosing tokens by visual proximity alone

Prefer semantic meaning over a primitive hue or a near-match hex value. Use an
appropriate spacing-scale step according to its guidance. If no token expresses
the intended role, record the gap rather than concealing an arbitrary choice.

## Losing functionality to simplify conversion

A missing component does not authorize deleting its task. Preserve the behaviour
through supported composition or report the limitation. Larger journey or
architecture changes need to be within the user's request.

## Claiming compliance from a clean helper run

Name checks do not prove valid markup, and a page loading without JavaScript
does not prove its task completes. Inspect the rendered result, interact with
controls and follow errors through recovery. Report only checks actually run,
including real gaps and limitations; do not fabricate gaps when none were found.
