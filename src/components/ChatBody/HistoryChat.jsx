import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  addChat,
  updateChat,
  deleteChat,
  setSelectedChat,
} from "../../redux/slices/chatSlice";
import { IoIosAddCircle } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { Modal, Button, Form, Popover, OverlayTrigger } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

const HistoryChat = () => {
  const dispatch = useDispatch();
  const { chatHistory, loading, error, selectedChat } = useSelector(
    (state) => state.chat
  );

  // console.log("chatHistory", chatHistory);

  const handleChatClick = (chat) => {
    dispatch(setSelectedChat(chat));
  };
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [editingChat, setEditingChat] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchChatHistory());
    }
  }, [dispatch, accessToken]);

  const handleAddClick = () => {
    setEditingChat(null);
    setModalTitle("");
    setShowModal(true);
  };

  const handleEditClick = (chat) => {
    setEditingChat(chat);
    setModalTitle(chat.title);
    setShowModal(true);
  };

  const handleDeleteClick = (chat) => {
    setChatToDelete(chat);
    setShowConfirmation(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalTitle) {
      setErrMsg("Title is required");
      return;
    }

    if (editingChat) {
      dispatch(updateChat({ id: editingChat._id, title: modalTitle }))
        .then(() => {
          setShowModal(false);
          setErrMsg("");
        })
        .catch((error) => {
          setErrMsg(error);
        });
    } else {
      dispatch(addChat({ title: modalTitle }))
        .then(() => {
          setShowModal(false);
          setErrMsg("");
        })
        .catch((error) => {
          setErrMsg(error);
        });
    }
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await dispatch(deleteChat(chatToDelete._id));
      setShowConfirmation(false);
      setChatToDelete(null);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const popover = (chat) => (
    <Popover id="popover-basic">
      <Popover.Body
        className="d-flex flex-column p-1"
        style={{
          background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <Button
          variant="link"
          className=" fs-6 fw-bold"
          onClick={() => handleEditClick(chat)}
        >
          Edit
        </Button>
        <Button
          variant="link"
          className="fs-6 fw-bold"
          onClick={() => handleDeleteClick(chat)}
        >
          Delete
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <div
      className={`p-3  history-chat   ${selectedChat ?"dnonehistoryChat" : "d-block"}`}
      style={{
        minWidth: "18%",
      }}
    >
      <h5
        className={`mb-5 fw-bolder fs-4 d-flex justify-content-between align-items-center mb-4`}
        style={{
          background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <p className="m-0">Chat History</p>

        <div style={{ position: "relative", display: "inline-block" }}>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ac1ed6" />
                <stop offset="100%" stopColor="#c26e73" />
              </linearGradient>
            </defs>
          </svg>
          <IoIosAddCircle
            style={{
              cursor: "pointer",
              fontSize: "30px",
              fill: "url(#gradient)",
            }}
            onClick={handleAddClick}
          />
        </div>
      </h5>

      {loading && <p style={{ color: "white" }}>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ul className="list-unstyled">
          {chatHistory.map((chat) => {
            const displayTime =
              chat.updatedAt !== chat.createdAt
                ? `Updated ${formatDistanceToNow(new Date(chat.updatedAt))} ago`
                : `Created ${formatDistanceToNow(
                    new Date(chat.createdAt)
                  )} ago`;

            return (
              <li
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`p-2 mb-3 rounded fs-5 fw-semibold d-flex justify-content-between align-items-start `}
                style={{
                  cursor: "pointer",
                  // border: "1px solid white",
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  boxShadow: "1px 1px 15px rgb(59, 2, 77)",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex flex-column">
                  <p className="m-0">{chat.title}</p>
                  <small
                    style={{
                      color: "white",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {displayTime}
                  </small>
                </div>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={popover(chat)}
                  rootClose
                >
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id={`kebab-gradient-${chat._id}`}
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
                    <CiMenuKebab
                      style={{
                        cursor: "pointer",
                        fontSize: "30px",
                        rotate: "90deg",
                        fill: `url(#kebab-gradient-${chat._id})`,
                      }}
                    />
                  </div>
                </OverlayTrigger>
              </li>
            );
          })}
        </ul>
      </div>
      {/*  */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <Modal.Title>{editingChat ? "Edit Chat" : "Add Chat"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Title
              </Form.Label>
              <Form.Control
                type="text"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
              />
              {errMsg && <p className="text-danger">{errMsg}</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="none"
            style={{
              background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
              color: "white",
            }}
            onClick={(e) => handleModalSubmit(e)}
          >
            {editingChat ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/*  */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this chat:{"   "}
          <span className="fw-bold fs-5">{chatToDelete?.title}</span> ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistoryChat;
