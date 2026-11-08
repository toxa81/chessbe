# Chessbe

A small chessboard explorer. The first release renders the standard starting
position with original SVG pieces, coordinates, square inspection, keyboard
navigation, board flipping, and a reset-view control. Piece movement and analysis
are outside this first release.

## Run locally

No dependencies or build step are required. Serve the `site` directory:

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000. The site also works under a repository subpath.
Fonts use Google Fonts with system fallbacks; the board needs no external assets.

## GitHub Pages

Expected URL: https://toxa81.github.io/chessbe/

One-time repository setup:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.
3. Ensure GitHub Actions is enabled for this repository.

The `Deploy GitHub Pages` workflow publishes only `site/` on every push to
`main`, including merges. It can also be run manually from the Actions tab.
No personal access token, npm installation, or generated deployment branch is needed.
The workflow uses the built-in `GITHUB_TOKEN` with Pages and OIDC permissions.

If the first run fails before Pages is enabled, enable it as above and rerun the
failed workflow. Any required reviewers on the `github-pages` environment must
be removed if fully automatic deployment is desired.
