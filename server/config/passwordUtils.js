const bcrypt = require('bcrypt');

function hashPassword(password) {
  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt));
}

module.exports = {
  hashPassword,
};
