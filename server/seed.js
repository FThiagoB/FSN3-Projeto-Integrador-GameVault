const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JSON com informações sobre 100 jogos para preenchimento inicial
const games = require('./game_data/products_info.json');

async function createAdmin() {
    try{
        // Cadastra o usuário Admin
        await prisma.user.create({
            data: {
                CPF: "00000000000",
                email: "admin@gamevault.com",
                password: "admin",
                role: "admin"
            }
        });
    }
    catch( e ){
        console.error(`createAdmin() error : ${e}`)
    }
}

async function createSellers() {
    try{
        // Cadastra alguns vendedores
        await prisma.user.createMany({
            data: [
                {
                    CPF: "12345678901",
                    name: "Carlos Silva",
                    phone: "11999990001",
                    password: "carlos@123",
                    email: "carlos.silva@example.com",
                    role: "seller"
                },
                {
                    CPF: "23456789012",
                    name: "Fernanda Souza",
                    phone: "11999990002",
                    password: "fernanda2025",
                    email: "fernanda.souza@example.com",
                    role: "seller"
                },
                {
                    CPF: "34567890123",
                    name: "João Oliveira",
                    phone: "11999990003",
                    password: "JoãoOliveira",
                    email: "joao.oliveira@example.com",
                    role: "seller"
                },
                {
                    CPF: "45678901234",
                    name: "Mariana Costa",
                    phone: "11999990004",
                    password: "Mariana2025",
                    email: "mariana.costa@example.com",
                    role: "seller"
                },
                {
                    CPF: "56789012345",
                    name: "Rafael Lima",
                    phone: "11999990005",
                    password: "R@f@3l2025",
                    email: "rafael.lima@example.com",
                    role: "seller"
                },
                {
                    CPF: "67890123456",
                    name: "Aline Martins",
                    phone: "11999990006",
                    password: "@lin3.2025",
                    email: "aline.martins@example.com",
                    role: "seller"
                },
                {
                    CPF: "78901234567",
                    name: "Bruno Rocha",
                    phone: "11999990007",
                    password: "sEnHa123",
                    email: "bruno.rocha@example.com",
                    role: "seller"
                },
                {
                    CPF: "89012345678",
                    name: "Patrícia Almeida",
                    phone: "11999990008",
                    password: "S1E2N3H4A",
                    email: "patricia.almeida@example.com",
                    role: "seller"
                },
                {
                    CPF: "90123456789",
                    name: "Lucas Ferreira",
                    phone: "11999990009",
                    password: "LucasFerreiraVendedor",
                    email: "lucas.ferreira@example.com",
                    role: "seller"
                },
                {
                    CPF: "01234567890",
                    name: "Juliana Mendes",
                    phone: "11999990010",
                    password: "senha123",
                    email: "juliana.mendes@example.com",
                    role: "seller"
                }
            ]
        });
    }
    catch( e ){
        console.error(`createSellers() error : ${e}`)
    }
}

async function createAddresses() {
    try{
        // Cria os endereços para os vendedores
        await prisma.address.createMany({
            data: [
                {
                    userID: "12345678901",
                    street: "Rua das Palmeiras",
                    number: "123",
                    complemento: "Apto 202",
                    neighborhood: "Jardim América",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01435-000"
                },
                {
                    userID: "23456789012",
                    street: "Avenida Brasil",
                    number: "456",
                    complemento: "Casa",
                    neighborhood: "Centro",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    zipCode: "20040-002"
                },
                {
                    userID: "34567890123",
                    street: "Rua do Sol",
                    number: "789",
                    complemento: "Bloco B, Apto 101",
                    neighborhood: "Boa Viagem",
                    city: "Recife",
                    state: "PE",
                    zipCode: "51020-010"
                },
                {
                    userID: "45678901234",
                    street: "Travessa das Flores",
                    number: "321",
                    complemento: "Fundos",
                    neighborhood: "Cidade Nova",
                    city: "Belo Horizonte",
                    state: "MG",
                    zipCode: "31170-010"
                },
                {
                    userID: "56789012345",
                    street: "Rua das Acácias",
                    number: "654",
                    complemento: "Apto 305",
                    neighborhood: "Meireles",
                    city: "Fortaleza",
                    state: "CE",
                    zipCode: "60175-080"
                },
                {
                    userID: "67890123456",
                    street: "Avenida Independência",
                    number: "987",
                    complemento: "Sala 12",
                    neighborhood: "Centro",
                    city: "Porto Alegre",
                    state: "RS",
                    zipCode: "90035-076"
                },
                {
                    userID: "78901234567",
                    street: "Rua das Laranjeiras",
                    number: "159",
                    complemento: "Casa 2",
                    neighborhood: "Santa Teresa",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    zipCode: "20241-270"
                },
                {
                    userID: "89012345678",
                    street: "Rua do Comércio",
                    number: "753",
                    complemento: "Loja 1",
                    neighborhood: "Centro Histórico",
                    city: "Salvador",
                    state: "BA",
                    zipCode: "40020-000"
                },
                {
                    userID: "90123456789",
                    street: "Avenida das Nações",
                    number: "852",
                    complemento: "Cobertura",
                    neighborhood: "Asa Sul",
                    city: "Brasília",
                    state: "DF",
                    zipCode: "70390-100"
                },
                {
                    userID: "01234567890",
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
    catch( e ){
        console.error(`createAddress() error : ${e}`)
    }
}

async function createGames() {
    try{
        // Cria as entradas para os jogos
        const sellersID = ["12345678901", "23456789012", "34567890123", "45678901234", "56789012345", "67890123456", "78901234567", "89012345678", "90123456789", "01234567890"]

        const getRandomSeller = () => {
            return sellersID[
                Math.floor(Math.random() * sellersID.length)
            ]
        };

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
    catch( e ){
        console.error(`createGames() error : ${e}`)
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
}

seed()