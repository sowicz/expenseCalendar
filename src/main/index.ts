// packages
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import path,{ join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import Papa from 'papaparse';

// assets
import icon from '../../resources/icon.png?asset'



function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 680,
    width: 900,
    height: 680,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('minimize', () => {
    mainWindow.minimize();
  })

  ipcMain.on('maximize', () => {
    if(mainWindow.isMaximized()){
      mainWindow.restore()
    } else {
      mainWindow.maximize();
    }
  })
  ipcMain.on('closeWindow', () => {
    mainWindow.close();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')


  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  // handle path and logic to save in csv
  const csvFilePath = path.join(__dirname, './expenses.csv');


  // config `csv-writer`
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: "description", title: "Description" },
      { id: "amount", title: "Amount" },
      { id: "interval", title: "Interval" },
      { id: "startDate", title: "Start_date" },
    ],
    append: true,
  });

  // check if file exist
  // Add header when create file
  const doesCsvExist = fs.existsSync(csvFilePath);
  if (!doesCsvExist) {
    fs.writeFileSync(
      csvFilePath,
      "Description,Amount,Interval,Start Date\n",
      "utf8"
    );
  }

  // IPC Linstener
  // change "ping" to 'add-expense'
  ipcMain.on("add-expense", async (event, expense) => {
    try {
      // BACKEND LOGIN TO DO  
      await csvWriter.writeRecords([expense]);
      console.log("Save expense:", expense);

      event.sender.send("expense-status", { status: "success", message: "Expense saved successfully!" });
    } catch (error) {
      event.sender.send("expense-status", { status: "error", message: "Failed to save expense." });
    }
  });




  ipcMain.on("request-expenses", (event) => {
    const csvPath = path.join(__dirname, "./expenses.csv");

    // Load CSV file
    fs.readFile(csvPath, "utf-8", (err, csvData) => {
      if (err) {
        console.error("Error reading CSV:", err);
        event.sender.send("request-expenses", { error: "Can't read the CSV file." });
        return;
      }

      // parse CSV to JSON
      const parsed = Papa.parse(csvData, {
        header: true, // if csv contains header
        dynamicTyping: true, // auto parse numbers
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error("Errors during CSV parsing:", parsed.errors);
        event.sender.send("request-expenses", { error: "Error parsing the CSV file." });
        return;
      }
  
      // Send parsed data to the frontend
      event.sender.send("request-expenses", parsed.data);
    });
  });
  



  // Create window function
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// END createWindow function


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
