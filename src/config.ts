export default {
    PORT: process.env.PORT || 5000,

    // database
    nameDB: 'BigRollsDev',
    userNameDB: 'admin',
    userPasswordDB: '1234',

    // files dir
    uploadImgDir: 'static/uploadImg',
    staticDir: 'http://localhost:8080/',
    placeholderURL: 'http://localhost:8080/static/img/placeholder.webp',

    // authenticate
    JWT_secret_key: 'some_key'
}