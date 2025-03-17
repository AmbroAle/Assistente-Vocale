import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <section className="dashboard-window">
        <h2>Chat con l'IA</h2>
      </section>

      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div className="controls">
            <p>Status: {status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            {mediaBlobUrl && (
              <audio src={mediaBlobUrl} controls autoPlay loop />
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Dashboard;