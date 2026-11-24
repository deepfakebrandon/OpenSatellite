const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");

function screenshotPath() {
  const index = process.argv.indexOf("--screenshot");
  return index >= 0 ? process.argv[index + 1] : null;
}

function createWindow() {
  const shot = screenshotPath();
  const win = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    show: true,
    backgroundColor: "#111719",
    title: "OpenSatellite",
    ...(shot && process.platform === "win32" ? { alwaysOnBottom: true, focusable: false } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  if (shot && process.platform !== "win32") win.showInactive();
  win.loadFile(path.join(__dirname, "dist", "index.html"));

  if (shot) {
    win.webContents.once("did-finish-load", async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const image = await win.webContents.capturePage();
      const out = path.resolve(shot);
      await fs.mkdir(path.dirname(out), { recursive: true });
      await fs.writeFile(out, image.toPNG());
      app.quit();
    });
  }
}

ipcMain.handle("save-stl", async (_event, bytes) => {
  const result = await dialog.showSaveDialog({
    title: "Export model",
    defaultPath: "opensatellite-model.stl",
    filters: [{ name: "STL mesh", extensions: ["stl"] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  await fs.writeFile(result.filePath, Buffer.from(bytes));
  return { canceled: false, filePath: result.filePath };
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });