import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import '../styles/CustomChart.css';
import { useTranslation } from 'react-i18next';

const UltraChart = ({ expenses }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [isMobile, setIsMobile] = useState(false);
  const COLORS = ['#FF4D4D', '#F9CB28', '#6EE7B7', '#818CF8', '#F472B6'];

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Process data
  const [animatedData, setAnimatedData] = useState([]);
  useEffect(() => {
    const processed = expenses.reduce((acc, expense) => {
      const existing = acc.find(item => item.category === expense.category);
      const amount = parseFloat(expense.amount) || 0;
      
      if (existing) {
        existing.amount += amount;
      } else {
        acc.push({
          category: expense.category,
          amount,
        });
      }
      return acc;
    }, []);
    setAnimatedData(processed);
  }, [expenses]);

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-category text-black">{`${t("custom.chart.category")}: ${payload[0].payload.category}`}</p>
          <p className="tooltip-value text-black">{`${t("custom.chart.amount")}: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`ultra-chart-container ${isMobile ? 'mobile' : ''}`}>
      <h2 className="chart-title">{t("custom.chart.card")}</h2>
      
      <div className="glass-container">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 450}>
          <BarChart data={animatedData} barSize={isMobile ? 30 : 40}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isMobile ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)'} 
            />
            <XAxis 
              dataKey="category"
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount">
              {animatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UltraChart;
