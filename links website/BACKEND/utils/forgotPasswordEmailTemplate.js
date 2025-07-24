function getForgotPasswordEmailHtml({ username, appname, resetLink }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: linear-gradient(to bottom, #6e84f5, #4c63d9);
      height: 100vh;
      padding: 40px 0;
    }

    .card-wrapper {
      background: #5a6de1;
      max-width: 500px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .card-top {
      background-color: #4c63d9;
      padding: 40px 20px 20px 20px;
      text-align: center;
      color: white;
    }

    .card-bottom {
      background-color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }

    h2 {
      color: #4c63d9;
      margin-bottom: 20px;
    }

    p {
      color: #333;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    a.button {
      display: inline-block;
      background-color: #4c63d9;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
      transition: background-color 0.3s;
    }

    a.button:hover {
      background-color: #3d52c7;
    }

    .small-link {
      font-size: 14px;
      color: #4c63d9;
      word-break: break-word;
    }

    .warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 12px;
      margin: 20px 0;
      color: #856404;
      font-size: 14px;
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      color: white;
      font-size: 14px;
    }

    .social a {
      margin: 0 8px;
      color: white;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card-top">
      <h1>Linkearn</h1>
    </div>
    <div class="card-bottom">
      <h2>Reset Your Password</h2>
      <p>Hello <strong>${username}</strong>!</p>
      <p>We received a request to reset your password for your <strong>${appname}</strong> account. Click the button below to create a new password.</p>
      
      <a href="${resetLink}" class="button">Reset Password</a>
      
      <p>If the button doesn't work, <a href="${resetLink}" class="small-link">click here</a>.</p>
      
      <div class="warning">
        <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
      </div>
      
      <p style="font-size: 14px; color: #666;">
        If you're having trouble, contact our support team.
      </p>
    </div>
  </div>
  <div class="footer">
    <div class="social">
      <a href="#">Facebook</a>
      <a href="#">Twitter</a>
      <a href="#">Instagram</a>
    </div>
    ${appname}<br>
    Copyright &copy; 2024 ${appname}. All Rights Reserved
  </div>
</body>
</html>
  `;
}

module.exports = { getForgotPasswordEmailHtml }; 