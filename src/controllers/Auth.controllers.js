import {
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognito, generateSecretHash } from '../../lib/cognitoClient.js';
import { db } from '../../db/db.js';
import { vendorEmployees, vendorInvites } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { COGNITO_CLIENT_ID } from '../../const/env.js';
import { insertUser } from '../helpers/User.helper.js';
import {
  cognitoAdminGetUser,
  cognitoConfirmForgotPassword,
  cognitoConfirmSignUp,
  cognitoForgotPassword,
  cognitoSignUp,
  cognitoUpdateUserAttribute,
} from '../helpers/Cognito.helper.js';
import { authSingIn } from '../helpers/Auth.helper.js';

export const signup = async (req, res) => {
  const { full_name, number, password, email } = req.body;
  if (!password || !email) {
    return res
      .status(400)
      .json({ message: 'password, and email are required.' });
  }

  try {
    const response = await cognitoAdminGetUser({ email });
    const userStatus = response.UserStatus;
    if (userStatus === 'CONFIRMED') {
      return res.status(400).json({ message: 'User already exists.' });
    } else {
      return res.status(401).json({ message: userStatus });
    }
  } catch (error) {
    if (error.__type === 'UserNotFoundException') {
      // vendor -> 2 , user -> 1
      const userType = req.query.user_type === 'vendor' ? 2 : 1;

      try {
        let userAttribute = [
          { Name: 'email', Value: email },
          { Name: 'custom:user_type', Value: userType.toString() },
        ];
        const createUserResult = await cognitoSignUp({
          email,
          userAttribute,
          password,
        });

        const [userRes] = await insertUser({
          firstName: full_name,
          email,
          number,
          userTypeId: userType,
          password,
          cognitoSub: createUserResult.UserSub,
          isActive: true,
        });

        userAttribute = [
          {
            Name: 'custom:user_id',
            Value: JSON.stringify(userRes.userId),
          },
        ];
        // const vendorIds = {
        //   vendorEmployeesId: vendorEmployeesRes.vendorEmployeeId,
        //   vendorId: vendorEmployeesRes.vendorId,
        // };
        // add userid to cognito attribute
        await cognitoUpdateUserAttribute({ email, userAttribute });

        return res.status(201).json({
          message: 'User needs to verify, OTP sent to your email.',
          data: { userId: userRes.userId, email },
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
    }
    return res.status(500).json({ message: error.message });
  }
};

export const confirmController = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: 'email and confirmation code are required.' });
  }

  try {
    const result = await cognitoConfirmSignUp({ email, code });
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.', result });
    }
    const data = await authSingIn({ email, password: user.password });
    return res.status(200).json({ message: 'Login successful.', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await authSingIn({ email, password });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'email is required.' });
  }
  try {
    const response = await cognitoForgotPassword({ email });

    return res.status(200).json({
      message: 'Password reset code sent to your email.',
      delivery: response.CodeDeliveryDetails,
    });
  } catch (err) {
    console.error('ForgotPassword error:', err);
    return res.status(500).json({ message: err.message });
  }
};

export const confirmForgotPassword = async (req, res) => {
  const { username, code, newPassword } = req.body;

  if (!username || !code || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Username, code, and new password are required.' });
  }
  try {
    await cognitoConfirmForgotPassword({ username, code, newPassword });

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('ConfirmForgotPassword error:', err);
    return res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken, username } = req.body;

  if (!refreshToken)
    return res.status(400).json({ error: 'Refresh token is required.' });

  try {
    const secretHash = generateSecretHash(username);
    const command = new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognito.send(command);

    return res.status(200).json({ response: response });
  } catch (err) {
    console.error('refreshToken error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!refreshToken)
    return res.status(400).json({ error: 'Refresh token is required.' });

  try {
    const secretHash = generateSecretHash(email);
    const params = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: secretHash,
    };
    const command = new ResendConfirmationCodeCommand(params);

    const response = await cognito.send(command);

    return res.status(200).json({ message: response });
  } catch (err) {
    console.error('refreshToken error:', err);
    res.status(500).json({ message: err.message });
  }
};
