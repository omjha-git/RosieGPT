import "./Sidebar.css";
import cuteAnimal from "./assets/cute.webp.webp";

import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "./MyContext.jsx";
const API_URL = import.meta.env.VITE_API_URL;
function Sidebar() {
  const {
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
    setPrompt,
    setReply,
  } = useContext(MyContext);

  const [threads, setThreads] = useState([]);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/thread`);
      const data = await response.json();
      setThreads(data);
    } catch (err) {
      console.log(err);
    }
  };

  const createNewChat = () => {
    setCurrThreadId(uuidv4());
    setPrevChats([]);
    setNewChat(true);
    setPrompt("");
    setReply(null);
  };

  const openThread = async (threadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`);
      const data = await response.json();

      setCurrThreadId(threadId);
      setPrevChats(data);
      setNewChat(false);
      setPrompt("");
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (e, threadId) => {
    e.stopPropagation();

    try {
      await fetch(`${API_URL}/api/thread/${threadId}`, {
        method: "DELETE",
      });

      if (currThreadId === threadId) {
        createNewChat();
      }

      getAllThreads();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  return (
    <section className="sidebar">
      <button className="newChatBtn" onClick={createNewChat}>
        <img src={cuteAnimal} alt="cute animal" className="logo" />
        <span>New Chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      <ul className="history">
        {threads.map((thread) => (
          <li
            key={thread._id}
            onClick={() => openThread(thread.threadId)}
            className={currThreadId === thread.threadId ? "activeThread" : ""}
          >
            <span>{thread.title}</span>

            <i
              className="fa-solid fa-trash deleteIcon"
              onClick={(e) => deleteThread(e, thread.threadId)}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">Made with ❤️ by Om Jha</div>
    </section>
  );
}

export default Sidebar;