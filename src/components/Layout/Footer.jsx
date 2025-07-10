// FileName: MultipleFiles/Footer.jsx
import React, { useState } from 'react';
import { FaLinkedin, FaGithub, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../../styles/Footer.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <motion.footer 
      className="glassy-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glowing divider */}
      <div className="glow-divider"></div>

      {/* Main content */}
      <div className="footer-core">
        {/* Rocket logo with glow */}
        <motion.div 
          className="logo-group"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="rocket-container"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaRocket className="rocket-icon" />
            <div className="rocket-glow"></div>
          </motion.div>
          <h3 className="app-name">{t('footer.app.name')}</h3> {/* Translated */}
          <p className="tagline">{t('footer.tagline')}</p> {/* Translated */}
        </motion.div>

        {/* Social links with holographic effect */}
        <div className="social-group">
          <motion.a
            href="https://linkedin.com/in/fahad-alshwihani/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ y: -3 }}
            onMouseEnter={() => setHoveredIcon('linkedin')}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <div className="social-icon-wrapper">
              <FaLinkedin className="social-icon" />
              <div className="icon-glow"></div>
            </div>
            {hoveredIcon === 'linkedin' && (
              <motion.span 
                className="holographic-tooltip"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t('footer.connect')} {/* Translated */}
              </motion.span>
            )}
          </motion.a>

          <motion.a
            href="https://github.com/FahadAlshwihani"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ y: -3 }}
            onMouseEnter={() => setHoveredIcon('github')}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <div className="social-icon-wrapper">
              <FaGithub className="social-icon" />
              <div className="icon-glow"></div>
            </div>
            {hoveredIcon === 'github' && (
              <motion.span 
                className="holographic-tooltip"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t('footer.code')} {/* Translated */}
              </motion.span>
            )}
          </motion.a>
        </div>

        {/* Copyright with subtle glow */}
        <motion.p 
          className="copyright"
          whileHover={{ scale: 1.01 }}
        >
          © {new Date().getFullYear()} {t('footer.copyright')} {/* Translated */}
        </motion.p>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, Math.random() * 15 - 7.5],
              x: [0, Math.random() * 10 - 5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
};

export default Footer;
