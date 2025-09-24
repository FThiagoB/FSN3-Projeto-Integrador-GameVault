const { hashPassword } = require("./src/utils/miscellaneous");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JSON com informações sobre 100 jogos para preenchimento inicial
const games = require('./game_data/products_info.json');

// Função que servirá para sortear um vendedor (id de 1 à 9)
const getRandomSeller = () => {
    return parseInt(Math.floor(Math.random() * 9) + 1)
};

// Cupons a serem criados
const discountCoupons = [
    { 
        code: "VERAO10", 
        discount: 0.1, 
        isActive: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias a partir de agora
        minValue: 50.00
    },
    { 
        code: "PRIMEIRACOMPRA", 
        discount: 0.15, 
        isActive: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
        minValue: 30.00
    },
    { 
        code: "GAMER20", 
        discount: 0.2, 
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        minValue: 100.00
    },
    { 
        code: "FREEGAME5", 
        discount: 0.05, 
        isActive: true,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 dias
        minValue: 20.00
    },
    { 
        code: "BLACKFRIDAY30", 
        discount: 0.3, 
        isActive: true,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        minValue: 150.00
    }
];

const shippingMethods = [
    {
        name: 'Padrão',
        price: 10.00,
        description: 'Entrega padrão em até 5 dias úteis'
    },
    {
        name: 'Expresso',
        price: 25.00,
        description: 'Entrega expressa em até 2 dias úteis'
    }
];

const paymentMethods = [
    {
        type: 'credit_card',
        data: {
            cvv: '1234',
            brand: 'Visa',
            name: 'Juliana Mendes',
            expDate: '12/25'
        }
    },
    {
        type: 'credit_card',
        data: {
            cvv: '1234',
            brand: 'Visa',
            name: 'Juliana Mendes',
            expDate: '12/25'
        }
    },
];

async function createAdmin() {
    try {
        // Cadastra o usuário Admin
        await prisma.user.create({
            data: {
                id: 0,
                email: "admin@gmail.com",
                password: await hashPassword("admin"),
                role: "admin"
            }
        });

        console.log("Admin criado com sucesso");
    }
    catch (error) {
        console.error(`problemas com createAdmin(): ${error.message}`)
    }
}

async function createUsers() {
    try {
        // Cadastra alguns vendedores
        await prisma.user.createMany({
            data: [
                {
                    id: 1,
                    CPF: "86150879038",
                    name: "Carlos Silva",
                    phone: "11999990001",
                    password: await hashPassword("senha1234"),
                    email: "carlos.silva2025@gmail.com",
                    role: "seller"
                },
                {
                    id: 2,
                    CPF: "42507690038",
                    name: "Fernanda Souza",
                    phone: "11999990002",
                    password: await hashPassword("fernanda2025"),
                    email: "fernanda.souza@example.com",
                    role: "seller"
                },
                {
                    id: 3,
                    CPF: "68907241007",
                    name: "João Oliveira",
                    phone: "11999990003",
                    password: await hashPassword("JoãoOliveira"),
                    email: "joao.oliveira@example.com",
                    role: "seller"
                },
                {
                    id: 4,
                    CPF: "20574062025",
                    name: "Mariana Costa",
                    phone: "11999990004",
                    password: await hashPassword("Mariana2025"),
                    email: "mariana.costa@example.com",
                    role: "seller"
                },
                {
                    id: 5,
                    CPF: "73441420071",
                    name: "Rafael Lima",
                    phone: "11999990005",
                    password: await hashPassword("R@f@3l2025"),
                    email: "rafael.lima@example.com",
                    role: "seller"
                },
                {
                    id: 6,
                    CPF: "64851454007",
                    name: "Aline Martins",
                    phone: "11999990006",
                    password: await hashPassword("@lin3.2025"),
                    email: "aline.martins@example.com",
                    role: "seller"
                },
                {
                    id: 7,
                    CPF: "63144994022",
                    name: "Bruno Rocha",
                    phone: "11999990007",
                    password: await hashPassword("sEnHa123"),
                    email: "bruno.rocha@example.com",
                    role: "seller"
                },
                {
                    id: 8,
                    CPF: "16075408002",
                    name: "Patrícia Almeida",
                    phone: "11999990008",
                    password: await hashPassword("S1E2N3H4A"),
                    email: "patricia.almeida@example.com",
                    role: "seller"
                },
                {
                    id: 9,
                    CPF: "62262810060",
                    name: "Lucas Ferreira",
                    phone: "987654321",
                    password: await hashPassword("senha1234"),
                    email: "vendedor@gmail.com",
                    role: "seller"
                },
                {
                    id: 10,
                    CPF: "63904086090",
                    name: "Juliana Mendes",
                    phone: "1121234567",
                    password: await hashPassword("senha1234"),
                    email: "usuario@gmail.com",
                    role: "user"
                }
            ]
        });

        console.log("Usuários criados com sucesso");
    }
    catch (error) {
        console.error(`problemas com createUsers(): ${error.message}`)
    }
}

