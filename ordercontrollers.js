import Order from '../models/orderModel.js';
import Shop from '../models/shopModel.js';
import { createOrderDocument, validateAndPrepareOrder } from '../utils/orderUtils.js';

export const placeOrder = async (req, res) => {
  try {
    const normalizedOrderData = await validateAndPrepareOrder(req.body);

    const order = await createOrderDocument({
      userId: req.user._id,
      orderData: normalizedOrderData,
      paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
      paymentStatus: req.body.paymentStatus || 'Pending',
      paymentResult: req.body.paymentResult || null,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getMerchantOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found',
      });
    }

    const orders = await Order.find({ shopId: shop._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error fetching your orders',
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('BACKEND ERROR:', error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};
