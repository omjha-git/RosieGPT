import "./Chat.css";

import { useContext } from "react";
import { MyContext } from "./MyContext";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats } = useContext(MyContext);

  return (
    <div className="chat">
      {newChat && prevChats.length === 0 && (
        <div className="welcome">
          <h1>🌸 Hello, Om</h1>
          <p>How can RosieGPT help you today?</p>
        </div>
      )}

      <div className="chats">
        {prevChats?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <div className="gptMessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;