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

## Clean-room note

OpenSatellite was built from the user's feature request and the outside-only evidence notes. No files, code, assets, or source from the referenced commercial program were read, extracted, executed, or copied. The reference screenshots folder was empty, so this interface and visual identity are an original estimate.

## License

MIT. See [LICENSE](LICENSE).
