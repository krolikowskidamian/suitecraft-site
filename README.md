# SuiteCraft website

Public landing page and product tour for SuiteCraft — Toolkit for NetSuite.

Live website: [krolikowskidamian.github.io/suitecraft-site](https://krolikowskidamian.github.io/suitecraft-site/)

This repository is deliberately self-contained. It contains the website, synthetic product screenshots and presentation assets only. The SuiteCraft browser-extension source code is maintained separately and is not published here.

`demo.html` is a reusable, synthetic eight-step product tour. It contains fictional account names, object IDs and values only. Query parameters such as `demo.html?step=3` open a deterministic scene that can be captured for website, store and release screenshots.

The same real-UI screenshots are embedded in the `#tour` section of `index.html`. The standalone tour is retained as an optional full-screen view and a direct link for testers, rather than the landing page's primary navigation path.

The landing page's `#changelog` shows only the current release, with New / Improved / Fixed sections and a link to `changelog.html`. The dedicated history page contains every published version, newest first: the current release is expanded and earlier releases are collapsed. Direct links such as `changelog.html#v0-4-1` open the selected version. All current entries belong to the beta channel; use `Current release` and `Earlier release` consistently rather than mixing beta and release labels.

For each approved release, update the latest-version chip and current notes in `index.html`, add the same release to `changelog.html`, and mark the previous history entry as earlier and collapsed. Keep the version, date and notes aligned with the extension's bundled `modules/shared/releases.js`. Preserve historical entries; small implementation fixes should be grouped under the relevant release rather than published as raw commit history.

## Local preview

Open `index.html` directly, or serve this directory with any local static web server. For example:

```sh
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## GitHub Pages

The site can be published directly from the repository root:

1. Open the repository settings on GitHub.
2. Choose **Pages** → **Deploy from a branch**.
3. Select the default branch and the `/ (root)` directory.

Before a public launch, replace the beta placeholder with the verified release destination and add finalized Privacy Policy, Terms and release notes pages. Packaged beta builds should be published through GitHub Releases rather than committed to the website tree.

## Data safety

All screenshots use fictional accounts, IDs, names and values. Do not replace them with captures from a client account unless every customer identifier and confidential value has been removed and the result has been reviewed before publication.

Never add extension source, private build configuration, signing keys, source maps or unpacked extension builds to this repository.

## 0.3.0 screenshots

The landing page includes fresh captures of the real extension popup, navigation Quick Access, reference lists, list synchronization and Settings. Captures use fictional Northstar data in the extension repository's local lab. They are product previews, not evidence of live NetSuite compatibility testing.
