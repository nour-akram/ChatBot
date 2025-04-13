import React, { useState } from "react";
import { Button, Dropdown, DropdownButton, Offcanvas } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import { LoginModal } from "../LoginModel/LoginModal";
import { RegisterModal } from "../RegisterModel/RegisterModal";
import { RiLoginCircleFill } from "react-icons/ri";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import { setSelectedChat } from "../../redux/slices/chatSlice";

const Header = ({ selectedModel, setSelectedModel }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const models = [
    { name: "meta-llama/llama-4-maverick", task: "Chat, Reasoning, Coding" },
    {
      name: "google/gemini-2.5-pro-exp-03-25:free",
      task: "Multimodal (Text + Vision), Reasoning",
    },
    { name: "deepseek/deepseek-chat-v3-0324", task: "Chat, Coding, Reasoning" },
    {
      name: "qwen/qwen-2.5-coder-32b-instruct",
      task: "Advanced Code Generation",
    },
  ];

  const { selectedChat } = useSelector((state) => state.chat);
  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setSelectedChat(null));
  };

  const handelBack = () => {
    dispatch(setSelectedChat(null));
  };

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center p-2`}
        style={{ backgroundColor: "#000" }}
      >
        <div style={{ position: "relative" }} className="d-sm-none">
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="menu-icon-gradient"
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
          <Button
            variant="none"
            onClick={() => setShowMenu(true)}
            style={{
              background: "transparent",
            }}
          >
            <MenuIcon
              style={{
                fontSize: "30px", // Icon size
                fill: "url(#menu-icon-gradient)", // Apply the gradient
                cursor: "pointer", // Pointer cursor for interactivity
              }}
            />
          </Button>
        </div>

        <div className="d-none d-sm-block">
          <DropdownButton
            id="dropdown-basic-button"
            title={<span style={{ color: "white",fontSize:"14px" }}>{selectedModel}</span>}
            variant="none"
            className="custom-dropdown rounded "
            style={{
              background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
            }}
          >
            {models.map((model) => (
              <Dropdown.Item
                key={model.name}
                onClick={() => handleModelSelect(model.name)}
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {model.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        <div className="d-flex align-items-center">
          {!accessToken ? (
            <>
              <Button
                className="me-2 d-none d-sm-block px-2 py-1"
                variant="none"
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  color: "white",
                }}
                onClick={() => setShowLoginModal(true)}
              >
                <RiLoginCircleFill className="me-1" />
                Login
              </Button>
              <Button
                className="me-3 d-none d-sm-block px-2 py-1"
                variant="none"
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  color: "white",
                }}
                onClick={() => setShowRegisterModal(true)}
              >
                <FaSignOutAlt className="me-1" />
                Register
              </Button>
            </>
          ) : (
            <Button
              className="me-3 d-none d-sm-block px-2 py-1"
              variant="none"
              style={{
                background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                color: "white",
              }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </Button>
          )}

          <div
            style={{
              position: "relative",
            }}
            className={`${
              selectedChat ? "d-block d-md-none shownbackIcon" : "d-none"
            }`}
          >
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="back-icon-gradient"
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
            <IoArrowBackCircle
              style={{
                cursor: "pointer",
                fontSize: "30px",
                fill: "url(#back-icon-gradient)",
              }}
              onClick={handelBack}
            />
          </div>
        </div>
      </div>

      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
        style={{
          backgroundColor: "#000",
          color: "white",
        }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!accessToken ? (
            <>
              <Button
                className="w-100 mb-3"
                variant="none"
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  color: "white",
                }}
                onClick={() => setShowLoginModal(true)}
              >
                <RiLoginCircleFill className="me-1" />
                Login
              </Button>
              <Button
                className="w-100"
                variant="none"
                style={{
                  background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                  color: "white",
                }}
                onClick={() => setShowRegisterModal(true)}
              >
                <FaSignOutAlt className="me-1" />
                Register
              </Button>
            </>
          ) : (
            <Button
              className="w-100"
              variant="none"
              style={{
                background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                color: "white",
              }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </Button>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/*  */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
      <RegisterModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
      />
    </>
  );
};

export default Header;
