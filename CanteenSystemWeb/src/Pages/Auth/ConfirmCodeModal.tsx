import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, message, Typography } from "antd";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const ConfirmCodeModal = ({ open, onClose, onVerify }: Props) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ Auto focus first input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    }
  }, [open]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    // Handle paste full code
    if (value.length === 4) {
      const pasted = value.split("").slice(0, 4);
      setOtp(pasted);
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 4) {
      message.warning("Please enter complete 4-digit code");
      return;
    }

    onVerify(code);
    setOtp(["", "", "", ""]);
  };

  return (
    <Modal
      title="Enter Confirmation Code"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-6">
        <Text type="secondary" className="text-center">
          Code sent successfully to{" "}
          <Text strong>admin.hr@canimagemediatech.com</Text>
        </Text>

        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={4} // allow paste
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center text-2xl font-semibold border rounded-lg focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>

        <Button type="primary" block size="large" onClick={handleVerify}>
          Verify Code
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmCodeModal;
