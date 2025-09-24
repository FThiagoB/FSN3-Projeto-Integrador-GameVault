const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.validateCoupon = async (req, res) => {
    try {
        if (!req.body) req.body = {};
        const { code, subtotal } = req.body;

        if (!code)
            return res.status(400).json({ valid: false, message: "Coupon code is missing" });

        // Busca o cupom no banco de dados
        const coupon = await prisma.coupon.findUnique({
            where: { code: code }
        });

        // Verifica se o cupom existe
        if (!coupon)
            return res.status(404).json({ valid: false, message: "Invalid coupon code" });

        // Verifica se o cupom está ativo
        if (!coupon.isActive)
            return res.status(400).json({ valid: false, message: "This coupon is not active" });

        // Verifica se o cupom não expirou
        if (coupon.expiresAt && coupon.expiresAt < new Date())
            return res.status(400).json({ valid: false, message: "This coupon has expired" });

        if (subtotal < coupon.minValue) {
            return res.status(400).json({
                valid: false, message: `This coupon requires a minimum order value of ${coupon.minValue}`,
            });
        }

        // Retorna o cupom válido
        res.status(200).json({
            valid: true,
            code: coupon.code,
            discount: coupon.discount,
            minValue: coupon.minValue,
            expiresAt: coupon.expiresAt
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ valid: false, message: error.message })
    }
}

exports.getCoupons = async (req, res) => {
    try {
        // Busca todos os cupons ativos que não expiraram
        const coupons = await prisma.coupon.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            select: {
                code: true,
                discount: true,
                minValue: true,
                expiresAt: true
            }
        });

        if (!coupons || coupons.length === 0)
            return res.status(404).json({ message: "There are no valid coupons available." });

        res.status(200).json(coupons);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}