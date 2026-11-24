# Contributing

Thanks for helping improve OpenSatellite. Keep changes focused and explain the user-visible behavior they affect.

## Development

Use Node.js 22.12 or newer and npm. From this folder:

```powershell
npm ci
npm run build
npm start
```

Before opening a pull request, run `npm run build` and describe the result. Include a screenshot for visible workspace changes when practical. Do not commit private model files, user data, generated exports, or third-party assets without permission to redistribute them.

## Reference analysis

OpenSatellite may use authorized local static analysis to understand feature boundaries and file formats. Keep decompilation artifacts private; do not commit pseudo-code, source, bundled resources, product branding, or other copyrighted material from commercial applications. Record observed behavior separately from assumptions in project documentation.
