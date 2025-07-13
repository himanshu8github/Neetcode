const { createClient } = require('redis');


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13385.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 13385
    }
});

redisClient.on('error', (err) => {
  console.error(' Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log(' Redis connected');
});

module.exports = redisClient;