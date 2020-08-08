const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = process.env;

const EncryptionService = module.exports;

EncryptionService.hash = (secret) => bcrypt.hash(secret, +SALT_ROUNDS);

EncryptionService.compare = (secret, hashedSecret) => bcrypt.compare(secret, hashedSecret);
