const UsersTestData = module.exports;

UsersTestData.user = {
  username: 'testUsername',
  secret: 'testSecret',
};

UsersTestData.wrongCredentialsSignInRequest = {
  username: 'testUsername',
  secret: 'wrongSecret',
};

UsersTestData.notExistingUserSignInRequest = {
  username: 'notExistingUser',
  secret: '',
};

UsersTestData.signInInfo = UsersTestData.user;
