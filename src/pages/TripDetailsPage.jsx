// FileName: MultipleFiles/TripDetailsPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { getTripByCode, getExpenses, addExpense, deleteExpense, getCategories } from '../utils/api';
import Loading from '../components/Loading';
import MainLayout from '../components/Layout/MainLayout';
import Summary from '../components/Summary';
import CustomChart from '../components/CustomChart';
import BudgetSplit from '../components/BudgetSplit';
import '../styles/CardStyles.css';
import '../styles/ToastifyCustom.css';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';
import { useTranslation } from 'react-i18next';
import { FaSyncAlt } from 'react-icons/fa';

const TripDetailsPage = ({ setTrip: setGlobalTrip }) => {
  const { t } = useTranslation();
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTripDetails] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [minimumLoadTimePassed, setMinimumLoadTimePassed] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    payer: t('paid.by')
  });

  // New state variables for sorting and filtering
  const [sortBy, setSortBy] = useState('latest'); // 'earliest', 'latest', 'lowerPrice', 'highestPrice'
  const [filterCategory, setFilterCategory] = useState('All'); // 'All' or specific category key
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD format

  const categories = [
    { key: 'Food', label: t('categories1') },
    { key: 'Transport', label: t('categories2') },
    { key: 'Hotel', label: t('categories3') },
    { key: 'Entertainment', label: t('categories4') },
    { key: 'Other', label: t('categories5') }
  ];

  // 5-second minimum loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadTimePassed(true);
      if (trip) setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [trip]);

  const fetchTripData = useCallback(async () => {
    try {
      const tripData = await getTripByCode(code);
      if (!tripData) {
        showErrorAlert(t('show.Error'), t('show.Error.alert2'));
        navigate('/');
        return;
      }

      const expensesData = await getExpenses(tripData.id);
      const categoriesData = await getCategories(tripData.id);

      setTripDetails(tripData);
      setGlobalTrip(tripData);
      setExpenses(expensesData);
      setCategoriesList(categoriesData);
    } catch (err) {
      showErrorAlert(t('show.Error.alert3'), t('show.Error.alert4'));
      navigate('/');
    }
  }, [code, navigate, setGlobalTrip, t]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  if (loading) return <Loading />;
  if (!trip) return null;

  const formatExpenseDate = (dateString) => {
    if (!dateString) return t('expenses.list.card.no.date');
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t('expenses.list.card.no.date');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to get unique dates from expenses
  const getUniqueDates = () => {
    const dates = expenses.map(exp => exp.created_at ? exp.created_at.split('T')[0] : '');
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  };

  // Filter and Sort Logic
  const filteredAndSortedExpenses = expenses
    .filter(exp => {
      const categoryMatch = filterCategory === 'All' || exp.category === filterCategory;
      const dateMatch = filterDate === '' || (exp.created_at && exp.created_at.startsWith(filterDate));
      return categoryMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'earliest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'latest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'lowerPrice') return parseFloat(a.amount) - parseFloat(b.amount);
      if (sortBy === 'highestPrice') return parseFloat(b.amount) - parseFloat(a.amount);
      return 0;
    });

  // Handle adding new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseDataToSend = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        payer: newExpense.payer.trim() === '' ? t('paid.by') : newExpense.payer,
        date: newExpense.date,
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

  const handleDeleteExpense = async (id) => {
    const confirm = await showConfirmAlert(
      t('showConfirmAlert1'),
      t('showConfirmAlert2'),
      t('showConfirmAlert3'),
      t('showConfirmAlert4')
    );
    if (confirm) {
      try {
        await deleteExpense(trip.id, id);
        setExpenses(expenses.filter(exp => exp.id !== id));
        showSuccessAlert(t('showSuccessAlert.expense.delete'), t('showSuccessAlert.expense.delete2'));
      } catch (err) {
        showErrorAlert(t('showErrorAlert.expense.delete'), t('showErrorAlert.expense.delete2'));
      }
    }
  };

  const handleExitTrip = async () => {
    const confirm = await showConfirmAlert(
      t('handle.Exit.Trip1'),
      t('handle.Exit.Trip2'),
      t('handle.Exit.Trip3'),
      t('handle.Exit.Trip4'),
      t('handle.Exit.Trip5')
    );
    if (confirm) {
      setGlobalTrip(null);
      showSuccessAlert(t('exit.success.alert'), t('exit.success.alert2'));
      navigate('/');
    }
  };

  const handleRefreshExpenses = async () => {
    setLoading(true);
    try {
      await fetchTripData();
      showSuccessAlert(t('refresh.success.title'), t('refresh.success.message'));
    } catch (err) {
      showErrorAlert(t('refresh.error.title'), t('refresh.error.message'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(t('Copy.to.clipboard'));
  };

  return (
    <MainLayout>
      <Toaster position="top-center" />

      <div className="home-container-pc mt-5">
        {/* Trip Info Card */}
        <div className="card-pc trip-details-card">
          <h2 className="trip-details-title">{t('trip.details.title')}</h2>
          <div className="pc-input-group">
            <label>{t('trip.details.name')}</label>
            <div className="pc-input" onClick={() => handleCopy(trip.title)}>{trip.title}</div>
          </div>
          <div className="pc-input-group">
            <label>{t('trip.details.budget')}</label>
            <div className="pc-input" onClick={() => handleCopy(trip.budget)}>{trip.budget}</div>
          </div>
          <div className="pc-input-group">
            <label>{t('trip.details.code')}</label>
            <div className="pc-input" onClick={() => handleCopy(trip.code)}>{trip.code}</div>
          </div>
          <button
            className="pc-btn-danger"
            onClick={handleExitTrip}
            onMouseEnter={() => setActiveButton('exit')}
            onMouseLeave={() => setActiveButton(null)}
            onTouchStart={() => setActiveButton('exit')}
            onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)}
          >
            <span className="btn-icon">{activeButton === 'exit' ? '🚪' : '→'}</span>
            <span className="btn-text">{t('trip.details.exit')}</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="card-pc">
          <Summary budget={trip.budget} expenses={expenses} />
        </div>

        {/* Budget Split Card */}
        <BudgetSplit categories={categoriesList} currency={trip.currency || 'SAR'} />

        {/* Add Expense Card */}
        <div className="card-pc">
          <h2>{t('expense.Card.add.new.expense')}</h2>
          <form onSubmit={handleAddExpense}>
            <div className="pc-input-group">
              <label>{t('expense.Card.description')}</label>
              <input
                type="text"
                className="pc-input"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                required
              />
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.amount')}</label>
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
              <label>{t('expense.Card.category')}</label>
              <select
                className="pc-input"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key} style={{ color: 'black' }}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.date')}</label>
              <input
                type="date"
                className="pc-input"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                required
              />
            </div>
            <div className="pc-input-group">
              <label>{t('expense.Card.paid.by')}</label>
              <input
                type="text"
                className="pc-input"
                value={newExpense.payer}
                onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })}
                required
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
              <span className="btn-icon">{activeButton === 'add' ? '🚀' : '+'}</span>
              <span className="btn-text">{t('expense.Card.add.expense')}</span>
            </button>
          </form>
        </div>

        {/* Expenses List Card */}
        <div className="card-pc">
          <div className="expenses-list-header">
            <h2>{t('expenses.list.card.expenses')}</h2>
            <button
              className="pc-btn-refresh"
              onClick={handleRefreshExpenses}
              onMouseEnter={() => setActiveButton('refresh')}
              onMouseLeave={() => setActiveButton(null)}
              onTouchStart={() => setActiveButton('refresh')}
              onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)}
            >
              <span className="btn-icon"><FaSyncAlt /></span>
            </button>
          </div>

          {/* Filter & Sort Controls */}
          <div className="filter-sort-controls" role="region" aria-label={t('filter.sort.controls')}>
            <div className="pc-input-group">
              <label htmlFor="sortBy">{t('sort.by')}:</label>
              <select
                id="sortBy"
                className="pc-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">{t('sort.latest')}</option>
                <option value="earliest">{t('sort.earliest')}</option>
                <option value="lowerPrice">{t('sort.lower.price')}</option>
                <option value="highestPrice">{t('sort.highest.price')}</option>
              </select>
            </div>

            <div className="pc-input-group">
              <label htmlFor="filterCategory">{t('filter.by.category')}:</label>
              <select
                id="filterCategory"
                className="pc-input"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">{t('filter.all.categories')}</option>
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key} style={{ color: 'black' }}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="pc-input-group">
              <label htmlFor="filterDate">{t('filter.by.date')}:</label>
              <select
                id="filterDate"
                className="pc-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="">{t('filter.all.dates')}</option>
                {getUniqueDates().map(date => (
                  <option key={date} value={date} style={{ color: 'black' }}>
                    {formatExpenseDate(date)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAndSortedExpenses.length === 0 ? (
            <p className="text-center">{t('expenses.list.card.no.expenses.yet')}</p>
          ) : (
            <div className="expenses-list">
              {filteredAndSortedExpenses.map(exp => (
                <div key={exp.id} className="expense-item text-white">
                  <div>
                    <h4>{exp.title}</h4>
                    <p>{exp.category} • {formatExpenseDate(exp.created_at)}</p>
                    {exp.payer && exp.payer !== t('paid.by') && <p>{t('expenses.list.card.paid.by')} {exp.payer}</p>}
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
                      <span className="btn-icon">{activeButton === `delete-${exp.id}` ? '🗑️' : '✕'}</span>
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
