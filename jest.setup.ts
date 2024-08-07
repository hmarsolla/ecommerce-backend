// jest.setup.ts
process.env.MONGOMS_DOWNLOAD_URL = 'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.6.23.tgz'; // URL for the MongoDB binary
process.env.MONGOMS_VERSION = '3.6.23'; // Specify the MongoDB version you want to use
jest.setTimeout(30000); // Set a longer timeout for tests if needed
