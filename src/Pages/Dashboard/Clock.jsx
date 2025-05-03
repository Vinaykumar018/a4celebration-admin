import React, { useEffect } from 'react';

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      // Calculate degrees for clock hands
      const hourDeg = hours * 30 + (minutes * 0.5); // 30 degrees per hour + 0.5 degrees per minute
      const minuteDeg = minutes * 6; // 6 degrees per minute
      const secondDeg = seconds * 6; // 6 degrees per second
      
      // Rotate clock hands
      const hourHand = document.querySelector('.hour-hand');
      const minuteHand = document.querySelector('.minute-hand');
      const secondHand = document.querySelector('.second-hand');
      const digitalTime = document.getElementById('txt');
      
      if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
      
      // Update digital time display
      if (digitalTime) {
        digitalTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    };

    const clockInterval = setInterval(updateClock, 1000);
    updateClock(); // Initial call

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="clock-container">
      <div className="clockbox">
        <svg id="clock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100" height="100">
          {/* Clock face */}
          <g id="face">
            <circle className="circle" cx="300" cy="300" r="250" fill="#f8f9fa" stroke="#333" strokeWidth="2"/>
            
            {/* Hour marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              const x1 = 300 + Math.sin(angle * Math.PI / 180) * 230;
              const y1 = 300 - Math.cos(angle * Math.PI / 180) * 230;
              const x2 = 300 + Math.sin(angle * Math.PI / 180) * 200;
              const y2 = 300 - Math.cos(angle * Math.PI / 180) * 200;
              return (
                <line 
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#333"
                  strokeWidth="8"
                />
              );
            })}
            
            {/* Center dot */}
            <circle className="mid-circle" cx="300" cy="300" r="10" fill="#333"/>
          </g>
          
          {/* Hour hand */}
          <g id="hour" transform="rotate(0, 300, 300)">
            <path 
              className="hour-hand" 
              d="M300,300 L300,150" 
              stroke="#333" 
              strokeWidth="10" 
              strokeLinecap="round"
              transform-origin="300px 300px"
            />
          </g>
          
          {/* Minute hand */}
          <g id="minute" transform="rotate(0, 300, 300)">
            <path 
              className="minute-hand" 
              d="M300,300 L300,100" 
              stroke="#333" 
              strokeWidth="6" 
              strokeLinecap="round"
              transform-origin="300px 300px"
            />
          </g>
          
          {/* Second hand */}
          <g id="second" transform="rotate(0, 300, 300)">
            <path 
              className="second-hand" 
              d="M300,300 L300,80" 
              stroke="#ff0000" 
              strokeWidth="2" 
              strokeLinecap="round"
              transform-origin="300px 300px"
            />
            <circle cx="300" cy="300" r="5" fill="#ff0000"/>
          </g>
        </svg>
      </div>
      <div className="digital-time" id="txt"></div>
      
      <style jsx>{`
        .clock-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .clockbox {
          width: 70px;
          height: 40px;
        }
        .digital-time {
          font-family: 'Arial', sans-serif;
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
          color: #fff;
        }
        .hour-hand, .minute-hand, .second-hand {
          transform-origin: 300px 300px;
          transition: transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Clock;