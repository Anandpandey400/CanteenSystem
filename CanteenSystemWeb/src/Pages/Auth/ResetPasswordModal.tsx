import React, { useState } from "react";
import { Modal, Button, Input, Typography } from "antd";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
}

const ResetPasswordModal = ({ open, onClose, onSubmit }: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  const isValid = passwordRegex.test(password);
  const isMatch = password === confirmPassword;

  const handleSubmit = () => {
    if (!isValid) return;
    if (!isMatch) return;

    onSubmit(password);
  };

  return (
    <Modal
      title="Reset Your Password"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-5">
        <Text type="secondary">Your password must contain:</Text>

        {/* Validation checklist */}
        <div className="text-sm space-y-1">
          <div
            className={/\d/.test(password) ? "text-green-600" : "text-gray-400"}
          >
            • At least 1 number
          </div>
          <div
            className={
              /[!@#$%^&*(),.?":{}|<>]/.test(password)
                ? "text-green-600"
                : "text-gray-400"
            }
          >
            • At least 1 special character
          </div>
          <div
            className={
              password.length >= 6 ? "text-green-600" : "text-gray-400"
            }
          >
            • Minimum 6 characters
          </div>
        </div>

        <Input.Password
          size="large"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input.Password
          size="large"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          status={confirmPassword && !isMatch ? "error" : ""}
        />

        <Button
          type="primary"
          size="large"
          block
          disabled={!isValid || !isMatch}
          onClick={handleSubmit}
        >
          Update Password
        </Button>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
