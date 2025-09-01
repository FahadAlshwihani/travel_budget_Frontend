// FileName: src/utils/storage.js
export const getExpenses = () => {
  try {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error("Error getting expenses from localStorage:", error);
    return [];
  }
};

export const saveExpenses = (expenses) => {
  try {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  } catch (error) {
    console.error("Error saving expenses to localStorage:", error);
  }
};

export const getBudget = () => {
  try {
    const budget = localStorage.getItem('budget');
    return budget ? parseFloat(budget) : 0;
  } catch (error) {
    console.error("Error getting budget from localStorage:", error);
    return 0;
  }
};

export const saveBudget = (value) => {
  try {
    localStorage.setItem('budget', value.toString());
  } catch (error) {
    console.error("Error saving budget to localStorage:", error);
  }
};

// New functions for trip code
export const getTripCode = () => {
  try {
    return localStorage.getItem('tripCode');
  } catch (error) {
    console.error("Error getting trip code from localStorage:", error);
    return null;
  }
};

export const saveTripCode = (code) => {
  try {
    localStorage.setItem('tripCode', code);
  } catch (error) {
    console.error("Error saving trip code to localStorage:", error);
  }
};

export const removeTripCode = () => {
  try {
    localStorage.removeItem('tripCode');
  } catch (error) {
    console.error("Error removing trip code from localStorage:", error);
  }
};

