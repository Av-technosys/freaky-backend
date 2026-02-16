import { Router } from 'express';

const router = Router();

router.post('/checkout-session', (req,res)=>{
    res.json({message: "Checkout session created"})
});
export default router;
