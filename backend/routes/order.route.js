import express from "express";
import { 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus,
    deleteOrder,
    confirmOrderDelivery 
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my-orders", protectRoute, getMyOrders);
router.patch("/:id/confirm-delivery", protectRoute, confirmOrderDelivery);
router.get("/all", protectRoute, adminRoute, getAllOrders);
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);
router.delete("/:id", protectRoute, adminRoute, deleteOrder);

export default router;