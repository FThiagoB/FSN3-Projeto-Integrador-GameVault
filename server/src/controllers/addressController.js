const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAddressesByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const addresses = await prisma.address.findMany({
            where: { userID: userId },
            orderBy: { isDefaultShipping: 'desc' }
        });

        if (!addresses || !addresses.length)
            return res.status(404).json({ message: "There are no registered addresses" });

        res.status(200).json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getAddressByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const addressId = parseInt(req.params.id);

        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userID: userId
            }
        });

        if (!address)
            return res.status(404).json({ message: "Address not found" });

        res.status(200).json(address);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.createAddressByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        if( !req.body ) req.body = {};
        const { label = "", street, number, complemento="", neighborhood, city, state, zipCode, isDefaultShipping = false } = req.body;

        if(!street || !number || !neighborhood || !city || !state || !zipCode )
            return res.status(400).json({message: "Fill in all required fields"});
        
        const newAddress = await prisma.address.create({
            data: {
                userID: userId,
                label,
                street,
                number,
                complemento,
                neighborhood,
                city,
                state,
                zipCode,
                isDefaultShipping
            }
        });

        // Se este endereço for definido como padrão, remover o padrão dos outros
        if (isDefaultShipping) {
            await prisma.address.updateMany({
                where: { userID: userId, isDefaultShipping: true },
                data: { isDefaultShipping: false }
            });
        }

        res.status(201).json(newAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.updateAddressByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const addressId = parseInt(req.params.id)

        if( !req.body ) req.body = {};
        const { label = "", street, number, complemento="", neighborhood, city, state, zipCode, isDefaultShipping = false } = req.body;

        // Verificar se o endereço pertence ao usuário
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: addressId,
                userID: userId
            }
       });

        if(!existingAddress)
            return res.status(400).json({message: "Address not found"});
        
        const dataQuery = {};
        if( street ) dataQuery.street = street;
        if( number ) dataQuery.number = number;
        if( complemento ) dataQuery.complemento = complemento;
        if( neighborhood ) dataQuery.neighborhood = neighborhood;
        if( city ) dataQuery.city = city;
        if( state ) dataQuery.state = state;
        if( zipCode ) dataQuery.zipCode = zipCode;
        if( isDefaultShipping ) dataQuery.isDefaultShipping = isDefaultShipping;
        if( label ) dataQuery.label = label;

        const updatedAddress = await prisma.address.update({
            where: {id: addressId},
            data: dataQuery
        });

        // Se este endereço for definido como padrão, remover o padrão dos outros
        if (isDefaultShipping) {
            await prisma.address.updateMany({
                where: { userID: userId, isDefaultShipping: true },
                data: { isDefaultShipping: false }
            });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.setAsDefaultAddressByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const addressId = parseInt(req.params.id);

        // Verificar se o endereço pertence ao usuário
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: addressId,
                userID: userId
            }
       });

        if(!existingAddress)
            return res.status(400).json({message: "Address not found"});
        
        // remover o padrão dos outros
        if (isDefaultShipping) {
            await prisma.address.updateMany({
                where: { userID: userId, isDefaultShipping: true },
                data: { isDefaultShipping: false }
            });
        }

        // Definir este endereço como padrão
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: { isDefaultShipping: true }
        });

        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.deleteAddressByJWT = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const addressId = parseInt(req.params.id);

        // Verificar se o endereço pertence ao usuário
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: addressId,
                userID: userId
            }
       });

        if(!existingAddress)
            return res.status(400).json({message: "Address not found"});
        
        // Verificar se o endereço está sendo usado em algum pedido
        const ordersUsingAddress = await prisma.order.count({
            where: { shippingAddressID: addressId }
        });

        if(ordersUsingAddress > 0)
            return res.status(400).json({message: "This address cannot be deleted as it is associated with existing orders."});

        const deletedAddress = await prisma.address.delete({
            where: { id: addressId }
        });

        res.status(200).json(deletedAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}