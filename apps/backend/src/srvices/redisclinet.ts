import {createClient} from 'redis';

const redisClient = createClient();

redisClient.on('error',(err)=>{
    console.log("error in redis",err);
});

redisClient.connect();

export default redisClient;