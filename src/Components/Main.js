import React, { useState, useEffect, useRef } from 'react';
import Santa from '../Components/Santa.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Main = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const canvasRef = useRef(null);
  const participantsRef = useRef(null); // Ref for participants section
  const [showScratchBoard, setShowScratchBoard] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (location.state?.name) {
      setCurrentUser(location.state.name);
    }
  }, [location.state]);

  const handleAddNameClick = () => {
    navigate('/add-name');
  };

  const handleViewParticipantsClick = async () => {
    try {
      const response = await fetch(`${apiUrl}/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
        participantsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        alert('Failed to fetch participants');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteParticipant = async (name) => {
    try {
      const response = await fetch(`${apiUrl}/participants/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant.name !== name)
        );
      } else {
        alert('Failed to delete participant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShuffleClick = async () => {
    try {
      const response = await fetch(`${apiUrl}/participants/assign?giver=${currentUser}`);
      if (response.ok) {
        const assignments = await response.json();
        const currentAssignment = assignments.find(
          (assignment) => assignment.giver === currentUser
        );

        setDisplayName(currentAssignment ? currentAssignment.receiver : 'Error');
        setShowScratchBoard(true);
        setTimeout(() => setupScratchCanvas(), 100); // Ensure canvas is set up after the board is rendered
      } else {
        alert('Failed to shuffle participants');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const setupScratchCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#999'; // Scratch layer color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isDrawing = false;

    const startDrawing = () => (isDrawing = true);
    const stopDrawing = () => (isDrawing = false);

    const draw = (e) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out'; // Erase instead of draw
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (isDrawing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  return (
    <main className="main">
      <button className="add-name" onClick={handleAddNameClick}>
        Add Name
      </button>
      <button className="shuffle" onClick={handleShuffleClick}>
        Shuffle
      </button>
      <img src={Santa} alt="Santa" className="santa" />
      <div className='button-container'>
      <button className="view-participants" onClick={handleViewParticipantsClick}>
        View Participants
      </button>
      </div>

      {showScratchBoard && (
        <div className="scratch-board-container">
          <canvas
            ref={canvasRef}
            width="300"
            height="150"
            className="scratch-board"
          ></canvas>
          <div className="hidden-name">{displayName}</div>
        </div>
      )}

      <section ref={participantsRef} className="participants-section">
        <h2 className='heading'>Participants</h2>
        <ul>
          {participants.map((participant, index) => (
            <div key={index} className="participant">
              <span className='participant-name'>{participant.name}</span>
              <button
                className="delete-button"
                onClick={() => handleDeleteParticipant(participant.name)}
              >
                <i className="fas fa-trash"></i> {/* Font Awesome Trash Icon */}
              </button>
            </div>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Main;
