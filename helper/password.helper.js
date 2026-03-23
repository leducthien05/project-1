const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

module.exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};