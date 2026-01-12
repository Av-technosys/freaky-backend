import { cognitoInitiateAuth } from './Cognito.helper.js';

export async function authSingIn({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const response = await cognitoInitiateAuth({ email, password });

  return {
    message: 'Login successful.',
    accessToken: response.AuthenticationResult?.AccessToken,
    idToken: response.AuthenticationResult?.IdToken,
    refreshToken: response.AuthenticationResult?.RefreshToken,
    expiresIn: response.AuthenticationResult?.ExpiresIn,
    tokenType: response.AuthenticationResult?.TokenType,
  };
}
