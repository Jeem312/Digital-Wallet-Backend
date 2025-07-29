import { Router } from 'express';
import { walletController } from './wallet.controller'; 
import { checkAuth } from '../../../middleWares/checkAuth';

const router = Router();

router.get('/', checkAuth('ADMIN'), walletController.getAllWallets);
router.get("/:userId", checkAuth("admin", "user", "agent"), walletController.getWalletByUserId);
router.patch("/:userId/balance", checkAuth("agent"), walletController.updateWalletBalance);
router.patch("/:walletId/block", checkAuth("admin"), walletController.blockWallet);
export const WalletRoutes = router;
