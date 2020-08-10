const UsersTestData = module.exports;

UsersTestData.user = {
  username: 'testUsername',
  secret: 'testSecret',
  is_admin: false,
  is_player: true,
  is_master: true,
  is_pnj: false,
};

const { secret, ...userVerifiedToken } = UsersTestData.user;

UsersTestData.userVerifiedToken = userVerifiedToken;

UsersTestData.expectedVerifiedToken = userVerifiedToken;

UsersTestData.wrongCredentialsSignInRequest = {
  username: 'testUsername',
  secret: 'wrongSecret',
};

UsersTestData.notExistingUserSignInRequest = {
  username: 'notExistingUser',
  secret: '',
};

UsersTestData.signInInfo = {
  username: UsersTestData.user.username,
  secret,
};

UsersTestData.alreadyCreatedUserRequest = UsersTestData.user;

UsersTestData.createUserRequest = {
  username: 'createThisUser',
  secret: 'secret',
  is_player: true,
};

UsersTestData.expectedCreatedUser = {
  username: UsersTestData.createUserRequest.username,
  is_admin: UsersTestData.createUserRequest.is_admin || false,
  is_player: UsersTestData.createUserRequest.is_player || false,
  is_master: UsersTestData.createUserRequest.is_master || false,
  is_pnj: UsersTestData.createUserRequest.is_pnj || false,
};

UsersTestData.updateUserRequest = {
  username: 'testUsername',
  secret: 'updatedSecret',
  is_admin: true,
  is_master: true,
};

UsersTestData.expectedUpdatedUser = {
  ...UsersTestData.userVerifiedToken,
  ...UsersTestData.updateUserRequest,
};

delete UsersTestData.expectedUpdatedUser.secret;
