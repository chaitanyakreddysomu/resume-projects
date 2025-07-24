function getVerificationEmailHtml({ username, appname, confirmLink }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Confirmation</title>
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

        .logo {
            width: 50px;
            height: 50px;
            margin-bottom: 15px;
        }
            .card-wrapper{
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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

        a.button {
            display: inline-block;
            background-color: #4c63d9;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }

        .small-link {
            font-size: 14px;
            color: #4c63d9;
            word-break: break-word;
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
      <h2>Verify Your Email</h2>
      <p>Hello, <strong>${username}</strong>! Thank you for joining <strong>${appname}</strong>. Please verify your email by clicking the button below.</p>
      <a href="${confirmLink}" class="button">Verify Your Email</a>
     
      <p>If the button doesn't work, <a href="${confirmLink}" class="small-link">click here</a>.</p>

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

module.exports = { getVerificationEmailHtml };
