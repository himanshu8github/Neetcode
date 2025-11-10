const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL   
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;


// const { createClient } = require('redis');

// const redisClient = createClient({
//     username : 'default',
//     password: process.env.REDIS_PASS,

//     socket: {
//         host: process.env.REDIS_HOST || 'localhost',
//         port: process.env.REDIS_PORT || 6379
//     }
// });

// redisClient.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// redisClient.on('connect', () => {
//     console.log('Redis connected');
// });

// module.exports = redisClient;


