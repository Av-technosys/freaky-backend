import Redis from 'ioredis';

const redisClient = new Redis(
  'rediss://default:gQAAAAAAAWZ0AAIgcDJhOGQ3MmQ5NDE0OTg0YTc0YjFjNWZlMGIwMmEyNTg5Zg@modest-wasp-91764.upstash.io:6379'
);
await client.set('foo', 'bar');
export default redisClient;
