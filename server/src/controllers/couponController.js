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

// Função adicional para administradores gerenciarem cupons
exports.getAllCoupons = async (req, res) => {
    try {
        // Verifica se o usuário é administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        // Busca todos os cupons
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(coupons);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

// Função para criar cupons (apenas admin)
exports.createCoupon = async (req, res) => {
    try {
        // Verifica se o usuário é administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const { code, discount, expiresAt, isActive, minValue, userId } = req.body;

        // Validação básica
        if (!code || !discount) {
            return res.status(400).json({ message: "Code and discount are required" });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                discount: parseFloat(discount),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: isActive !== undefined ? isActive : true,
                minValue: minValue ? parseFloat(minValue) : null,
                userId: userId || null
            }
        });

        res.status(201).json(coupon);
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            res.status(400).json({ message: "Coupon code already exists" });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

// Função para atualizar cupons (apenas admin)
exports.updateCoupon = async (req, res) => {
    try {
        // Verifica se o usuário é administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const { id } = req.params;
        const { code, discount, expiresAt, isActive, minValue, userId } = req.body;

        const coupon = await prisma.coupon.update({
            where: { id: parseInt(id) },
            data: {
                code,
                discount: discount ? parseFloat(discount) : undefined,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
                isActive,
                minValue: minValue ? parseFloat(minValue) : undefined,
                userId: userId || undefined
            }
        });

        res.status(200).json(coupon);
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Coupon not found" });
        } else if (error.code === 'P2002') {
            res.status(400).json({ message: "Coupon code already exists" });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

// Função para deletar cupons (apenas admin)
exports.deleteCoupon = async (req, res) => {
    try {
        // Verifica se o usuário é administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const { id } = req.params;

        await prisma.coupon.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Coupon deleted successfully" });
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Coupon not found" });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}