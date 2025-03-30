import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Markdown from 'react-markdown'

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
    <main>
        <ul className="chat-window">
          {messages.map((msg, index) => (
            <li key={index} className="text-window">
              <span className="text-sender">{msg.sender === "user" ? "Tu" : "IA"}:</span><Markdown>{msg.text}</Markdown>
            </li>
          ))}
        </ul>
      <form onSubmit={(e) => { e.preventDefault() ; sendMessage() }} className="input-window">
        <input
          className="input-text"
          type="text"
          placeholder="Scrivi o usa la voce..."
          value={transcript || input} 
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="button-window">
          <input type="button" className="input-button"onClick={SpeechRecognition.startListening} value={"🎙️ start"}/>
          <input type="button" className="input-button" onClick={SpeechRecognition.stopListening} value={"⏹ Stop"} />
          <input type="reset" className="input-button" onClick={() => {resetTranscript();setInput("")}} value={"🔄 Reset"}/>
        </div>
      </form>
    </main>
  );
};

export default Dashboard;