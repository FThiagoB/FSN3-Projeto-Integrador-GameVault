const {hashPassword} = require("./src/utils/miscellaneous");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JSON com informações sobre 100 jogos para preenchimento inicial
const games = require('./game_data/products_info.json');

// Função que servirá para sortear um vendedor (id de 1 à 9)
const getRandomSeller = () => {
    return parseInt(Math.floor(Math.random() * 9) + 1)
};

async function createAdmin() {
    try{
        // Cadastra o usuário Admin
        await prisma.user.create({
            data: {
                id: 0,
                email: "admin@gmail.com",
                password: await hashPassword("admin"),
                role: "admin"
            }
        });
    }
    catch( error ){
        console.error(`createAdmin() error : ${error.message}`)
    }
}

async function createSellers() {
    try{
        // Cadastra alguns vendedores
        await prisma.user.createMany({
            data: [
                {
                    id: 1,
                    CPF: "12345678901",
                    name: "Carlos Silva",
                    phone: "11999990001",
                    password: await hashPassword("senha1234"),
                    email: "vendedor@gmail.com",
                    role: "seller"
                },
                {
                    id: 2,
                    CPF: "23456789012",
                    name: "Fernanda Souza",
                    phone: "11999990002",
                    password: await hashPassword("fernanda2025"),
                    email: "fernanda.souza@example.com",
                    role: "seller"
                },
                {
                    id: 3,
                    CPF: "34567890123",
                    name: "João Oliveira",
                    phone: "11999990003",
                    password: await hashPassword("JoãoOliveira"),
                    email: "joao.oliveira@example.com",
                    role: "seller"
                },
                {
                    id: 4,
                    CPF: "45678901234",
                    name: "Mariana Costa",
                    phone: "11999990004",
                    password: await hashPassword("Mariana2025"),
                    email: "mariana.costa@example.com",
                    role: "seller"
                },
                {
                    id: 5,
                    CPF: "56789012345",
                    name: "Rafael Lima",
                    phone: "11999990005",
                    password: await hashPassword("R@f@3l2025"),
                    email: "rafael.lima@example.com",
                    role: "seller"
                },
                {
                    id: 6,
                    CPF: "67890123456",
                    name: "Aline Martins",
                    phone: "11999990006",
                    password: await hashPassword("@lin3.2025"),
                    email: "aline.martins@example.com",
                    role: "seller"
                },
                {
                    id: 7,
                    CPF: "78901234567",
                    name: "Bruno Rocha",
                    phone: "11999990007",
                    password: await hashPassword("sEnHa123"),
                    email: "bruno.rocha@example.com",
                    role: "seller"
                },
                {
                    id: 8,
                    CPF: "89012345678",
                    name: "Patrícia Almeida",
                    phone: "11999990008",
                    password: await hashPassword("S1E2N3H4A"),
                    email: "patricia.almeida@example.com",
                    role: "seller"
                },
                {
                    id: 9,
                    CPF: "90123456789",
                    name: "Lucas Ferreira",
                    phone: "11999990009",
                    password: await hashPassword("LucasFerreiraVendedor"),
                    email: "lucas.ferreira@example.com",
                    role: "seller"
                },
                {
                    id: 10,
                    CPF: "01234567890",
                    name: "Juliana Mendes",
                    phone: "11999990010",
                    password: await hashPassword("senha1234"),
                    email: "usuario@gmail.com",
                    role: "user"
                }
            ]
        });
    }
    catch( error ){
        console.error(`createSellers() error : ${error.message}`)
    }
}

async function createAddresses() {
    try{
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
    }
    catch( error ){
        console.error(`createAddress() error : ${error.message}`)
    }
}

async function createGames() {
    try{
        for( const game of games ){
            await prisma.game.create({
                data:{
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
    }
    catch( error ){
        console.error(`createGames() error : ${error.message}`)
    }
}

// Semeia as tabelas com dados de exemplo
async function seed() {
    await createAdmin();
    await createSellers();
    await createAddresses();
    await createGames();

    // Como o id é informado de forma explicita devemos atualizar o contador do autoincrement da tabela de jogos
    await prisma.$executeRaw`SELECT setval('"Game_id_seq"', (SELECT MAX(id) FROM "Game"))`;

    // Como o id é informado de forma explicita devemos atualizar o contador do autoincrement da tabela de usuários
    await prisma.$executeRaw`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"))`;
}

seed()