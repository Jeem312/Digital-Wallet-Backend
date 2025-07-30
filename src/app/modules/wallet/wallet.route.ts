import { Router } from 'express';
import { walletController } from './wallet.controller'; 
import { checkAuth } from '../../../middleWares/checkAuth';

const router = Router();

router.get('/', 
    checkAuth('ADMIN'), 
    walletController.getAllWallets);


router.post(
  "/sendMoney",
  checkAuth("user", "agent", "admin"),
  walletController.sendMoney
);

router.post(
    "/cashIn",
     checkAuth("agent"), 
     walletController.cashIn);
router.post(
    "/cashOut",
     checkAuth("agent"), 
     walletController.cashOut);
router.get(
    "/:userId",
    checkAuth("admin", "user", "agent"),
    walletController.getWalletByUserId
);
router.patch(
    "/:walletId/block",
    checkAuth("admin"),
    walletController.blockWallet
);
export const WalletRoutes = router;
