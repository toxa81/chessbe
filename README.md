# Chessbe

A small chessboard explorer built with React, TypeScript, Vite, and CSS Grid.
It renders the standard starting position with original SVG pieces, coordinates
outside all four sides, square inspection, keyboard navigation, board flipping,
and unrestricted click-to-move: select a piece, then click another square.
Occupied destinations replace their piece, regardless of color. Clicking the
selected square deselects it; selection clears after a move. Either color can
move at any time. Reset board restores the starting position and orientation.
Move legality and analysis are outside this release.
Clean board removes every piece and clears selection; it preserves orientation.

## Run locally

Use Node.js 24 (`nvm use` if you use nvm), then:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To verify the production build:

```sh
npm test
npm run build
npm run preview
```

`build` checks TypeScript before generating `dist/`. Relative asset paths support
GitHub Pages repository subpaths and custom domains.
Fonts use Google Fonts with system fallbacks; the board needs no external assets.

## Source layout

- `src/chess/board.ts`: typed squares, pieces, starting position, and orientation.
- `src/components/Chessboard.tsx`: board, outside labels, and keyboard navigation.
- `src/components/Piece.tsx`: SVG piece artwork.
- `src/App.tsx`: selection, orientation state, and surrounding interface.
- `src/styles.css`: responsive layout and CSS Grid board.

Drag-and-drop and attack calculations can be added independently when those
features are implemented; dnd-kit is not installed yet.

## GitHub Pages

Expected URL: https://toxa81.github.io/chessbe/

One-time repository setup:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.
3. Ensure GitHub Actions is enabled for this repository.

The `Deploy GitHub Pages` workflow installs locked dependencies with `npm ci`,
runs tests, checks TypeScript, builds, and publishes only `dist/` on every push to
`main`, including merges. It can also be run manually from the Actions tab.
No personal access token or generated deployment branch is needed.
The workflow uses the built-in `GITHUB_TOKEN` with Pages and OIDC permissions.

If the first run fails before Pages is enabled, enable it as above and rerun the
failed workflow. Any required reviewers on the `github-pages` environment must
be removed if fully automatic deployment is desired.
