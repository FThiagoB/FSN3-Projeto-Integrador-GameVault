const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllShippingMethods = async (req, res) => {
    try {
        const methods = await prisma.shippingMethod.findMany({
            where: { isActive: true }
        });
        res.status(200).json(methods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShippingMethod = async (req, res) => {
    try {
        const methodId = parseInt(req.params.id);
        const method = await prisma.shippingMethod.update({
            where: { id: methodId },
            data: req.body
        });
        res.status(200).json(method);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};