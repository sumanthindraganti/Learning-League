const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');

admin.initializeApp();

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user,
    pass: functions.config().email?.pass
  }
});

exports.sendOTP = functions.https.onCall(async (data, context) => {
  const { email } = data;
  
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Firestore with expiration
    const otpDoc = {
      email,
      otp,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
    
    await admin.firestore().collection('otps').doc(email).set(otpDoc);

    // Send email
    const mailOptions = {
      from: functions.config().email?.user,
      to: email,
      subject: 'Learning League - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Learning League</h1>
          <h2>Email Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px;">
            <h1 style="color: #4f46e5; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new functions.https.HttpsError('internal', 'Error sending OTP');
  }
});

exports.verifyOTP = functions.https.onCall(async (data, context) => {
  const { email, otp } = data;
  
  if (!email || !otp) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and OTP are required');
  }

  try {
    const otpDoc = await admin.firestore().collection('otps').doc(email).get();
    
    if (!otpDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'OTP not found');
    }

    const otpData = otpDoc.data();
    const now = Date.now();
    
    if (now > otpData.expiresAt.toMillis()) {
      throw new functions.https.HttpsError('deadline-exceeded', 'OTP has expired');
    }

    if (otpData.otp !== otp) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP');
    }

    // Delete the used OTP
    await admin.firestore().collection('otps').doc(email).delete();
    
    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new functions.https.HttpsError('internal', 'Error verifying OTP');
  }
});

// Execute code via JDoodle API
exports.executeCode = functions.https.onCall(async (data, context) => {
  const { code } = data;
  
  if (!code) {
    throw new functions.https.HttpsError('invalid-argument', 'Code is required');
  }

  // Get JDoodle credentials from environment variables
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('JDoodle credentials not configured');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Code execution service is not properly configured'
    );
  }

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId,
      clientSecret,
      script: code,
      language: 'c',
      versionIndex: '0'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    if (!response.data) {
      throw new Error('Empty response from JDoodle API');
    }

    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('JDoodle API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      if (error.response.status === 429) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please try again later.'
        );
      }

      throw new functions.https.HttpsError(
        'internal',
        'Code execution service error',
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from JDoodle API');
      throw new functions.https.HttpsError(
        'unavailable',
        'Code execution service is not responding'
      );
    }
    
    // Something happened in setting up the request
    console.error('Error setting up JDoodle API request:', error.message);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to execute code',
      { message: error.message }
    );
  }
});