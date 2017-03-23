// config/auth.js
// expose our config directly to our application using module.exports
module.exports = {
    JWT: {
        secret: 'e3rwefsd'
    },
    FACEBOOK: {
        // your App ID
        clientID: '384506158550838',
        // your App Secret
        clientSecret: 'd67a4885fb5432cde046ed20d4921330',
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'profileUrl', 'email']
    },
    GOOGLE: {
        clientID: '817685374121-vgaavs7b50glm4ggbbagi7nr3mmmkq2j.apps.googleusercontent.com',
        clientSecret: 'B4RT2VBrzThNLx7QCBtZg3ky',
        callbackURL: 'http://localhost:8080/auth/google/callback',
        profileFields: ['id', 'displayName', 'photos', 'profileUrl', 'email']
    }
};
