import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  Notification,
  NotificationConstructorOptions,
} from "electron";
import * as path from "path";

import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

let win: BrowserWindow | null = null;
let tray = null;
const isMac = process.platform === "darwin";
const icon = path.join(__dirname, "../../assets/logo512.png");

function createWindow() {
  const { screen } = require("electron");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    title: "Odyssey",
    width: !app.isPackaged ? 1000 : 300,
    height: !app.isPackaged ? 500 : 300,
    icon: icon,
    x: !app.isPackaged ? width / 2 : width - 300,
    y: !app.isPackaged ? height / 2 : height - 300,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), "./build/electron/preload.js"),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL("http://localhost:3000/index.html");

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Odyssey",
    width: 300,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

function showNotification() {
  new Notification(options).show();
}

app.whenReady().then(() => {
  // // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  // Configure app ID, Menu and Tray
  app.setAppUserModelId("Odyssey");

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  tray = new Tray(icon);
  tray.setToolTip("Odyssey");
  tray.setContextMenu(contextMenu);

  createWindow();

  // Sends notification
  ipcMain.on("notify", async (event, arg) => {
    showNotification();
  });

  // Remove main window from memory on close
  if (win) {
    win.on("closed", () => {
      win = null;
    });
    win.on("minimize", function (event: any) {
      event.preventDefault();
      win!.hide();
    });
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (!isMac) {
      app.quit();
    }
  });
});

// Menu Template
const menu: Electron.MenuItemConstructorOptions[] = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },

  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// Tray Menu Template
const contextMenu = Menu.buildFromTemplate([
  {
    label: "Show App",
    click: function () {
      win!.show();
    },
  },
  {
    label: "Quit",
    click: function () {
      app.quit();
    },
  },
]);

// Notification Template
const options: NotificationConstructorOptions = {
  title: "Look Away!",
  body: "Every 20 minutes, look up from your screen and focus on an item approximately 20 feet away for at least 20 seconds",
  silent: false,
  icon: path.join(__dirname, "../../assets/logo512.png"),
  hasReply: false,
  timeoutType: "never",
  urgency: "critical",
  closeButtonText: "Close Button",
  actions: [
    {
      type: "button",
      text: "Show Button",
    },
  ],
};
