// FileName: MultipleFiles/About.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import '../styles/About.css'; // Scoped CSS for the About page
import MainLayout from '../components/Layout/MainLayout';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const About = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <MainLayout >
    <div className="about-container">
      <h1 className="about-title">{t('about.title')}</h1> {/* Translated */}
      <p className="about-intro">{t('about.intro')}</p> {/* Translated */}
      <p className="about-content">
        {t('about.content1')} {/* Translated */}
      </p>
      <p className="about-content">
        {t('about.content2')} {/* Translated */}
      </p>
      <p className="about-content">
        {t('about.content3')} {/* Translated */}
      </p>
      <p className="about-content">
        {t('about.content4')} {/* Translated */}
      </p>
      <ul className="about-list">
        <li>{t('about.list1')}</li> {/* Translated */}
        <li>{t('about.list2')}</li> {/* Translated */}
        <li>{t('about.list3')}</li> {/* Translated */}
        <li>{t('about.list4')}</li> {/* Translated */}
      </ul>
      <p className="about-content">
        {t('about.content5')} {/* Translated */}
      </p>
      <p className="about-content">
        {t('about.content6')} {/* Translated */}
      </p>
      <p className="about-thanks">{t('about.thanks')}</p> {/* Translated */}
      <div className="about-socials">
        <a href="https://linkedin.com/in/fahad-alshwihan" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaLinkedin />
        </a>
        <a href="https://github.com/FahadAlshwihani" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaGithub />
        </a>
      </div>
    </div>
    </MainLayout>
  );
};

export default About;
