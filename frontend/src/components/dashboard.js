import React, { useState } from "react";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { sender: "ai", text: JSON.stringify(data) }]);
    } catch (error) {
      console.error("Errore nella comunicazione con l'IA:", error);
    }
  };

  return (
    <>
        <div className="chat-window">
          <div className="all-texts-window">
            {messages.map((msg) => (
              <div className="text-window">
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
              placeholder="Scrivi un messaggio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="input-button"
              onClick={sendMessage}
            >
              Invia
            </button>
        </div>
    </>
  );
};

export default Dashboard;