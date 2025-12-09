import { AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';

export const adminResetPassword = async (req, res) => {
  const { user, password } = req.body;
  console.log(user, password);
  const customParams = {
    UserPoolId: USER_POOL_ID,
    Username: user,
    Password: password,
    Permanent: true,
  };
  const customParamsCommnad = new AdminSetUserPasswordCommand(customParams);
  const response = await cognito.send(customParamsCommnad);
  return res.json({ message: 'adminResetPassword', data: response });
};
