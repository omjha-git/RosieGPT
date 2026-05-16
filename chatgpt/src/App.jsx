import "./App.css";
import Login from "./login.jsx";

import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("rosieUser")) || null
  );

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    darkMode,
    setDarkMode,
    user,
    setUser,
  };

  if (!user) {
    return (
      <MyContext.Provider value={providerValues}>
        <Login />
      </MyContext.Provider>
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;