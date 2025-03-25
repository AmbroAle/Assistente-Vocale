import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Il browser non supporta il riconoscimento vocale.</span>;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    resetTranscript(); 

    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data }]);
    } catch (error) {
      console.error("Errore nella comunicazione con l'IA:", error);
    }
  };

  return (
    <>
      <div className="chat-window">
        <div className="all-texts-window">
          {messages.map((msg, index) => (
            <div key={index} className="text-window">
              <strong>{msg.sender === "user" ? "Tu" : "IA"}: </strong>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className="input-window">
        <input
          className="input-text"
          type="text"
          placeholder="Scrivi o usa la voce..."
          value={transcript || input} 
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={SpeechRecognition.startListening}>🎤 Start</button>
        <button onClick={SpeechRecognition.stopListening}>⏹ Stop</button>
        <button onClick={resetTranscript}>🔄 Reset</button>
        <button className="input-button" onClick={sendMessage}>Invia</button>
      </div>
    </>
  );
};

export default Dashboard;