import fs from 'fs';
import Papa from 'papaparse';
import { randomUUID } from 'crypto';
import { createObjectCsvWriter } from 'csv-writer';



export function createCsvWriterInstance(filePath: string) {
  return createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'description', title: 'Description' },
      { id: 'amount', title: 'Amount' },
      { id: 'interval', title: 'Interval' },
      { id: 'startDate', title: 'StartDate' },
    ],
    append: true,
  });
}


export function initializeCsvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'ID,Description,Amount,Interval,StartDate\n', 'utf8');
  }
}


export function loadCsvData(filePath: string): any {
  try {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
      throw new Error('Error parsing CSV data');
    }

    // If no data is found, return an empty array
    if (!Array.isArray(parsedData.data)) {
      return [];
    }

    const formattedData = parsedData.data.map((item) => {
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

    return formattedData;
  } catch (error) {
    return { error: "Can't read the CSV file." };
  }
}


export function addOrUpdateExpense(filePath: string, expense: any): any {
  const csvData = loadCsvData(filePath);
  let updated = false;

  const updatedData = csvData.map((row: any) => {
    if (row.id === expense.id) {
      updated = true;
      return { ...row, ...expense };
    }
    return row;
  });

  if (!updated) {
    updatedData.push({ id: randomUUID(), ...expense });
  }

  const csvString = Papa.unparse(updatedData, { header: true });
  fs.writeFileSync(filePath, csvString, 'utf-8');

  return { status: 'success', message: updated ? 'Expense updated successfully!' : 'Expense added successfully!' };
}


export function deleteExpense(filePath: string, id: string): any {
  const csvData = loadCsvData(filePath);
  const filteredData = csvData.filter((row: any) => row.id !== id);

  if (filteredData.length === csvData.length) {
    return { status: 'error', message: 'Expense not found.' };
  }

  let csvString;
  if (filteredData.length === 0) {
    // Jeśli nie ma żadnych danych, zapisz tylko nagłówki
    csvString = 'ID,Description,Amount,Interval,StartDate\n';
  } else {
    csvString = Papa.unparse(filteredData, { header: true });
  }

  fs.writeFileSync(filePath, csvString, 'utf-8');

  return { status: 'success', message: 'Expense deleted successfully.' };
}


export function getFormattedExpenses(filePath: string) {
  const csvData = loadCsvData(filePath);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return { error: "No expenses found." };
  }

  const expenses = {
    allExpenses: csvData.length,
    yearly: [] as string[],  // Format: ["MM-DD", ...]
    monthly: [] as string[], // Format: ["DD", ...]
    oneTime: [] as string[], // Format: ["YYYY-MM-DD", ...]
  };

  csvData.forEach((item) => {
    const { StartDate, Interval } = item;

    if (!StartDate || !Interval) return;

    if (Interval === "yearly") {
      expenses.yearly.push(StartDate);
    } else if (Interval === "monthly") {
      expenses.monthly.push(StartDate);
    } else if (Interval === "onetime") {
      expenses.oneTime.push(StartDate);
    }
  });

  return expenses;
}
