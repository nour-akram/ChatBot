import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import { addMessageToChat } from "../../redux/slices/chatSlice";
import HistoryChat from "./HistoryChat";
import "./ChatBody.css";
import { formatDistanceToNow } from "date-fns";


const ChatBody = ({ selectedModel }) => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const userMessage = {
      content: inputMessage,
      senderType: "user",
    };

    try {
      setIsLoading(true);

      await dispatch(
        addMessageToChat({ chatId: selectedChat._id, message: userMessage })
      );

      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        ...selectedChat.messages.map((msg) => ({
          role: msg.senderType === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: inputMessage },
      ];

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages,
          }),
        }
      );

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      const newAIMessage = {
        content: aiReply,
        senderType: "assistant",
      };

      await dispatch(
        addMessageToChat({ chatId: selectedChat._id, message: newAIMessage })
      );

      setInputMessage("");
    } catch (err) {
      console.error("Message send error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex chat-content"
      style={{ height: "90.8vh", backgroundColor: "#000" }}
    >
      <HistoryChat />

      <div className="d-flex flex-column flex-grow-1">
        <div
          className="flex-grow-1 p-3 overflow-auto"
          style={{
            backgroundImage: "url('https://i.redd.it/ts7vuoswhwf41.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            maxHeight: "100vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {selectedChat?.messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-2 ${
                msg.senderType === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className="p-1 my-1"
                style={{
                  maxWidth: "60%",
                  wordWrap: "break-word",
                  borderRadius:
                    msg.senderType === "user"
                      ? "15px 15px 0px 15px"
                      : "15px 15px 15px 0px",
                  background:
                    msg.senderType === "user"
                      ? "linear-gradient(135deg, #ac1ed6, #c26e73)"
                      : "rgb(0, 0, 0)",
                  color: "white",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  boxShadow:
                    "8px 8px 5px rgba(0, 0, 0, 0.2), -8px -8px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {msg.senderType !== "user" && (
                  <img
                    src="https://i.pinimg.com/736x/82/47/55/8247558e54f9635b7f9cdd601483e37b.jpg"
                    alt="robot"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-1 fs-6">{msg.content}</p>
                    {msg.senderType === "user" && (
                      <img src="double-tick.png" alt="true" />
                    )}
                  </div>
                  <small style={{ fontSize: "12px", opacity: 0.7 }}>
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    }).replace("about ", "")}
                  </small>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="d-flex align-items-center">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-2 d-flex align-items-center bg-black">
          <Form.Control
            as="textarea"
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="me-2 bg-dark text-light"
            style={{ resize: "none" }}
          />
          <Button
            variant="link"
            onClick={handleSendMessage}
            className="p-0 border-0"
            style={{ background: "none" }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="send-icon-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ac1ed6" />
                    <stop offset="100%" stopColor="#c26e73" />
                  </linearGradient>
                </defs>
              </svg>
              <SendIcon
                style={{
                  transform: "rotate(-45deg)",
                  fill: "url(#send-icon-gradient)",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
