import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";

export const RegisterModal = ({ show, onHide }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { registerError } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (registerError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [registerError]);

  const handleRegisterSubmit = async (data) => {
    dispatch(registerUser(data)).then((action) => {
      if (action.type === "auth/registerUser/rejected") {
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
        style={{
          background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        closeButton
      >
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showError && (
          <Alert variant="danger" className="mb-3">
            {registerError}
          </Alert>
        )}
        <Form onSubmit={handleSubmit(handleRegisterSubmit)}>
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
            style={{
              background: "linear-gradient(135deg, #ac1ed6, #c26e73)",
              color: "white",
            }}
            type="submit"
          >
            Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
