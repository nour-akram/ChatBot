import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";

export const LoginModal = ({ show, onHide }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { loginError } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (loginError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const handleLoginSubmit = async (data) => {
    dispatch(loginUser(data)).then((action) => {
      if (action.type === "auth/loginUser/rejected") {
        return;
      }
      reset();
      onHide();
    });
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showError && (
          <Alert variant="danger" className="mb-3">
            {loginError}
          </Alert>
        )}
        <Form onSubmit={handleSubmit(handleLoginSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label
              style={{
                background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Username
            </Form.Label>
            <Form.Control
              type="text"
              {...register("username", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label
              style={{
                background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Password
            </Form.Label>
            <Form.Control
              type="password"
              {...register("password", { required: true })}
            />
          </Form.Group>
          <Button
            variant="none"
            style={{ background: "linear-gradient(135deg, #ac1ed6, #c26e73)", color: "white" }}
            type="submit"
          >
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
