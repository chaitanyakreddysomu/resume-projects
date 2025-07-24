function getOtpEmailHtml({ username, appname, otp, action }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
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
    }
    .otp-box {
      display: inline-block;
      background: #f3f4fa;
      color: #4c63d9;
      font-size: 2rem;
      letter-spacing: 0.3em;
      padding: 12px 32px;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
      border: 2px dashed #4c63d9;
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
      <h2>OTP for ${action === 'delete' ? 'UPI Deletion' : action === 'withdrawal' ? 'Withdrawal Request' : 'UPI Verification'}</h2>
      <p>Hello, <strong>${username || 'User'}</strong>!</p>
      <p>Your OTP for ${action === 'delete' ? 'deleting' : action === 'withdrawal' ? 'confirming your withdrawal request on' : 'verifying'} your UPI on <strong>${appname}</strong> is:</p>
      <div class="otp-box">${otp}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      ${action === 'withdrawal' ? '<p><strong>Important:</strong> This OTP is required to confirm your withdrawal request. Please enter it carefully.</p>' : ''}
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

module.exports = { getOtpEmailHtml }; 