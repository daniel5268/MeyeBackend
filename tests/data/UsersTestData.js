const UsersTestData = module.exports;

UsersTestData.user = {
  username: 'testUsername',
  secret: 'testSecret',
  is_admin: false,
  is_player: false,
  is_master: false,
};

const { secret, ...userVerifiedToken } = { ...UsersTestData.user };

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
};

UsersTestData.updateUserRequest = {
  username: 'testUsernameUpdated',
  secret: 'updatedSecret',
  is_admin: true,
  is_master: true,
};

UsersTestData.expectedUpdatedUser = {
  ...UsersTestData.userVerifiedToken,
  ...UsersTestData.updateUserRequest,
};

delete UsersTestData.expectedUpdatedUser.secret;

UsersTestData.users = [
  { username: 'test_user_1', secret: 'secret', is_admin: true },
  { username: 'test_user_2', secret: 'secret', is_master: true },
  { username: 'test_user_3', secret: 'secret', is_admin: true },
  { username: 'test_user_4', secret: 'secret', is_master: true },
  { username: 'test_user_5', secret: 'secret', is_player: true },
  { username: 'test_user_6', secret: 'secret', is_master: true },
];

UsersTestData.expectedDataWithoutQueryParams = UsersTestData.users.map(({ secret: _, ...user }) => ({
  is_admin: false, is_master: false, is_player: false, ...user,
}));

UsersTestData.expectedUsersResponseWithoutQueryParams = {
  data: UsersTestData.expectedDataWithoutQueryParams,
  page: 1,
  size: 20,
  last_page: 1,
  total: 6,
};

UsersTestData.getUsersQuery = {
  is_master: true,
  size: 2,
  page: 2,

};

UsersTestData.expectedUsersResponseWithQueryParams = {
  data: [{
    username: 'test_user_6', is_master: true, is_player: false, is_admin: false,
  }],
  page: 2,
  size: 2,
  last_page: 2,
  total: 3,
};
