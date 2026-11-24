# OpenSatellite

OpenSatellite is an original, open-source Windows desktop workspace for preparing 3D models for printing. It is built with Electron, TypeScript, and Three.js.

## What works

- Import STL and OBJ files from the import button or by dropping them into the viewport.
- Orbit, pan, and zoom around a lit 3D build plate; switch perspective, top, and front views.
- Select scene objects and move, rotate, and scale them using gizmos or numeric fields.
- Place a model on the plate, center it, inspect basic triangle and dimension counts, and export the selected model as binary STL.
- Add a simple block, remove objects, or start a fresh workspace.

## Limits in this version

This is a model preparation workspace, not a complete slicer. It does not create G-code, manage printer or material profiles, generate supports, repair meshes, or verify watertightness. OBJ import is geometry-focused and does not preserve every material or texture. The workspace treats coordinates as millimetres but does not infer unit conventions from every file. STL export applies the selected object's transforms, but only the selected scene object is exported at a time.

## Develop

Requires Node.js and npm. From this folder:

- `npm install` installs dependencies.
- `npm run build` checks the Electron entrypoints, type-checks TypeScript, and creates the renderer bundle in `dist/`.
- `npm start` opens the desktop app after a build.

## Contributing

Issues and pull requests are welcome. Keep changes focused, explain user-visible behavior, and include build steps or screenshots when changing the workspace. Avoid including private models or copyrighted assets in sample files.

## Research basis

OpenSatellite has its own code, interface, and brand. Its feature priorities are informed by a private Craft Anything Deep-mode static analysis of the locally installed ELEGOO SatelLite 1.0.2.43 executable and selected feature libraries. The analysis indicates STL and 3MF-family project formats and repair diagnostics for holes, bad edges, and non-manifold regions. Decompiled output, proprietary assets, and copied source are not part of this repository. Static results are estimates where symbols or runtime behavior are unavailable.

The current interface is an original first pass; no reference screenshots were captured during this setup. OpenSatellite is a model-preparation workspace, not a complete slicer, and does not yet create G-code or manage printer profiles.

## License

MIT. See [LICENSE](LICENSE).
