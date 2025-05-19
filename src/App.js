import React, { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, Moon, Sun } from 'lucide-react';
import { careers } from './career-data';
import './App.css';

const CareerCard = ({ career, onSwipe, style }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
    setCurrentY(e.clientY);
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const rotation = deltaX * 0.1;
    const scale = 1 - Math.abs(deltaX) * 0.001;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg) scale(${scale})`;
      cardRef.current.style.transition = 'none';
      
      // Add opacity based on swipe direction
      if (deltaX > 0) {
        cardRef.current.style.opacity = 1 - Math.abs(deltaX) * 0.002;
      } else {
        cardRef.current.style.opacity = 1 - Math.abs(deltaX) * 0.002;
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = currentX - startX;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'all 0.3s ease-out';
      
      if (Math.abs(deltaX) > 100) {
        const direction = deltaX > 0 ? 'right' : 'left';
        const translateX = direction === 'right' ? window.innerWidth : -window.innerWidth;
        cardRef.current.style.transform = `translate(${translateX}px, ${currentY - startY}px) rotate(${deltaX * 0.1}deg)`;
        cardRef.current.style.opacity = '0';
        
        setTimeout(() => {
          onSwipe(direction);
        }, 300);
      } else {
        cardRef.current.style.transform = style.transform;
        cardRef.current.style.opacity = style.opacity;
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className="career-card"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        ...style,
        transition: 'all 0.3s ease-out'
      }}
    >
      <img src={career.image} alt={career.title} />
      <div className="career-info">
        <h2>{career.title}</h2>
        <p>{career.description}</p>
        <div className="categories">
          {career.categories.map((category, index) => (
            <span key={index} className="category-tag">{category}</span>
          ))}
        </div>
        <div className="career-insights">
          <div className="insight-item">
            <span className="insight-label">Avg Salary:</span>
            <span className="insight-value">{career.salary || '₹12 LPA'}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Top Skill:</span>
            <span className="insight-value">{career.topSkill || 'JavaScript'}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Career Growth:</span>
            <span className="insight-value growth-high">🔼 High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SwipeInstructions = () => (
  <div className="swipe-instructions">
    <div className="instruction">
      <ThumbsDown className="icon" />
      <span>Swipe left to dislike</span>
    </div>
    <div className="instruction">
      <ThumbsUp className="icon" />
      <span>Swipe right to like</span>
    </div>
  </div>
);

const ProgressIndicator = ({ current, total }) => {
  const progress = (current / total) * 100;
  const status = current === 1 ? "Discovering Your Fit..." : 
                current === total ? "Finalizing Your Journey..." :
                `Card ${current} of ${total}`;
                
  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="progress-text">{status}</span>
    </div>
  );
};

const ControlButtons = ({ onSwipe }) => (
  <div className="control-buttons">
    <button className="dislike-btn" onClick={() => onSwipe('left')}>
      <ThumbsDown />
      <span className="button-label">Dislike</span>
    </button>
    <button className="like-btn" onClick={() => onSwipe('right')}>
      <ThumbsUp />
      <span className="button-label">Like</span>
    </button>
  </div>
);

const ResultsSummary = ({ likedCareers, onReset }) => {
  const categories = {};
  likedCareers.forEach(career => {
    career.categories.forEach(category => {
      categories[category] = (categories[category] || 0) + 1;
    });
  });

  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const groupedCareers = likedCareers.reduce((acc, career) => {
    const primaryCategory = career.categories[0];
    if (!acc[primaryCategory]) {
      acc[primaryCategory] = [];
    }
    acc[primaryCategory].push(career);
    return acc;
  }, {});

  return (
    <div className="results-summary">
      <h2>Your Career Matches</h2>
      
      <div className="top-categories">
        <h3>Top Career Categories</h3>
        <div className="category-list">
          {sortedCategories.map(([category, count]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <span className="category-count">{count} matches</span>
            </div>
          ))}
        </div>
      </div>

      <div className="career-recommendations">
        <h3>Recommended Career Paths</h3>
        {Object.entries(groupedCareers).map(([category, careers]) => (
          <div key={category} className="career-group">
            <h4>{category}</h4>
            <div className="career-list">
              {careers.map(career => (
                <div key={career.id} className="career-item">
                  <h5>{career.title}</h5>
                  <p>{career.description}</p>
                  <div className="career-tags">
                    {career.skills.map((skill, index) => (
                      <span key={index} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="reset-button" onClick={onReset}>
        <RefreshCw className="icon" />
        Start Over
      </button>
    </div>
  );
};

const WelcomeScreen = ({ onStart }) => (
  <div className="welcome-screen">
    <h1>Career Explorer</h1>
    <p>
      Discover career paths that match your interests and preferences through an intuitive swipe interface.
      Explore various professions and find your perfect career match!
    </p>
    <div className="instructions">
      <div className="instruction">
        <ThumbsUp className="icon" />
        <span>Swipe right to like careers that interest you</span>
      </div>
      <div className="instruction">
        <ThumbsDown className="icon" />
        <span>Swipe left to dislike careers that don't match your preferences</span>
      </div>
    </div>
    <button className="start-button" onClick={onStart}>
      Start Exploring Careers
    </button>
  </div>
);

function App() {
  const [careerList, setCareerList] = useState(careers);
  const [likedCareers, setLikedCareers] = useState([]);
  const [dislikedCareers, setDislikedCareers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSwipe = (direction) => {
    const currentCareer = careerList[currentIndex];
    if (direction === 'right') {
      setLikedCareers([...likedCareers, currentCareer]);
    } else {
      setDislikedCareers([...dislikedCareers, currentCareer]);
    }

    if (currentIndex < careerList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedCareers([]);
    setDislikedCareers([]);
    setShowResults(false);
    setHasStarted(false);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (showResults) {
    return <ResultsSummary likedCareers={likedCareers} onReset={handleReset} />;
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <div className="header-content">
          <h1>Career Explorer</h1>
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        <ProgressIndicator current={currentIndex + 1} total={careerList.length} />
      </div>

      <div className="career-container">
        {careerList.slice(currentIndex, currentIndex + 3).map((career, index) => (
          <CareerCard
            key={career.id}
            career={career}
            onSwipe={handleSwipe}
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.1}) translateY(${index * 20}px)`,
              opacity: index === 0 ? 1 : 0.8,
              pointerEvents: index === 0 ? 'auto' : 'none'
            }}
          />
        ))}
      </div>

      <SwipeInstructions />
      <ControlButtons onSwipe={handleSwipe} />
    </div>
  );
}

export default App;
