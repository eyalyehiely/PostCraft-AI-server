const transporter = require('../config/transporter');

// Function to send welcome email after signup
const sendWelcomeEmail = async (email, first_name) => {
  try {
    // Get current date in Israeli timezone
    const now = new Date();
    const israelDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    const formattedDate = israelDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || `PostCraft AI <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to PostCraft AI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>Welcome to PostCraft AI, ${first_name}!</h2>
          
          <p>Thank you for signing up for our AI-powered analytics platform. Your account has been successfully created!</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Getting Started</h3>
            <p>Here are the powerful features you can now access:</p>
            <ul>
              <li><strong>AI-Powered Insights:</strong> Get personalized recommendations and insights powered by advanced AI algorithms</li>
              <li><strong>Comprehensive Analytics:</strong> Detailed performance metrics including Core Web Vitals, resource usage, and timing analysis</li>
              <li><strong>Smart Recommendations:</strong> Actionable insights to improve your website's performance, accessibility, and SEO scores</li>
              <li><strong>Cross-Device Analysis:</strong> Compare performance metrics between mobile and desktop devices</li>
              <li><strong>Historical Tracking:</strong> Track your website's performance over time with detailed historical data</li>
              <li><strong>Resource Optimization:</strong> Identify and optimize unused resources to improve loading times</li>
            </ul>
          </div>
          
          <p>Our platform is designed to help you make data-driven decisions and gain valuable insights into your website's performance. With our AI-powered tools, you'll be able to:</p>
          <ul>
            <li>Analyze website performance in real-time</li>
            <li>Get automated recommendations for improvements</li>
            <li>Track performance trends over time</li>
            <li>Compare metrics across different devices</li>
            <li>Generate detailed reports and insights</li>
          </ul>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">Account created on: ${formattedDate}</p>
            <p style="color: #666; font-size: 14px;">If you have any questions or need assistance, please don't hesitate to contact our support team at support@seogen.co. We're here to help you succeed!</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw - we don't want to break the signup process if email fails
  }
};



const sendEmailToOwner = async (email, first_name) => {
  try {
    const now = new Date();
    const israelDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    const formattedDate = israelDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || `PostCraft AI <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New User Signup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>New User Signup</h2>
          <p>A new user has signed up for the PostCraft AI platform. Here are the details:</p>
          <ul>
            <li>Email: ${email}</li>
            <li>First Name: ${first_name}</li>
            <li>Time: ${formattedDate}</li>
          </ul>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to owner: ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('Error sending email to owner:', error);
  }
};  

module.exports = { sendWelcomeEmail, sendEmailToOwner };