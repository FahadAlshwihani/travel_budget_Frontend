import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://travel-budget-backend.onrender.com/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Function to create a trip
export const createTrip = async (tripData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/trips/`, tripData);
        return response.data;
    } catch (error) {
        console.error("Error creating trip:", error);
        throw error;
    }
};

// Function to get expenses for a specific trip by CODE
export const getExpenses = async (tripId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/expenses/`);
        return response.data;
    } catch (error) {
        console.error("Error getting expenses:", error);
        throw error;
    }
};

// Function to get trip by code
export const getTripByCode = async (code) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trips/${code}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trip by code:", error);
        throw error;
    }
};

// Function to add an expense to a trip
export const addExpense = async (tripId, expenseData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/expenses/`, expenseData);
        return response.data;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

// Optional: Only if you have a delete route in your backend
export const deleteExpense = async (tripCode, expenseId) => {
    try {
        await axios.delete(`${API_BASE_URL}/trips/${tripCode}/expenses/${expenseId}/`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};

// Categories
export const getCategories = async (tripId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/categories/`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories:", error.response?.data || error);
    throw error;
  }
};

export const addCategory = async (tripId, categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/categories/`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error.response?.data || error);
    throw error;
  }
};