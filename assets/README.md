# AWE Edu design assets

Designer handoff exported from the [VIDEO EDU Figma file](https://www.figma.com/design/FXkGet6SgLsPQjI9AYkS4w/VIDEO-EDU?node-id=1-2&t=kcucbYPmrOfvMG7w-0) and received on 2026-08-17.

## Structure

- `brand/`: brand guidelines, color references, typography references, logos, and backgrounds.
- `brand/fonts/`: locally bundled open-source fonts, their licenses, and download provenance.
- `components/`: reusable arrows and quotation marks.
- `subjects/`: subject color references, source cover images, and ready-made 1920×1080 thumbnails.
- `ui/mockups/`: app screens in PDF, PNG, and SVG formats.
- `manifest.csv`: original path, normalized path, byte size, and SHA-256 for every received file.

Names are lowercase kebab-case. The reorganization changed paths only: all 80 received files and all supplied formats are preserved.

## Format guidance

- Prefer SVG for simple vector components such as arrows and quotation marks.
- Prefer the 1920×1080 files in `subjects/thumbnails/` when a finished subject card is needed.
- Use `subjects/covers/` when the composition or image treatment must be rebuilt.
- Treat PDF files as visual/source references, not runtime video assets.
- The app mockup SVGs embed large raster images and contain live text. Poppins is bundled locally. Use the PNG versions when exact Franklin Gothic reproduction matters and the commercial font is unavailable.

## Open inputs and rights

- The designer supplied no installable font files. `brand/typography/` contains reference boards only.
- Poppins Medium, ExtraBold, and Black were downloaded from the official Google Fonts repository and are bundled under the SIL Open Font License 1.1.
- Exact Franklin Gothic Heavy, Demi, and Book files are commercial and were not downloaded. Libre Franklin is bundled under SIL OFL 1.1 as an explicitly temporary open-source fallback, not as an exact brand match.
- Four standalone SVG logo variants were recovered losslessly from the vector artwork embedded in the supplied Illustrator PDF. See `brand/logos/README.md` for provenance.
- The project owner confirmed production usage rights for the supplied design assets on 2026-08-17. Font licenses remain governed separately by their respective license files.
- The SVG files are self-contained; app mockups include embedded raster data rather than external image links.
