import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO_CLIENT_ID, USER_POOL_ID } from '../../const/env.js';
import { cognito, generateSecretHash } from '../../lib/cognitoClient.js';

const secretHash = (username) => generateSecretHash(username);

export function cognitoUpdateUserAttribute({ userAttribute, email }) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: email,
    UserAttributes: userAttribute,
  };
  const command = new AdminUpdateUserAttributesCommand(params);
  return cognito.send(command);
}

export function cognitoSignUp({ email, userAttribute, password }) {
  const createUserParams = {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: userAttribute,
    SecretHash: secretHash(email),
  };

  const createUserCommand = new SignUpCommand(createUserParams);
  return cognito.send(createUserCommand);
}
export function cognitoAdminGetUser({ email }) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: email,
  };
  const commandLogin = new AdminGetUserCommand(params);
  return cognito.send(commandLogin);
}

export function cognitoConfirmSignUp({ email, code }) {
  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    SecretHash: secretHash(email),
  };

  const command = new ConfirmSignUpCommand(params);
  return cognito.send(command);
}

export function cognitoInitiateAuth({ email, password }) {
  const paramsLogin = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash(email),
    },
  };
  const commandLogin = new InitiateAuthCommand(paramsLogin);
  return cognito.send(commandLogin);
}

export function cognitoForgotPassword({ email }) {
  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    SecretHash: secretHash(email),
  };

  const command = new ForgotPasswordCommand(params);
  return cognito.send(command);
}

export function cognitoConfirmForgotPassword({ username, code, newPassword }) {
  const params = {
    ClientId: COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash(email),
  };

  const command = new ConfirmForgotPasswordCommand(params);
  return cognito.send(command);
}
