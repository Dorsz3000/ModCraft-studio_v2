# ModCraft Studio Alpha 0.2

Windows desktop application scaffold for Minecraft Java resource creation.

## What works in this Alpha
- Pixel texture editor: pencil, eraser, contiguous bucket fill, eyedropper, line, rectangle, ellipse outline, fill all.
- Canvas sizes: 16, 32, 64, 128.
- Color picker, starter swatches, brush opacity, pixel grid and center guides.
- Undo/redo, clear, PNG export.
- Save/open project JSON using native file dialogs.
- Navigation shell for planned workspaces.

## Planned / not implemented yet
The 3D model editor, six-face block editor, armor modeling, particles, icon generator, UV tools, texture atlases, smart texturing, Minecraft asset browser, animation editor, lighting preview, resource-pack builder, mod export, attach/snap modeling, and full layer compositing are not implemented in this Alpha. The interface labels these areas as "W przygotowaniu".

## Build on Windows
1. Install Node.js 20 or newer.
2. Extract the ZIP.
3. Open a terminal in this folder and run:
   `npm install`
   `npm start`
4. To build an installer:
   `npm run dist`
   The installer will be created in `release/`.

## Build with GitHub Actions
Push this project to a GitHub repository. The workflow `.github/workflows/build.yml` builds a Windows installer and uploads it as an artifact. No local JDK is needed.
