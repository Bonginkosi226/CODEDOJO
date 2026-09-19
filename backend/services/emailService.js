import nodemailer from 'nodemailer';

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;
const getTransporter = () => {
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587/25 upgrade via STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const buildResetEmail = ({ username, resetUrl }) => {
  const name = escapeHtml(username || 'there');
  const url = escapeHtml(resetUrl);

  const text = [
    `Hi ${username || 'there'},`,
    '',
    'We received a request to reset your CodeDojo password. Use the link below to choose a new one:',
    '',
    resetUrl,
    '',
    'This link expires in 1 hour and can only be used once.',
    "If you didn't ask for this, you can safely ignore this email — your password won't change.",
    '',
    '— The CodeDojo team',
  ].join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#34d399,#14b8a6);background-color:#10b981;padding:28px 24px;">
                <div style="font-size:26px;font-weight:800;letter-spacing:1px;color:#ffffff;">CODEDOJO</div>
                <div style="font-size:13px;color:#ecfdf5;margin-top:4px;">Learn to code, one mission at a time</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;color:#334155;font-size:15px;line-height:1.6;">
                <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Reset your password</h1>
                <p style="margin:0 0 20px;">Hi ${name},</p>
                <p style="margin:0 0 24px;">We received a request to reset your CodeDojo password. Click the button below to choose a new one.</p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${url}" style="display:inline-block;background-color:#10b981;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:12px;">Reset password</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;">This link expires in <strong>1 hour</strong> and can only be used once.</p>
                <p style="margin:0 0 20px;font-size:13px;color:#64748b;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${url}" style="color:#059669;word-break:break-all;">${url}</a></p>
                <p style="margin:0;font-size:13px;color:#64748b;">If you didn't ask for this, you can safely ignore this email — your password won't change.</p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px;color:#94a3b8;margin:16px 0 0;">Sent by CodeDojo</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: 'Reset your CodeDojo password', text, html };
};

/**
 * Email a password-reset link. With SMTP configured this sends real mail.
 * Without SMTP, outside production, the link is printed to the server console
 * so the flow can be tested without an email service. In production, missing
 * SMTP throws (the link is never printed there).
 */
export const sendPasswordResetEmail = async ({ to, username, resetUrl }) => {
  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)');
    }
    console.log('\n[Email:dev] SMTP not configured — password reset email NOT sent.');
    console.log(`[Email:dev] To: ${to}`);
    console.log(`[Email:dev] Reset link (valid 1 hour): ${resetUrl}\n`);
    return { delivered: false, devFallback: true };
  }

  const { subject, text, html } = buildResetEmail({ username, resetUrl });

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true };
};
