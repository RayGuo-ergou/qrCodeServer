const logout = (req, res) => {
    // FIXME: because my backend and frontend not in same domain
    // so use this stupid way around to logout
    // in future, if have time, will try to fix this
    res.status(200)
        .cookie('token', 'logout', {
            sameSite: 'none',
            secure: true,
        })
        .json({ message: 'Logout successful' });
};

module.exports = logout;
