import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { getTripByCode, getExpenses, addExpense, deleteExpense } from '../utils/api';
import Loading from '../components/Loading';
import MainLayout from '../components/Layout/MainLayout';
import Summary from '../components/Summary';
import CustomChart from '../components/CustomChart';
import '../styles/CardStyles.css';
import '../styles/ToastifyCustom.css';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const TripDetailsPage = ({ setTrip: setGlobalTrip }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTripDetails] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [minimumLoadTimePassed, setMinimumLoadTimePassed] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    payer: t('paid.by')
  });

  const categories = [
    { key: 'Food', label: t('categories1') }, // Translated
    { key: 'Transport', label: t('categories2') }, // Translated
    { key: 'Hotel', label: t('categories3') }, // Translated
    { key: 'Entertainment', label: t('categories4') }, // Translated
    { key: 'Other', label: t('categories5') } // Translated
  ];

  // 5-second minimum loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadTimePassed(true);
      if (trip) {
        setLoading(false);
      }
    }, 5000); // Controls loading screen duration
    return () => clearTimeout(timer);
  }, [trip]);

  const fetchTripData = useCallback(async () => {
    try {
      const tripData = await getTripByCode(code);
      if (!tripData) {
        showErrorAlert(t('show.Error'), t('show.Error.alert2')); // Translated
        navigate('/');
        return;
      }
      const expensesData = await getExpenses(tripData.id);
      setTripDetails(tripData);
      setGlobalTrip(tripData);
      setExpenses(expensesData);
    } catch (err) {
      showErrorAlert(t('show.Error.alert3'), t('show.Error.alert4')); // Translated
      navigate('/');
    }
  }, [code, navigate, setGlobalTrip, t]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  if (loading) return <Loading />;
  if (!trip) return null;

  const formatExpenseDate = (dateString) => {
    if (!dateString) return t('expenses.list.card.no.date'); // Handle null or undefined

    // Parse the ISO date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t('expenses.list.card.no.date'); // Check for invalid date

    // Format the date to DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Return formatted date
  };

  // Handle adding new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseDataToSend = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        payer: newExpense.payer.trim() === '' ? t('paid.by') : newExpense.payer,
        date: newExpense.date, // Keep the original date format
      };

      const expense = await addExpense(trip.id, expenseDataToSend);
      setExpenses([...expenses, expense]);
      setNewExpense({
        title: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        payer: t('paid.by')
      });
      showSuccessAlert(t('showSuccessAlert.expense'), t('showSuccessAlert.expense2'));
    } catch (err) {
      showErrorAlert(t('showErrorAlert.expennse'), t('showErrorAlert.expennse2'));
    }
  };

  // Handle deleting expense
  const handleDeleteExpense = async (id) => {
    const confirm = await showConfirmAlert(
      t('showConfirmAlert1'), // Translated
      t('showConfirmAlert2'), // Translated
      t('showConfirmAlert3'), // Translated
      t('showConfirmAlert4') // Translated
    );
    if (confirm) {
      try {
        await deleteExpense(trip.id, id);
        setExpenses(expenses.filter(exp => exp.id !== id));
        showSuccessAlert(t('showSuccessAlert.expense.delete'), t('showSuccessAlert.expense.delete2')); // Translated
      } catch (err) {
        showErrorAlert(t('showErrorAlert.expense.delete'), t('showErrorAlert.expense.delete2')); // Translated
      }
    }
  };

  // Handle exit trip
  const handleExitTrip = async () => {
    const confirm = await showConfirmAlert(
      t('handle.Exit.Trip1'), // Translated
      t('handle.Exit.Trip2'), // Translated
      t('handle.Exit.Trip3'), // Translated
      t('handle.Exit.Trip4'), // Translated
      t('handle.Exit.Trip5') // Translated
    );
    if (confirm) {
      setGlobalTrip(null);
      showSuccessAlert(t('exit.success.alert'), t('exit.success.alert2')); // Translated
      navigate('/');
    }
  };

  // Copy to clipboard function
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(t('Copy.to.clipboard')); // Translated
  };

  return (
    <MainLayout>
      <Toaster position="top-center" />

      <div className="home-container-pc mt-5">
        {/* Trip Info Card */}
        <div className="card-pc trip-details-card">
          <h2 className="trip-details-title">{t('trip.details.title')}</h2> {/* Translated */}
          <div className="pc-input-group">
            <label>{t('trip.details.name')}</label> {/* Translated */}
            <div className="pc-input" onClick={() => handleCopy(trip.title)}>
              {trip.title}
            </div>
          </div>
          <div className="pc-input-group">
            <label>{t('trip.details.budget')}</label> {/* Translated */}
            <div className="pc-input" onClick={() => handleCopy(trip.budget)}>
              {trip.budget}
            </div>
          </div>
          <div className="pc-input-group">
            <label>{t('trip.details.code')}</label> {/* Translated */}
            <div className="pc-input" onClick={() => handleCopy(trip.code)}>
              {trip.code}
            </div>
          </div>
          <button
            className="pc-btn-danger"
            onClick={handleExitTrip}
            onMouseEnter={() => setActiveButton('exit')}
            onMouseLeave={() => setActiveButton(null)}
            onTouchStart={() => setActiveButton('exit')}
            onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)}
          >
            <span className="btn-icon">
              {activeButton === 'exit' ? '🚪' : '→'}
            </span>
            <span className="btn-text">{t('trip.details.exit')}</span> {/* Translated */}
          </button>
        </div>

        {/* Summary Card */}
        <div className="card-pc">
          <Summary budget={trip.budget} expenses={expenses} />
        </div>

        {/* Add Expense Card */}
        <div className="card-pc">
          <h2>{t('expense.Card.add.new.expense')}</h2> {/* Translated */}
          <form onSubmit={handleAddExpense}>
            <div className="pc-input-group">
              <label>{t('expense.Card.description')}</label> {/* Translated */}
              <input
                type="text"
                className="pc-input"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                required
              />
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.amount')}</label> {/* Translated */}
              <input
                type="number"
                className="pc-input"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                required
                step="0.01"
              />
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.category')}</label> {/* Translated */}
              <select
                className="pc-input"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key} style={{ color: 'black' }}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.date')}</label> {/* Translated */}
              <input
                type="date"
                className="pc-input"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                required
              />
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.paid.by')}</label> {/* Translated */}
              <input
                type="text"
                className="pc-input"
                value={newExpense.payer}
                onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })}
                required // Add this attribute
              />
            </div>
            <button
              type="submit"
              className="pc-btn-create"
              onMouseEnter={() => setActiveButton('add')}
              onMouseLeave={() => setActiveButton(null)}
              onTouchStart={() => setActiveButton('add')}
              onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)}
            >
              <span className="btn-icon">
                {activeButton === 'add' ? '🚀' : '+'}
              </span>
              <span className="btn-text">{t('expense.Card.add.expense')}</span> {/* Translated */}
            </button>
          </form>
        </div>

        {/* Expenses List Card */}
        <div className="card-pc">
          <h2>{t('expenses.list.card.expenses')}</h2> {/* Translated */}
          {expenses.length === 0 ? (
            <p className="text-center">{t('expenses.list.card.no.expenses.yet')}</p> // Translated
          ) : (
            <div className="expenses-list">
              {expenses.map(exp => (
                <div key={exp.id} className="expense-item text-white">
                  <div>
                    <h4>{exp.title}</h4>
                    <p>
                      {exp.category} • {formatExpenseDate(exp.created_at)} {/* Use created_at for date */}
                    </p>
                    {exp.payer && exp.payer !== t('paid.by') && (
                      <p>{t('expenses.list.card.paid.by')} {exp.payer}</p>
                    )}
                    <p>{t('expenses.list.card.amount')} {exp.amount} {trip.currency || 'SAR'}</p>
                  </div>
                  <div className="expense-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExpense(exp.id)}
                      onMouseEnter={() => setActiveButton(`delete-${exp.id}`)}
                      onMouseLeave={() => setActiveButton(null)}
                      onTouchStart={() => setActiveButton(`delete-${exp.id}`)}
                      onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)}
                    >
                      <span className="btn-icon">
                        {activeButton === `delete-${exp.id}` ? '🗑️' : '✕'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart Card */}
        <div className="card-pc">
          <CustomChart expenses={expenses} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TripDetailsPage;
