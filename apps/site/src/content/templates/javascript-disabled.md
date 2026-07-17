---
title: JavaScript disabled
description: The message to show when a feature needs JavaScript and it is off.
lede: Shown when part of the service depends on JavaScript that is not running.
group: Error pages
---

Build services so they work without JavaScript wherever you can, and reserve
this message for the genuinely JavaScript-only parts. Put it inside `<noscript>`
so it shows exactly when scripts do not run, and hide the JavaScript-only
feature until enhancement succeeds.

## When to use this page

Use it for a feature that cannot work server-side - a live map, a drawing tool,
a client-side upload preview. Do not use it as a blanket gate on the whole
service; most pages should still function.

## What to include

Say plainly what needs JavaScript, how to turn it on, and offer a contact route
so the user is never fully blocked.
