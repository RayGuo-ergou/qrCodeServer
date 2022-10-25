// export all the controllers in this folder
// module.exports = {
//     login: require('./login'),
//     register: require('./register'),
//     getUser: require('./getUser'),
//     logout: require('./logout'),
// };
import login from './login';
import register from './register';
import getUser from './getUser';
import logout from './logout';

export default {
    login,
    register,
    getUser,
    logout,
};
