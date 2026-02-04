import express from 'express';
const router = express.Router();
import {createApi,getApiKeys} from '../controller/api.controller';
import {auth_middleware} from '../middlewares/auth.middleware';


router.post('/createapi',auth_middleware, createApi);
router.get('/apikeys',auth_middleware, getApiKeys);

export default router;