import "./ChatWindow.css";
import Chat from "./Chat.jsx";

import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
const API_URL = import.meta.env.VITE_API_URL;


function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    user,
    setUser,
    darkMode,
    setDarkMode,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search works only in Chrome browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setPrompt(text);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const getReply = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;

    setLoading(true);
    setNewChat(false);
    setPrompt("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userPrompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json();

      setReply(res.reply);

      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: userPrompt,
        },
        {
          role: "assistant",
          content: res.reply,
        },
      ]);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("rosieUser");
    setUser(null);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="logoText">RosieGPT 🌹</div>

        <div className="navRight">
          <div
            className="themeToggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </div>

          <div className="profileSection">
            <div
              className="userProfile"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="userAvatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <span className="userName">{user?.name}</span>

              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {showDropdown && (
              <div className="dropdownMenu">
                <p>{user?.email}</p>

                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chat">
        <Chat />
      </div>

      {loading && (
        <div className="loaderDiv">
          <ScaleLoader color="#ff4fa3" />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder={listening ? "Listening..." : "Ask anything..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getReply();
              }
            }}
          />

          <div
            className={listening ? "micIcon activeMic" : "micIcon"}
            onClick={startListening}
          >
            <i className="fa-solid fa-microphone"></i>
          </div>

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          {listening ? "🎤 Listening..." : "RosieGPT can make mistakes 🌸"}
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;