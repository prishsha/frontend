import React from 'react';
import '../Components/AddName.css';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL; // Define API URL once at the top

const AddName = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;

    try {
      const response = await fetch(`${apiUrl}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        alert('Name and email added successfully!');
        // Navigate back to Main and pass the name dynamically
        navigate('/', { state: { name } });
      } else {
        alert('Failed to add name and email.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='add-name-page'>
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='eg. Jane Doe'
          required
        />

        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          id='email'
          name='email'
          required
          placeholder='eg. janedoe@gmail.com'
        />

        <button type='submit' className='submit'>
          Submit
        </button>
      </form>
      <button className='back' onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
};

export default AddName;
