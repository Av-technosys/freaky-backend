import Redis from 'ioredis';

const redisClient = new Redis(
  'rediss://default:gQAAAAAAAWZ0AAIgcDJhOGQ3MmQ5NDE0OTg0YTc0YjFjNWZlMGIwMmEyNTg5Zg@modest-wasp-91764.upstash.io:6379',
  {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  }
);

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

export default redisClient;
