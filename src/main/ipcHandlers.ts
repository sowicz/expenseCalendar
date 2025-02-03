import { ipcMain, app } from 'electron';
import { initializeCsvFile, addOrUpdateExpense, loadCsvData, deleteExpense, getFormattedExpenses } from './csvUtils';
import path from 'path';

import calculateExpenses from './expenseSummary';



export function initializeIpcHandlers(): void {
  const csvFilePath = path.join(app.getPath('userData'), 'expenses.csv');

  // Initialize CSV file if needed
  initializeCsvFile(csvFilePath);

  ipcMain.on('add-expense', async (event, expense) => {
    try {
      const result = addOrUpdateExpense(csvFilePath, expense);
      event.sender.send('add-status', result);
    } catch (error) {
      console.error(error);
      event.sender.send('add-status', { status: 'error', message: 'Failed to process expense.' });
    }
  });


  ipcMain.on('request-expenses', (event) => {
    const csvData = loadCsvData(csvFilePath);
    event.sender.send('response-expenses', csvData);
  });

  
  ipcMain.on('delete-expense', (event, id) => {
    try {
      const result = deleteExpense(csvFilePath, id);
      event.sender.send('delete-status', result);
    } catch (error) {
      console.error(error);
      event.sender.send('delete-status', { status: 'error', message: 'Failed to delete expense.' });
    }
  });


  ipcMain.on('calculate-expenses', async (event) => {
    try {
      const expenses = await calculateExpenses();
      event.reply('calculate-expenses-response', expenses);
    } catch (error) {
      event.reply('calculate-expenses-response', { error: 'Failed to calculate expenses.' });
    }
  });



  ipcMain.on("get-expenses", async (event) => {
    try {
      const expenses = getFormattedExpenses(csvFilePath);
      event.reply("get-expenses-response", expenses);
    } catch (error) {
      event.reply("get-expenses-response", { error: "Failed to retrieve expenses." });
    }
  });

}
