// packages
import { app } from 'electron';
import path from 'path';
import fs from "fs";
import Papa from 'papaparse';



const calculateExpenses = async () => {
  const csvFilePath = path.join(app.getPath("userData"), "expenses.csv");

  return new Promise((resolve, reject) => {
    try {
      const csvData = fs.readFileSync(csvFilePath, "utf-8");

      // parse csv to json
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      if (parsedData.errors.length > 0) {
        reject(new Error("Error parsing CSV file."));
        return;
      }

      const expenses = {
        allExpenses: 0,
        yearly: 0,
        monthly: 0,
        oneTime: 0,
        message: "", 
      };

      parsedData.data.forEach((row) => {
        const amount = parseFloat(row.Amount);
        const interval = row.Interval;

        if (!isNaN(amount)) {
          expenses.allExpenses += amount;

          switch (interval.toLowerCase()) {
            case "yearly":
              expenses.yearly += amount;
              break;
            case "monthly":
              expenses.monthly += amount;
              break;
            case "onetime":
              expenses.oneTime += amount;
              break;
            default:
              break;
          }
        }
      });

      resolve(expenses);
    } catch (error) {
      reject(error);
    }
  });
};

export default calculateExpenses;
