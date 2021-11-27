import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;

mic.interimResults = true;

mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue...')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('stopped mic')
      }
    }
    mic.onstart = () => {
      console.log('mic is on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>VOICE NOTES</h1>
      <div className="container">
        <div className="box">
          <h2>
            CURRENT NOTE
          </h2>
          {isListening ? <span>Recording...</span> : <span></span>} 
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>

        <div className="box">
          <h2>
            NOTES
          </h2>
          {savedNotes.map(n => (<p key={n}>{n}</p>))}
        </div>
      </div>
    </>
  );
}

export default App;