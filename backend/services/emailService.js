const nodemailer = require("nodemailer");

/**
 * Crea un transportador de email según el entorno.
 * En producción usa Gmail, en desarrollo usa Ethereal o SMTP local.
 * @function createTransporter
 * @returns {Object} Transportador de nodemailer configurado.
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
 * Envía un email de verificación al usuario para confirmar su dirección de correo.
 * @async
 * @function sendVerificationEmail
 * @param {string} userEmail - Email del usuario.
 * @param {string} userName - Nombre del usuario.
 * @param {string} verificationToken - Token único de verificación.
 * @returns {Promise<Object>} Objeto con success (boolean) y messageId del email enviado.
 * @throws {Error} Si hay error al enviar el email.
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
      subject: "Verifica tu cuenta de BossFlow",
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
                            <h2>¡Bienvenido a BossFlow, ${userName}!</h2>
                            <p>Gracias por registrarte en BossFlow. Para completar tu registro y comenzar a crear diagramas de flujo increíbles, necesitamos verificar tu dirección de email.</p>

                            <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>

                            <div style="text-align: center;">
                                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
                            </div>

                            <div class="warning">
                                <p><strong>Este enlace expirará en 24 horas.</strong> Si no verificas tu cuenta dentro de este tiempo, tendrás que solicitar un nuevo email de verificación.</p>
                            </div>

                            <p>Si no creaste esta cuenta, puedes ignorar este email de forma segura.</p>

                            <p style="margin-top: 30px; font-size: 14px; color: #7a8896;">
                                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                                <a href="${verificationUrl}" style="color: #EAB308; word-break: break-all;">${verificationUrl}</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} BossFlow. Todos los derechos reservados.</p>
                            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
      text: `
¡Bienvenido a BossFlow, ${userName}!

Gracias por registrarte en BossFlow. Para completar tu registro y comenzar a crear diagramas de flujo increíbles, necesitamos verificar tu dirección de email.

Haz clic en el siguiente enlace para verificar tu cuenta:
${verificationUrl}

Este enlace expirará en 24 horas. Si no verificas tu cuenta dentro de este tiempo, tendrás que solicitar un nuevo email de verificación.

Si no creaste esta cuenta, puedes ignorar este email de forma segura.

© ${new Date().getFullYear()} BossFlow. Todos los derechos reservados.
            `,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email de verificación enviado:", info.messageId);

    // En desarrollo con Ethereal, mostrar URL de vista previa
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Vista previa del email:",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error al enviar email de verificación:", error);
    throw new Error("No se pudo enviar el email de verificación");
  }
};

/**
 * Envía un email de bienvenida al usuario después de que haya verificado su cuenta.
 * @async
 * @function sendWelcomeEmail
 * @param {string} userEmail - Email del usuario.
 * @param {string} userName - Nombre del usuario.
 * @returns {Promise<void>} Promesa que se resuelve al enviar el email.
 * @throws {Error} Si hay error al enviar el email.
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"BossFlow" <${process.env.EMAIL_FROM || "noreply@bossflow.com"}>`,
      to: userEmail,
      subject: "¡Cuenta verificada! Bienvenido a BossFlow",
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
                            <h2>¡Tu cuenta ha sido verificada exitosamente!</h2>
                            <p>Hola ${userName},</p>
                            <p>¡Felicidades! Tu cuenta de BossFlow ha sido verificada y ya puedes comenzar a usar todas nuestras funcionalidades.</p>

                            <p>Con BossFlow puedes:</p>
                            <ul>
                                <li>Crear diagramas de flujo interactivos</li>
                                <li>Planificar estrategias contra jefes de videojuegos</li>
                                <li>Colaborar con otros usuarios</li>
                                <li>Usar plantillas predefinidas</li>
                            </ul>

                            <div style="text-align: center;">
                                <a href="${
                                  process.env.FRONTEND_URL ||
                                  "http://localhost:5173"
                                }/dashboard" class="button">Ir al Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} BossFlow. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email de bienvenida enviado a:", userEmail);
  } catch (error) {
    console.error("Error al enviar email de bienvenida:", error);
    // No lanzar error, el email de bienvenida es opcional
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
