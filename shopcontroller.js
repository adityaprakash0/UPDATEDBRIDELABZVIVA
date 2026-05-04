import Shop from '../models/shopModel.js';
import Address from '../models/addressModel.js';

export const createShop = async (req, res) => {
    try {
        const {
            name,
            category,
            houseNo,
            street,
            area,
            city,
            pincode
        } = req.body;

        const shopAddress = await Address.create({
            houseNo,
            street,
            area,
            city,
            pincode,
        });

        const shop = await Shop.create({
            ownerId: req.user._id,
            addressId: shopAddress._id,
            name,
            category,
        });

        res.status(201)
        .json(shop);
    }
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};