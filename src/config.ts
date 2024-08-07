export default {
    HOST: process.env.HOST || '0.0.0.0',
    PORT: (process.env.PORT) ? parseInt(process.env.PORT) : 3000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/backend?authSource=admin',
    JWT_SECRET: process.env.JWT_SECRET || 'my_jwt_secret',
    ADMIN_USER: process.env.ADMIN_USER || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'apiadm'
}