import React, { useState } from "react";
import { Modal, Button, Typography, Input, message } from "antd";

const { Text } = Typography;

interface Props {
  open: boolean;
  username: string;
  setUsername: () => void;
  onClose: () => void;
  onSend: (username: string) => void;
}

function ForgetPassWordModal({
  open,
  onClose,
  onSend,
  username,
  setUsername,
}: Props) {
  const handleSend = () => {
    if (!username.trim()) {
      message.warning("Please enter your username");
      return;
    }

    onSend(username); // 🔥 send to parent
    setUsername("");
  };

  return (
    <Modal
      title="Forgot Password"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        <Text>Enter your username to receive a reset code.</Text>

        <Input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button type="primary" block onClick={handleSend}>
          Send Reset Code
        </Button>
      </div>
    </Modal>
  );
}

export default ForgetPassWordModal;
