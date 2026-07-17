---
title: Session expiry
description: The page shown when a user's session times out mid-service.
lede: Tells the user their session ended and how to start again.
group: Service pages
---

Show this page when a session times out and the user tries to continue. Say why
they were signed out, whether their answers were kept, and give one clear way to
resume. Like every page of a service, the template keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/).

## Warn before you time out

Where you can, warn the user before the session ends - a dialog a couple of
minutes ahead with a "Stay signed in" button that extends the session. Landing
here should be the fallback, not the first the user hears of it.

## Be honest about saved data

If answers were discarded, say so plainly so the user knows to expect a fresh
start. If you did save progress, tell them where they will pick up and send them
back to that step instead of the beginning.
