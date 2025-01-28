// packages
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import path,{ join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { createObjectCsvWriter } from "csv-writer";
import { randomUUID } from 'crypto';
import fs from "fs";
import Papa from 'papaparse';

// functions
import calculateExpenses from "./expenseSummary";

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
  const csvFilePath = path.join(app.getPath("userData"), "expenses.csv");



  // config `csv-writer`
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: "id", title: "ID" },
      { id: "description", title: "Description" },
      { id: "amount", title: "Amount" },
      { id: "interval", title: "Interval" },
      { id: "startDate", title: "StartDate" },
    ],
    append: true,
  });

  // check if file exist
  // Add header when create file
  const doesCsvExist = fs.existsSync(csvFilePath);
  if (!doesCsvExist) {
    fs.writeFileSync(
      csvFilePath,
      "ID,Description,Amount,Interval,StartDate\n",
      "utf8"
    );
  }


  // IPC Linstener
  ipcMain.on("add-expense", async (event, expense) => {
    const csvFilePath = path.join(app.getPath("userData"), "expenses.csv");
  
    console.log(expense)
    try {
      // Read the existing CSV data
      const csvData = fs.readFileSync(csvFilePath, "utf-8");
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
  
      // Find if the expense ID already exists
      let updated = false;
      const updatedData = parsedData.data.map((row: any) => {
        console.log(row.id)
        if (row.id === expense.id) {
          updated = true;
          return {
            ...row,
            Description: expense.Description,
            Amount: expense.Amount,
            Interval: expense.Interval,
            StartDate: expense.StartDate,
          };
        }
        return row;
      });
  
      if (updated) {
        // Update the CSV file with the modified data
        const csvString = Papa.unparse(updatedData, { header: true });
        fs.writeFileSync(csvFilePath, csvString, "utf-8");
        event.sender.send("add-status", {
          status: "success",
          message: "Expense updated successfully!",
        });
      } else {
        // Add a new expense if ID doesn't exist
        const newExpense = {
          id: randomUUID(),
          Description: expense.Description,
          Amount: expense.Amount,
          Interval: expense.Interval,
          StartDate: expense.StartDate,
        };
  
        const csvString = Papa.unparse([...parsedData.data, newExpense], {
          header: true,
        });
        fs.writeFileSync(csvFilePath, csvString, "utf-8");
        event.sender.send("add-status", {
          status: "success",
          message: "Expense added successfully!",
        });
      }
    } catch (error) {
      console.error("Error handling expense:", error);
      event.sender.send("add-status", {
        status: "error",
        message: "Failed to process expense.",
      });
    }
  });




  ipcMain.on("request-expenses", (event) => {
    const csvPath = path.join(app.getPath("userData"), "expenses.csv");

    // Load CSV file
    fs.readFile(csvPath, "utf-8", (err, csvData) => {
 
      if (err) {
        console.error("Error reading CSV:", err);
        event.sender.send("response-expenses", { error: "Can't read the CSV file." });
        return;
      }

      // parse CSV to JSON
      const parsed = Papa.parse(csvData, {
        header: true, // if csv contains header
        dynamicTyping: true, // auto parse numbers
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        // console.error("Errors during CSV parsing:", parsed.errors);
        event.sender.send("response-expenses", { error: "Error loading CSV file - might be empty." });
        return;
      }

      const formattedData = parsed.data.map((item) => {
        if (item.StartDate) {
          try {
            // Format the date to YYYY-MM-DD
            const parsedDate = new Date(item.StartDate);
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
            const day = String(parsedDate.getDate()).padStart(2, "0");
            item.StartDate = `${year}-${month}-${day}`;
          } catch (err) {
            console.error("Error formatting date:", err);
          }
        }
        return item;
      });
      // console.log(formattedData)

      // Send parsed data to the frontend
      event.sender.send("response-expenses", formattedData);

    });
  });
  

  
  ipcMain.on("delete-expense", (event, id) => {
    const csvFilePath = path.join(app.getPath("userData"), "expenses.csv");
  
    try {
      // Read the existing CSV data
      const csvData = fs.readFileSync(csvFilePath, "utf-8");
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
  
      // Check if an expense with the given ID exists
      const filteredData = parsedData.data.filter((row: any) => row.id !== id);
  
      if (filteredData.length === parsedData.data.length) {
        // If no matching ID is found, notify the user
        event.sender.send("delete-status", {
          status: "error",
          message: `Expense not found, please reload application`,
        });
        return;
      }
  
      // Write the updated data back to the CSV file
      const csvString = Papa.unparse(filteredData, { header: true });
      fs.writeFileSync(csvFilePath, csvString, "utf-8");
  
      // Notify the frontend about the successful deletion
      event.sender.send("delete-status", {
        status: "success",
        message: `Expense deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
  
      // Notify the frontend about the error
      event.sender.send("delete-status", {
        status: "error",
        message: "Failed to delete expense.",
      });
    }
  });


  ipcMain.on("calculate-expenses", async (event) => {
    try {
      const expenses = await calculateExpenses();
      event.reply("calculate-expenses-response", expenses);
    } catch (error) {
      event.reply("calculate-expenses-response", { error: "Failed to calculate expenses." });
    }
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