async function createAddresses() {
    try {
        // Cria os endereços para os vendedores
        await prisma.address.createMany({
            data: [
                {
                    userID: 1,
                    street: "Rua das Palmeiras",
                    number: "123",
                    complemento: "Apto 202",
                    neighborhood: "Jardim América",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01435-000"
                },
                {
                    userID: 2,
                    street: "Avenida Brasil",
                    number: "456",
                    complemento: "Casa",
                    neighborhood: "Centro",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    zipCode: "20040-002"
                },
                {
                    userID: 3,
                    street: "Rua do Sol",
                    number: "789",
                    complemento: "Bloco B, Apto 101",
                    neighborhood: "Boa Viagem",
                    city: "Recife",
                    state: "PE",
                    zipCode: "51020-010"
                },
                {
                    userID: 4,
                    street: "Travessa das Flores",
                    number: "321",
                    complemento: "Fundos",
                    neighborhood: "Cidade Nova",
                    city: "Belo Horizonte",
                    state: "MG",
                    zipCode: "31170-010"
                },
                {
                    userID: 5,
                    street: "Rua das Acácias",
                    number: "654",
                    complemento: "Apto 305",
                    neighborhood: "Meireles",
                    city: "Fortaleza",
                    state: "CE",
                    zipCode: "60175-080"
                },
                {
                    userID: 6,
                    street: "Avenida Independência",
                    number: "987",
                    complemento: "Sala 12",
                    neighborhood: "Centro",
                    city: "Porto Alegre",
                    state: "RS",
                    zipCode: "90035-076"
                },
                {
                    userID: 7,
                    street: "Rua das Laranjeiras",
                    number: "159",
                    complemento: "Casa 2",
                    neighborhood: "Santa Teresa",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    zipCode: "20241-270"
                },
                {
                    userID: 8,
                    street: "Rua do Comércio",
                    number: "753",
                    complemento: "Loja 1",
                    neighborhood: "Centro Histórico",
                    city: "Salvador",
                    state: "BA",
                    zipCode: "40020-000"
                },
                {
                    userID: 9,
                    street: "Avenida das Nações",
                    number: "852",
                    complemento: "Cobertura",
                    neighborhood: "Asa Sul",
                    city: "Brasília",
                    state: "DF",
                    zipCode: "70390-100"
                },
                {
                    userID: 10,
                    street: "Rua do Cedro",
                    number: "246",
                    complemento: "Apto 401",
                    neighborhood: "Água Verde",
                    city: "Curitiba",
                    state: "PR",
                    zipCode: "80240-000"
                }
            ]
        });

        console.log("Endereços adicionados aos usuários");
    }
    catch (error) {
        console.error(`problemas com createAddress(): ${error.message}`)
    }
}

async function createShippingMethods() {
    try {
        for (const method of shippingMethods) {
            await prisma.shippingMethod.create({
                data: method
            });
        }
        console.log("Adicionando métodos de envio");
    } catch (error) {
        console.error(`problemas com createShippingMethods(): ${error.message}`);
    }
}

async function createCoupons() {
    try {
        for (const coupon of discountCoupons) {
            await prisma.coupon.create({
                data: coupon
            });
        }
        console.log("Criando alguns cupoms");
    } catch (error) {
        console.error(`problemas com createCoupons(): ${error.message}`);
    }
}

async function createPaymentMethods() {
    try {
        // Associado ao usuário Juliana Mendes
        await prisma.paymentMethod.create({
            data: {
                ...paymentMethods[0],
                userID: 10 
            }
        });

        // Associado com Lucas Ferreira
        await prisma.paymentMethod.create({
            data: {
                ...paymentMethods[1],
                userID: 9
            }
        });
        
        console.log("Adicionando método de pagamentos");
    } catch (error) {
        console.error(`problemas com createPaymentMethods(): ${error.message}`);
    }
}

async function createGames() {
    try {
        for (const game of games) {
            await prisma.game.create({
                data: {
                    id: parseInt(game.id),
                    title: game.name,
                    description: game.description,
                    image: game.image,
                    price: parseFloat(game.price),
                    genre: game.category,
                    stock: Math.floor(Math.random() * 20) + 1,
                    sellerID: getRandomSeller(),
                }
            });
        }

        console.log("Jogos adicionados com sucesso");
    }
    catch (error) {
        console.error(`problemas com createGames() : ${error.message}`)
    }
}

// Semeia as tabelas com dados de exemplo
async function seed() {
    await createAdmin();
    await createUsers();
    await createAddresses();
    await createGames();
    await createShippingMethods();
    await createCoupons();
    await createPaymentMethods();

    // Como o id é informado de forma explicita devemos atualizar o contador do autoincrement da tabela de jogos
    await prisma.$executeRaw`SELECT setval('"Game_id_seq"', (SELECT MAX(id) FROM "Game"))`;

    // Como o id é informado de forma explicita devemos atualizar o contador do autoincrement da tabela de usuários
    await prisma.$executeRaw`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"))`;

     // Atualizar sequências para as novas tabelas
    await prisma.$executeRaw`SELECT setval('"ShippingMethod_id_seq"', (SELECT MAX(id) FROM "ShippingMethod"))`;
    await prisma.$executeRaw`SELECT setval('"Coupon_id_seq"', (SELECT MAX(id) FROM "Coupon"))`;
    await prisma.$executeRaw`SELECT setval('"PaymentMethod_id_seq"', (SELECT MAX(id) FROM "PaymentMethod"))`;
}

seed().then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });