const fs = require("fs");
const path = require("path");

const { handleImageUpload } = require("../utils/imageHandler");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getGames = async (req, res) => {
  try {
    // 1. Extrai e define os parâmetros da requisição com valores padrão
    const {
      orderby = "asc",
      search = "",
      genre,
      page = 1,
      limit = 10,
    } = req.query;

    // 2. Converte página e limite para números, calculando o 'skip'
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 3. Monta a cláusula 'where' dinamicamente para o filtro
    const where = {
      title: {
        contains: search,
        mode: "insensitive",
      },

      // Remove os jogos de usuários deletados
      seller: {
        isDeleted: false,
      },

      // Adiciona o filtro de gênero apenas se ele for fornecido na URL
      ...(genre && { genre: { equals: genre, mode: "insensitive" } }),
    };

    // 4. Executa a busca e a contagem em uma única transação para melhor performance
    const [games, total] = await prisma.$transaction([
      prisma.game.findMany({
        where,
        orderBy: { id: orderby },
        skip,
        take: limitNum,
      }),
      prisma.game.count({ where }),
    ]);

    // 5. Mapeia os resultados para adicionar a URL completa da imagem
    const gamesWithImageUrl = games.map((game) => ({
      ...game,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${
        game.image
      }`,
    }));
    
    // 6. Verifica se existem jogos com esses filtros
    if( !(gamesWithImageUrl.length) )
      return res.status(404).json({message: "No games found."});

    // 7. Retorna a resposta formatada para o frontend
    res.status(200).json({
      games: gamesWithImageUrl,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const distinctGenres = await prisma.game.findMany({
      select: {
        genre: true,
      },
      where: {
        seller: {
          isDeleted: false,
        },
      },
      distinct: ["genre"],
    });
    // Extrai apenas os nomes dos gêneros do array de objetos
    const genres = distinctGenres.map((item) => item.genre);
    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getGamesByID = async (req, res) => {
  try {
    const id_procurado = parseInt(req.params.id);

    if (isNaN(id_procurado)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const jogo_encontrado = await prisma.game.findUnique({
      where: {
        id: id_procurado,
      },
    });

    if (!jogo_encontrado) {
      return res.status(404).json({ message: "Game not found" });
    }

    // ✅ ADICIONE A URL COMPLETA DA IMAGEM AQUI
    const jogoComUrl = {
      ...jogo_encontrado,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${
        jogo_encontrado.image
      }`,
    };

    res.status(200).json(jogoComUrl); // Envie o objeto com a imageUrl
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomGame = async (req, res) => {
  try {
    // 1. Conta o total de jogos no banco de dados
    const gameCount = await prisma.game.count({
      where: {
        seller: {
          isDeleted: false,
        },
      }
  });

    // 2. Gera um número aleatório para pular (skip)
    const randomSkip = Math.floor(Math.random() * gameCount);

    // 3. Busca um único jogo, pulando a quantidade aleatória de registros
    const randomGame = await prisma.game.findFirst({
      skip: randomSkip,
      where: {
        seller: {
          isDeleted: false,
        },
      }
    });

    if (!randomGame) {
      return res
        .status(404)
        .json({ message: "No games found." });
    }

    // 4. Adiciona a URL completa da imagem, como nas outras funções
    const gameWithImageUrl = {
      ...randomGame,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${
        randomGame.image
      }`,
    };

    res.status(200).json(gameWithImageUrl);
  } catch (error) {
    console.error("Erro ao buscar jogo aleatório:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getGameImage = async (req, res) => {
  const imageName = req.params.image;
  const imagePath = path.resolve(
    __dirname,
    "..",
    "uploads",
    "games",
    imageName
  );

  // Verifica se o arquivo existe
  if (fs.existsSync(imagePath)) res.sendFile(imagePath);
  else res.status(404).json({ error: "Image not found." });
};

exports.createGame = async (req, res) => {
  try {
    // Campos usados diretamente no cadastro do jogo
    if(!req.body) req.body = {};

    const title = req.body.title;
    const description = req.body.description;
    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);
    const sellerID = parseInt(req.user.id);
    const genre = req.body.genre;

    let game;
    console.log({title, description, price, stock, sellerID, genre})

    // Verifica se todos os campos foram especificados
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.price ||
      !req.body.genre ||
      req.body.stock === undefined
    )
      return res.status(400).json({
        message:
          "fill in all fields required for registration.",
      });

    // Verifica se o estoque foi informado mas a conversão para int retornou NaN (erro na conversão) ou se for um número negativo
    if ((req.body.stock && Number.isNaN(stock)) || stock < 0)
      return res.status(400).json({
        message:
          "stock must be a positive integer.",
      });

    // Verifica se o preço foi informado mas a conversão para float retornou NaN (erro na conversão) ou se for um número negativo
    if ((req.body.price && Number.isNaN(price)) || price <= 0)
      return res.status(400).json({
        message:
          "price must be a positive non-zero number.",
      });

    const prismaQuery = {
      data: {
        title: title,
        description: description,
        price: price,
        stock: stock,
        sellerID: sellerID,
        genre: genre,
      },
    };

    // Primeiro cadastra o jogo (garante que tudo esteja certo para fazer upload da imagem)
    game = await prisma.game.create(prismaQuery);

    // Se a imagem foi passada, realiza o download e seta
    const filename = await handleImageUpload( req, game.id, "games" )

    if( filename ){
      game = await prisma.game.update({
        where: { id: game.id },
        data: { image: filename }
      });
    }
    
    res.status(201).json(game);
  } catch (error) {
    console.error(error);

    switch (error.code) {
      // Problemas de restrição (id já existe ou problemas com o ID do vendedor)
      case "P2002":
        if( error?.meta?.modelName == "Game")
          res.status(400).json({
            message: `Seller already has this title`,
          });
        break;

      default:
        res.status(500).json({ message: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
};

exports.updateGame = async (req, res) => {
  try {
    const gameID = parseInt(req.params.id);
    const sellerID = parseInt(req.user.id);

    let game;

    if(!req.body) req.body = {};
    const new_title = req.body.title;
    const new_description = req.body.description;
    const new_price = parseFloat(req.body.price);
    const new_stock = parseInt(req.body.stock);
    const new_genre = req.body.genre;

    // Verifica se o jogo existe e se pertence ao vendedor do token
    const originGame = await prisma.game.findFirst({
      where: {
        id: gameID,
        sellerID: sellerID
      }
    });

    if(!originGame){
      return res.status(400).json({
        message:
          "Game not found",
      });
    }

    // Verifica se o estoque foi informado mas a conversão para int retornou NaN (erro na conversão) ou se for um número negativo
    if ((req.body.stock && Number.isNaN(new_stock)) || new_stock < 0)
      return res.status(400).json({
        message:
          "stock must be a positive integer..",
      });

    // Verifica se o preço foi informado mas a conversão para float retornou NaN (erro na conversão) ou se for um número negativo
    if ((req.body.price && Number.isNaN(new_price)) || new_price <= 0)
      return res.status(400).json({
        message:
          "price must be a positive non-zero number.",
      });

    // Monta a query do prisma por meio de uma variável
    const query_prisma = {};
    query_prisma.where = { id: gameID };
    query_prisma.data = {};

    // Preenche a query de acordo com os campos informados na requisição (só precisa passar o que for mudar)
    if (req.body.title) query_prisma.data.title = new_title;
    if (req.body.description) query_prisma.data.description = new_description;
    if (req.body.price) query_prisma.data.price = new_price;
    if (req.body.stock !== undefined) query_prisma.data.stock = new_stock;
    if (req.body.genre) query_prisma.data.genre = new_genre;

    game = await prisma.game.update(query_prisma);

    // Foi especificado uma nova imagem
    // Se a imagem foi passada, realiza o download e seta
    const filename = await handleImageUpload( req, gameID, "game" )

    if( filename ){
      game = await prisma.game.update({
        where: { id: gameID },
        data: { image: filename }
      });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const id_procurado = parseInt(req.params.id);

    const jogo_deletado = await prisma.game.delete({
      where: {
        id: id_procurado,
      },
    });

    res.status(200).json(jogo_deletado);
  } catch (error) {
    console.error(error);
    switch (error.code) {
      // Jogo não encontrado
      case "P2025":
        res.status(404).json({
          message: `No record was found for a delete.`,
        });
        break;

      default:
        res.status(500).json({ message: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
};