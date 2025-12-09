import {
  AdminUpdateUserAttributesCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  cognito,
  generateSecretHash,
  USER_POOL_ID,
} from '../../lib/cognitoClient.js';
import { db } from '../../db/db.js';
import { users, vendorEmployees, vendorInvites } from '../../db/schema.js';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

export const signup = async (req, res) => {
  const { password, email } = req.body;

  // vendor -> 1 , user -> 2
  const userType = req.query.user_type === 'vendor' ? 1 : 2;

  const bodyData = req.body;
  const username = email;

  if (!password || !email) {
    return res.status(400).json({ error: 'password, and email are required.' });
  }

  const secretHash = generateSecretHash(username);
  const createUserParams = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'custom:user_type', Value: userType.toString() },
    ],
    SecretHash: secretHash, // Include the SECRET_HASH here
  };

  try {
    const createUserCommand = new SignUpCommand(createUserParams);
    const createUserResult = await cognito.send(createUserCommand);

    const [userRes] = await db
      .insert(users)
      .values({
        firstName: bodyData.full_name,
        email,
        number: bodyData.number,
        userTypeId: userType,
        password,
        cognitoSub: createUserResult.UserSub,
        isActive: true,
      })
      .returning();

    // add userid to cognito attribute
    const addUserIdParams = {
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:user_id',
          Value: JSON.stringify(userRes.userId),
        },
      ],
    };
    const addUserIdCommand = new AdminUpdateUserAttributesCommand(
      addUserIdParams
    );

    await cognito.send(addUserIdCommand);

    if (userType === 1) {
      const [vendorInviteRes] = await db
        .select()
        .from(vendorInvites)
        .where(eq(vendorInvites.email, email));

      // vendorInviteId: integer('vendor_invite_id')
      //   .generatedAlwaysAsIdentity()
      //   .primaryKey(),
      // vendorId: integer('vendor_id').references(() => vendor.vendorId),
      // email: varchar('email', { length: 255 }),
      // token: varchar('token', { length: 255 }),
      // inviteCode: varchar('invite_code', { length: 255 }),
      // status: varchar('status', { length: 255 }),
      // permissions: text('permissions').array(),
      // employeeCode: varchar('employee_code', { length: 100 }),

      if (vendorInviteRes) {
        const [vendorEmployeesRes] = await db
          .insert(vendorEmployees)
          .values({
            userId: userRes.userId,
            vendorId: vendorInviteRes.vendorId,
            permissions: vendorInviteRes.permissions,
            employeeCode: vendorInviteRes.employeeCode,
            isActive: true,
          })
          .returning();

        // vendor_ids in cognito are a JSON.stringify version of vendorContractId and vendorId
        const vendorIds = {
          vendorEmployeesId: vendorEmployeesRes.vendorEmployeeId,
          vendorId: vendorEmployeesRes.vendorId,
        };

        const params = {
          UserPoolId: USER_POOL_ID,
          Username: username,
          UserAttributes: [
            {
              Name: 'custom:vendor_ids',
              Value: JSON.stringify(vendorIds),
            },
          ],
        };
        const command = new AdminUpdateUserAttributesCommand(params);
        await cognito.send(command);

        // Now the user got onboarded so deleting the enrty from vendorInvites
        await db.delete(vendorInvites).where(eq(vendorInvites.email, email));
      }
    }

    return res.json(createUserResult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const confirmController = async (req, res) => {
  const { username, code } = req.body;

  if (!username || !code) {
    return res
      .status(400)
      .json({ error: 'Username and confirmation code are required.' });
  }

  // Generate the secret hash again (same as during signup)
  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    SecretHash: secretHash,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const result = await cognito.send(command);
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, username),
    });
    if (!user) {
      res.json({ message: 'User not found.', result });
    }
    const password = user.password;

    // Generate the SECRET_HASH again
    const secretHash = generateSecretHash(username);

    const paramsLogin = {
      AuthFlow: 'USER_PASSWORD_AUTH', // Use direct password-based login
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };
    const commandLogin = new InitiateAuthCommand(paramsLogin);
    const response = await cognito.send(commandLogin);

    res.json({
      message: 'Account confirmed.',
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
      tokenType: response.AuthenticationResult.TokenType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required.' });
  }

  // Generate the SECRET_HASH again
  const secretHash = generateSecretHash(username);

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH', // Use direct password-based login
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await cognito.send(command);

    return res.json({
      message: 'Login successful.',
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
      tokenType: response.AuthenticationResult?.TokenType,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    SecretHash: secretHash,
  };

  try {
    const command = new ForgotPasswordCommand(params);
    const response = await cognito.send(command);

    res.json({
      message: 'Password reset code sent to your email.',
      delivery: response.CodeDeliveryDetails,
    });
  } catch (err) {
    console.error('ForgotPassword error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const confirmForgotPassword = async (req, res) => {
  const { username, code, newPassword } = req.body;

  if (!username || !code || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Username, code, and new password are required.' });
  }

  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash,
  };

  try {
    const command = new ConfirmForgotPasswordCommand(params);
    await cognito.send(command);

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('ConfirmForgotPassword error:', err);
    res.status(500).json({ error: err.message });
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
      ClientId: CLIENT_ID,
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
