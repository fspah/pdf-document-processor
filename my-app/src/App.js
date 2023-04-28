import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [pdfLink, setPdfLink] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/process-pdf', {
        pdfLink,
        question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F3F3F3',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };

  const answerStyle = {
    color: '#333',
    fontSize: '24px',
  };

  const titleStyle = {
    color: '#333',
    textAlign: 'center',
    margin: '20px 0'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>OpenAI Document Processor</h1>
      <form style={formStyle} onSubmit={handleFormSubmit}>
        <label>
          PDF Link:
          <input
            style={inputStyle}
            type="text"
            value={pdfLink}
            onChange={(e) => setPdfLink(e.target.value)}
          />
        </label>
        <label>
          Question:
          <input
            style={inputStyle}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <button style={buttonStyle} type="submit">Submit</button>
        {loading && <p>This may take several minutes depending on the size of the document...</p>}
      </form>
      <h1 style={answerStyle}>Answer: {answer}</h1>
    </div>
  );
}

export default App;
