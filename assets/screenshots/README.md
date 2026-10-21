# Product screenshots

## Current gallery — 22 October 2026

Twelve supplied screenshots were cropped and anonymized with the built-in
imagegen editor. Browser tabs, bookmarks, connection strips and unrelated page
edges were removed. Client account IDs, people, companies, projects, workflow
owners, custom Script IDs, record IDs and private notes were replaced with
fictional Northstar / demo-sb1 / demo-prod examples. The public repository
contains only the reviewed edited outputs, never the original private captures.

Updated files: `01-quick-access.png`, `02-catalogue.png`,
`03-record-explorer.png`, `04-compare.png`, `05-synchronization.png`,
`06-favorites.png`, `07-script-workflow-inspector.png`, `08-change-plans.png`,
`09-navigation-search.png`, `10-reference-lists.png`, `14-add-change-plan.png`
and `15-favorite-note.png`.

These are anonymized product illustrations based on the real interface, edited
with AI; they are not untouched browser captures. Review both text and controls
before publication. Prompt specifications are in
[source/anonymization-2026-10-22.md](source/anonymization-2026-10-22.md).

The landing page centers every image inside a 16:10 frame with a subtle lavender
and blue background. The image itself retains its natural proportions: narrow
popups and panels are not stretched or cropped to fill the frame. Clicking a
slide opens the full-size reviewed image. The main gallery has 14 views, including
the two new record-reference and note popovers.

`11-settings.png` and `12-list-synchronization.png` remain earlier fictional Lab
captures. Other legacy files and their provenance remain for existing links.
The older supplied-capture edits are documented in
[source/anonymization-prompts.md](source/anonymization-prompts.md).

## Refreshing captures

The extension repository's `npm run marketing:screenshots` renders synthetic
Lab scenes. Do not run its default batch blindly over this curated set.
Prefer a specific `--only` scene or copy reviewed outputs from store-mode
captures. A new direct Lab capture must be labeled with its own provenance,
rather than retaining the edited-image description.

After changing files or metadata, run `python3 scripts/build-asset-gallery.py`
from the website repository. Never add private source screenshots to this tree.
