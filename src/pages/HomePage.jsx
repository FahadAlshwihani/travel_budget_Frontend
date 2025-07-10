import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, getTripByCode } from '../utils/api';
import Loading from '../components/Loading.jsx';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';
import '../styles/CardStyles.css';
import MainLayout from '../components/Layout/MainLayout';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const HomePage = ({ setTrip }) => {
    const { t } = useTranslation(); // Initialize useTranslation
    // Form states
    const [tripTitle, setTripTitle] = useState('');
    const [budget, setBudget] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hover states (now properly defined)
    const [isHoverCreate, setIsHoverCreate] = useState(false);
    const [isHoverJoin, setIsHoverJoin] = useState(false);

     // Unified hover/touch state handler
    const [buttonStates, setButtonStates] = useState({
        create: { hover: false, active: false },
        join: { hover: false, active: false }
    });
    
    const navigate = useNavigate();

 const [activeButton, setActiveButton] = useState(null); // 'create' | 'join' | null
 useEffect(() => {
        return () => {
            setActiveButton(null); // Cleanup on unmount
        };
    }, []);

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        if (!tripTitle || !budget) {
            showErrorAlert(t('show.Error.Alert')); // Translated
            return;
        }
        setLoading(true);
        try {
            const response = await createTrip({
                title: tripTitle,
                budget: parseFloat(budget.replace(/,/g, ''))
            });
            navigate(`/trip/${response.code}`);
        } catch (err) {
            setError(t('set.Error')); // Translated
        } finally {
            setLoading(false);
        }
    };

    const handleJoinTrip = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const trip = await getTripByCode(joinCode);
            setTrip(trip);
            navigate(`/trip/${joinCode}`);
        } catch (err) {
            showErrorAlert(t('show.Error'), t('show.Error.alert2')); // Translated
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="home-container-pc mt-5">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="card-pc create-trip-card">
                            <h2>{t('create.new.trip')}</h2> {/* Translated */}
                            <form onSubmit={handleCreateTrip}>
                                <input
                                    type="text"
                                    value={tripTitle}
                                    onChange={(e) => setTripTitle(e.target.value)}
                                    placeholder={t('Trip.title')} // Translated
                                    className="pc-input"
                                />
                                <input
                                    type="text"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder={t('Budget')} // Translated
                                    className="pc-input"
                                />
                                <button
                        type="submit"
                        className="pc-btn-create"
                        onMouseEnter={() => setActiveButton('create')}
                        onMouseLeave={() => setActiveButton(null)}
                        onTouchStart={() => setActiveButton('create')}
                        onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)} // Delay for visual feedback
                    >
                        <span className="btn-icon">
                            {activeButton === 'create' ? '🚀' : '+'}
                        </span>
                        <span className="btn-text">{t('create.trip.button')}</span> {/* Translated */}
                    </button>
                            </form>
                        </div>

                        <div className="card-pc join-trip-card">
                            <h2>{t('join.existing.trip')}</h2> {/* Translated */}
                            <form onSubmit={handleJoinTrip}>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder={t('enter.trip.code')} // Translated
                                    className="pc-input"
                                />
                                <button
                        type="submit"
                        className="pc-btn-join"
                        onMouseEnter={() => setActiveButton('join')}
                        onMouseLeave={() => setActiveButton(null)}
                        onTouchStart={() => setActiveButton('join')}
                        onTouchEnd={() => setTimeout(() => setActiveButton(null), 300)} // Delay for visual feedback
                    >
                        <span className="btn-icon">
                            {activeButton === 'join' ? '✨' : '→'}
                        </span>
                        <span className="btn-text">{t('join.trip.button')}</span> {/* Translated */}
                    </button>
                            </form>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default HomePage;
