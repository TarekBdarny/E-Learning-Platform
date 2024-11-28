export const verificationEmailHtml = `

<!DOCTYPE html>
<html>
<head>
  <title>Verification Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" 
         style="border-collapse: collapse; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #007bff; color: #ffffff; font-size: 24px; font-weight: bold;">
        Verify Your Email
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 24px;">
        <p style="margin: 0 0 16px;">Dear user,</p>
        <p style="margin: 0 0 16px;">Thank you for signing up. Please verify your email address by entering the code below on our website.</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px;">
        <div style="display: inline-block; padding: 10px 20px; background-color: #f8f9fa; border: 1px solid #dddddd; border-radius: 4px; font-size: 24px; font-weight: bold; color: #333333; letter-spacing: 5px;">
          {verificationToken}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #666666; font-size: 14px; line-height: 20px;">
        <p style="margin: 0 0 16px;">If you didn’t request this, please ignore this email.</p>
        <p style="margin: 0;">Thank you,<br>The Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        &copy; 2024 Your Company Name. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>

`;
export const greetingEmailHtml = `

<!DOCTYPE html>
<html>
<head>
  <title>Welcome Greeting</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" 
         style="border-collapse: collapse; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #28a745; color: #ffffff; font-size: 24px; font-weight: bold;">
        Welcome to Our Community!
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 24px;">
        <p style="margin: 0 0 16px;">Hi {fullname},</p>
        <p style="margin: 0 0 16px;">We're thrilled to have you here! 🎉</p>
        <p style="margin: 0 0 16px;">At <strong>Your Company Name</strong>, we’re dedicated to providing you with the best experience. Here's what you can do next:</p>
        <ul style="padding-left: 20px; margin: 0 0 16px; color: #555555;">
          <li style="margin: 0 0 8px;">Explore our features and services</li>
          <li style="margin: 0 0 8px;">Check out your personalized dashboard</li>
          <li style="margin: 0 0 8px;">Join the conversation in our community forums</li>
        </ul>
        <p style="margin: 0;">We’re always here to help, so feel free to reply to this email if you have any questions.</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px;">
        <a href="https://yourwebsite.com" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;">
          Get Started
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #666666; font-size: 14px; line-height: 20px;">
        <p style="margin: 0;">Thank you for joining us. Let’s achieve great things together!</p>
        <p style="margin: 0;">Best regards,<br>Your Company Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        &copy; 2024 Your Company Name. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;
export const urgentEmailHtml = `

<!DOCTYPE html>
<html>
<head>
  <title>Urgent Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff5f5;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" 
         style="border-collapse: collapse; margin: 20px auto; background-color: #ffffff; border: 1px solid #e63946;">
    <tr>
      <td align="center" style="padding: 20px 0; background-color: #e63946; color: #ffffff; font-size: 24px; font-weight: bold;">
        Action Needed: Urgent!
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 24px;">
        <p style="margin: 0 0 16px;">Dear [User's Name],</p>
        <p style="margin: 0 0 16px;"><strong>We need your immediate attention regarding:</strong></p>
        <p style="margin: 0 0 16px; color: #d32f2f;">[Insert specific issue, e.g., "Your account is at risk" or "Payment failure detected"].</p>
        <p style="margin: 0 0 16px;">Please address this issue by taking the following steps:</p>
        <ul style="padding-left: 20px; margin: 0 0 16px; color: #555555;">
          <li style="margin: 0 0 8px;">Log into your account immediately.</li>
          <li style="margin: 0 0 8px;">Review the flagged item or notification.</li>
          <li style="margin: 0 0 8px;">Follow the on-screen instructions to resolve the issue.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px;">
        <a href="https://yourwebsite.com/urgent-action" 
           style="display: inline-block; padding: 12px 24px; background-color: #e63946; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;">
          Take Action Now
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; color: #666666; font-size: 14px; line-height: 20px;">
        <p style="margin: 0 0 16px;">Failure to act within <strong>[insert time frame, e.g., 24 hours]</strong> may result in [specific consequence, e.g., "account suspension"].</p>
        <p style="margin: 0;">If you have any questions or believe this is an error, please contact our support team immediately at <a href="mailto:support@yourwebsite.com" style="color: #007bff; text-decoration: none;">support@yourwebsite.com</a>.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
        &copy; 2024 Your Company Name. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>

`;
