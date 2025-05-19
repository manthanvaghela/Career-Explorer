import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import './App.css';

// Sample career data
const initialCareers = [
  {
    id: 1,
    title: "Software Engineer",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Design and develop software applications, systems, and solutions. Work with programming languages, frameworks, and tools to create efficient and scalable code.",
    categories: ["Technology", "Programming", "Problem Solving"]
  },
  {
    id: 2,
    title: "Data Scientist",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Analyze complex data sets to help guide business decisions. Use statistical methods, machine learning, and data visualization to extract insights.",
    categories: ["Analytics", "Mathematics", "Technology"]
  },
  {
    id: 3,
    title: "UX/UI Designer",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    description: "Create user-friendly interfaces and experiences for digital products. Combine creativity with user research to design intuitive and engaging applications.",
    categories: ["Design", "User Experience", "Creativity"]
  },
  {
    id: 4,
    title: "Digital Marketing Specialist",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80",
    description: "Develop and implement digital marketing strategies. Manage social media, content creation, and online advertising campaigns.",
    categories: ["Marketing", "Social Media", "Analytics"]
  },
  {
    id: 5,
    title: "Project Manager",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Lead and coordinate project teams to deliver successful outcomes. Manage timelines, resources, and stakeholder communication.",
    categories: ["Leadership", "Organization", "Communication"]
  }
];

function CareerCard({ career, onSwipe }) {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setCurrentX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const diff = currentX - startX;
      if (Math.abs(diff) > 100) {
        onSwipe(diff > 0 ? 'right' : 'left');
      } else {
        setCurrentX(startX);
      }
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${currentX - startX}px) rotate(${(currentX - startX) * 0.1}deg)`;
    }
  }, [currentX, startX]);

  return (
    <div
      ref={cardRef}
      className="career-card"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
      </div>
    </div>
  );
}

function SwipeInstructions() {
  return (
    <div className="swipe-instructions">
      <div className="instruction">
        <ThumbsUp className="icon" />
        <span>Swipe right for careers that interest you</span>
      </div>
      <div className="instruction">
        <ThumbsDown className="icon" />
        <span>Swipe left for careers that don't match your preferences</span>
      </div>
    </div>
  );
}

function ProgressIndicator({ current, total }) {
  const progress = (current / total) * 100;
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <span className="progress-text">{current} of {total} careers explored</span>
    </div>
  );
}

function ControlButtons({ onSwipe }) {
  return (
    <div className="control-buttons">
      <button onClick={() => onSwipe('left')} className="dislike-btn">
        <ThumbsDown />
      </button>
      <button onClick={() => onSwipe('right')} className="like-btn">
        <ThumbsUp />
      </button>
    </div>
  );
}

function ResultsSummary({ likedCareers, dislikedCareers }) {
  const allCareers = [...likedCareers, ...dislikedCareers];
  const categories = {};
  
  // Count category occurrences
  allCareers.forEach(career => {
    career.categories.forEach(category => {
      categories[category] = (categories[category] || 0) + 1;
    });
  });

  // Sort categories by count
  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Group careers by their primary category
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
      <h2>Your Career Exploration Results</h2>
      
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
                    {career.categories.map((cat, index) => (
                      <span key={index} className="tag">{cat}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="reset-button" onClick={() => window.location.reload()}>
        <RefreshCw className="icon" />
        Start Over
      </button>
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <h1>Career Explorer</h1>
      <p>Discover career paths that match your interests and preferences through an intuitive swipe interface.</p>
      <div className="instructions">
        <div className="instruction">
          <ThumbsUp className="icon" />
          <span>Swipe right for careers that interest you</span>
        </div>
        <div className="instruction">
          <ThumbsDown className="icon" />
          <span>Swipe left for careers that don't match your preferences</span>
        </div>
      </div>
      <button className="start-button" onClick={onStart}>
        Start Exploring Careers
      </button>
    </div>
  );
}

function App() {
  const [careers, setCareers] = useState(initialCareers);
  const [likedCareers, setLikedCareers] = useState([]);
  const [dislikedCareers, setDislikedCareers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSwipe = (direction) => {
    const currentCareer = careers[currentIndex];
    
    if (direction === 'right') {
      setLikedCareers([...likedCareers, currentCareer]);
    } else {
      setDislikedCareers([...dislikedCareers, currentCareer]);
    }

    if (currentIndex < careers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (showResults) {
    return <ResultsSummary likedCareers={likedCareers} dislikedCareers={dislikedCareers} />;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Career Explorer</h1>
        <ProgressIndicator current={currentIndex + 1} total={careers.length} />
      </div>

      <div className="career-container">
        {careers.slice(currentIndex, currentIndex + 3).map((career, index) => (
          <CareerCard
            key={career.id}
            career={career}
            onSwipe={handleSwipe}
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.1}) translateY(${index * 20}px)`
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