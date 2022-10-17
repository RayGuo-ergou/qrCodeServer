const logout = (req, res) => {
    res.status(200)
        .clearCookie('token', {
            sameSite: 'none',
            secure: true,
        })
        .json({ message: 'Logout successful' });
};
module.exports = logout;
