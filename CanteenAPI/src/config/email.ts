import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";

const email = "support@canimagemediatech.com";

/**
 * Create transporter
 */
const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: email,
    pass: "qwbywkmmrfzxqwsm", // ⚠️ move this to env in production
  },
  tls: {
    rejectUnauthorized: true,
  },
});

/**
 * Email payload type
 */
interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
}

/**
 * Generic Send Email Function
 */
export const sendEmail = async (options: SendMailOptions) => {
  try {
    const info: SentMessageInfo = await transporter.sendMail({
      from: options.from ?? `CanImage Support <${email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      cc: options.cc,
    });

    return {
      success: true,
      message: "Email sent successfully",
      data: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    };

  } catch (error: any) {
    return {
      success: false,
      message: "Email sending failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
};
