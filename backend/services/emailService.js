const nodemailer = require("nodemailer");

/**
 * Create an email transporter according to the environment.
 * In production it uses Gmail, in development it uses Ethereal or local SMTP.
 * @function createTransporter
 * @returns {Object} Configured nodemailer transporter.
 */
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "test@example.com",
        pass: process.env.SMTP_PASSWORD || "test",
      },
    });
  }
};

/**
 * Send an account verification email to the user.
 * @async
 * @function sendVerificationEmail
 * @param {string} userEmail - The user's email address.
 * @param {string} userName - The user's display name.
 * @param {string} verificationToken - Unique verification token.
 * @returns {Promise<Object>} Object with success (boolean) and the sent messageId.
 * @throws {Error} If sending the email fails.
 */
const sendVerificationEmail = async (
  userEmail,
  userName,
  verificationToken
) => {
  try {
    const transporter = createTransporter();

    // URL de verificación (ajustar según el frontend)
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email/${verificationToken}`;

    // Opciones del email
    const mailOptions = {
      from: `"BossFlow" <${process.env.EMAIL_FROM || "noreply@bossflow.com"}>`,
      to: userEmail,
      subject: "Verify your BossFlow account",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #1F2D44;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #1F2D44 0%, #2d4263 100%);
                            color: white;
                            padding: 40px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 32px;
                            color: #EAB308;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .content h2 {
                            color: #1F2D44;
                            margin-top: 0;
                        }
                        .content p {
                            color: #5a6c7d;
                            margin: 15px 0;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 40px;
                            background: #EAB308;
                            color: #1F2D44;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            margin: 20px 0;
                            transition: background 0.3s ease;
                        }
                        .button:hover {
                            background: #d69e07;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #5a6c7d;
                            font-size: 14px;
                            border-top: 1px solid #e9ecef;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #EAB308;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .warning p {
                            margin: 0;
                            color: #856404;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>BossFlow</h1>
                        </div>
                        <div class="content">
                            <h2>Welcome to BossFlow, ${userName}!</h2>
                            <p>Thanks for signing up to BossFlow. To complete your registration and start creating flow diagrams, please verify your email address.</p>

                            <p>Click the button below to verify your account:</p>

                            <div style="text-align: center;">
                              <a href="${verificationUrl}" class="button">Verify my account</a>
                            </div>

                            <div class="warning">
                              <p><strong>This link will expire in 24 hours.</strong> If you do not verify within this time, you will need to request a new verification email.</p>
                            </div>

                            <p>If you did not create this account, you can safely ignore this email.</p>

                            <p style="margin-top: 30px; font-size: 14px; color: #7a8896;">
                              If the button does not work, copy and paste this link into your browser:<br>
                              <a href="${verificationUrl}" style="color: #EAB308; word-break: break-all;">${verificationUrl}</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} BossFlow. All rights reserved.</p>
                            <p>This is an automated email, please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
      text: `
    Welcome to BossFlow, ${userName}!

    Thanks for signing up to BossFlow. To complete your registration and start creating flow diagrams, please verify your email address.

    Click the following link to verify your account:
    ${verificationUrl}

    This link will expire in 24 hours. If you do not verify within this time, you will need to request a new verification email.

    If you did not create this account, you can safely ignore this email.

    © ${new Date().getFullYear()} BossFlow. All rights reserved.
        `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Verification email sent:", info.messageId);

    // In development with Ethereal, show preview URL
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Email preview URL:",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Could not send verification email");
  }
};

/**
 * Send a welcome email to the user after they have verified their account.
 * @async
 * @function sendWelcomeEmail
 * @param {string} userEmail - The user's email address.
 * @param {string} userName - The user's display name.
 * @returns {Promise<void>} Resolves when the email has been sent.
 * @throws {Error} If sending the email fails.
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"BossFlow" <${process.env.EMAIL_FROM || "noreply@bossflow.com"}>`,
      to: userEmail,
      subject: "Account verified — Welcome to BossFlow",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #1F2D44;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #1F2D44 0%, #2d4263 100%);
                            color: white;
                            padding: 40px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 32px;
                            color: #EAB308;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 40px;
                            background: #EAB308;
                            color: #1F2D44;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #5a6c7d;
                            font-size: 14px;
                            border-top: 1px solid #e9ecef;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>BossFlow</h1>
                        </div>
                        <div class="content">
                            <h2>Your account has been successfully verified!</h2>
                            <p>Hello ${userName},</p>
                            <p>Congratulations! Your BossFlow account has been verified and you can now start using all features.</p>

                            <p>With BossFlow you can:</p>
                            <ul>
                                <li>Create interactive flow diagrams</li>
                                <li>Collaborate with other users</li>
                                <li>Use predefined templates</li>
                            </ul>

                            <div style="text-align: center;">
                                <a href="${
                                  process.env.FRONTEND_URL ||
                                  "http://localhost:5173"
                                }/dashboard" class="button">Go to Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                          <p>&copy; ${new Date().getFullYear()} BossFlow. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Do not throw — welcome email is optional
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
