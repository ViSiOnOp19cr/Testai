import Redis from 'ioredis';

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
  connectTimeout: 10000,
});

client.on('error',(err)=>{
    console.log("error in redis",err);
});
client.on('connect',()=>{
    console.log("redis connected");
});

export default client;
