# Product screenshots

Screens show the real SuiteCraft interface. The Catalogue, Record Explorer, Compare, Synchronization, Script & Workflow Inspector and Change Plans frames were refreshed on 15 October 2026 from the current UI using the permanent SuiteCraft Lab and fictional Northstar data, with no AI editing. Other Lab captures remain, while the curated 0.4.1 popup and navigation search frames use supplied captures with identifying text replaced using the built-in image-generation editor. `demo.html?step=N` presents these images as a deterministic product tour. All visible account, object ID and value examples are fictional and contain no client information.

Workspace images use a landscape canvas; popup and navigation search images retain their compact proportions and are displayed in full. Run `npm run marketing:screenshots` from the extension repository to capture the lab scenes. The command opens isolated, headless Chrome or Brave sessions and writes the current product scenes directly into this directory; review its output before replacing manually curated screenshots.

Refresh only the affected images after a UI change. Lab captures hide product version labels and test-environment badges; the curated 0.4.1 captures show the matching current version. Raw supplied captures containing private identifiers are not stored in this repository. Editing prompts are documented in `source/anonymization-prompts.md`.

Do not replace these files with captures from a client account unless all customer data and account identifiers have been removed and the result has been reviewed before publication.

The six refreshed files are direct copies of the extension repository’s reviewed `store-listing/public-assets/screenshots/` captures (1280×800). Generate those with `node scripts/capture-marketing-screenshots.mjs --store`, inspect the outputs, then copy only the affected files. Store mode preserves this website directory. The default command still replaces the full website set; do not run it blindly over curated images.
