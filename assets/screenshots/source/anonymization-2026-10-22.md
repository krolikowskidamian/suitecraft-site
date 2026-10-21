# Screenshot privacy edits — 22 October 2026

Tool: built-in `image_gen.imagegen`, one edit per supplied screenshot, opaque
background. No CLI/API fallback. Original source captures remain outside this
repository. Literal private identifiers used in the operational edit instructions
are deliberately omitted from this public prompt record.

## Shared prompt

Edit the supplied real SuiteCraft screenshot for a public website product gallery.
Preserve the actual app UI, layout, typography, controls, icons and colors, with
clean sharp legible text. This is a precise privacy edit, not a redesign. Replace
all client-related data with fictional Northstar examples, including account IDs,
people, company names, project names, script/custom record identifiers, private
notes, browser tabs and bookmarks. No blur, censor bars, redaction boxes,
watermarks, invented functionality or added annotations. Remove unrelated
surrounding browser/desktop/page pixels. Keep a clean straight-on screenshot,
without perspective or device mockups. Return only the screenshot; the website
provides the surrounding background.

## Image-specific instructions

- **01-quick-access.png:** crop exactly to the popup border; preserve all existing
  UI labels, Quick Sync, share icon, short Current Record descriptions and v1.0.0.
- **02-catalogue.png:** crop browser chrome and connection strip; use Northstar SB
  and demo-sb1, fictional script names and matching customscript_demo_* IDs;
  normalize snapshot dates to 21/10/2026, 14:30:00. Keep table headers and actions.
- **03-record-explorer.png:** crop to the inspector border; use
  customrecord_demo_staging #601 and body id 601. Preserve standard field IDs,
  current controls, field counts and values other than the private identity.
- **04-compare.png:** crop browser chrome and connection strip; Source is
  Northstar SB — demo-sb1 · Administrator, Target is
  Northstar Prod — demo-prod · Administrator in both selectors and captions.
  Preserve native report controls, category cards and counts.
- **05-synchronization.png:** crop browser/desktop chrome and connection strip;
  remove screenshot notification overlays; keep the metadata-only note, category
  groups, Include deployments, saved-list detail controls and checkbox states.
- **06-favorites.png:** crop browser chrome and connection strip; remove capture
  notifications; replace all names/IDs/notes with Demo Invoice Export Deployment,
  Demo Scan Data Workflow Action, Demo Standard Record Forms and Demo Invoice
  Document; use demo-sb1/demo-prod, IDs #410–413 and matching demo-prefixed IDs.
  Normalize timestamps and preserve grouped actions.
- **07-script-workflow-inspector.png:** crop to panel border; use
  customrecord_demo_staging #601, four Demo workflows (#501–504) and
  Demo Administrator for every owner. Preserve tabs, filters, statuses and footer.
- **08-change-plans.png:** crop browser chrome and connection strip; remove
  notifications; use Northstar Order Integration, demo-sb1, Demo Incoming Process
  Workflow Action (401) and Demo Incoming Map/Reduce (402), matching demo Script
  IDs and normalized timestamps. Keep the existing plan/card hierarchy.
- **09-navigation-search.png:** crop to the Search panel only; use
  demo-sb1 · Northstar Demo · Administrator, six Demo workflows (#501–506), a
  normalized snapshot timestamp and sample Workspace count. Preserve every tab,
  result action and footer label.
- **10-reference-lists.png:** crop browser chrome and connection strip; use
  Northstar SB — demo-sb1 · Administrator and the normalized timestamp. Preserve
  the Saved lists library, generic Classes data, columns, copy icons and links.
- **14-add-change-plan.png:** crop to the popover border; use
  Demo Staging Record · demo-sb1 and Northstar SB — demo-sb1. Preserve filters,
  empty-plan selection state, initial status, notes and actions.
- **15-favorite-note.png:** crop to the popover border; use
  Demo Staging Record · demo-sb1. Preserve all note labels, placeholder, character
  counter, focus ring and Remove/Close/Save note actions.

## Review

All 12 edited outputs were visually reviewed and locally processed with macOS
Vision OCR. Recognized text was checked for the private account, company,
personal-name, project-prefix and record-ID strings visible in the supplied
sources; no matches remained. OCR is an additional check, not a substitute for
visual review. OCR text and private comparison strings are not published here.

The gallery's neutral 16:10 framing is authored in website CSS; it does not alter
or crop the reviewed image pixels. No raw screenshot, customer dataset, browser
profile or account export is part of the gallery assets.
