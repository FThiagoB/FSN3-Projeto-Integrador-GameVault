const products = [
  {
    id: 1,
    name: "Sled Storm",
    description:
      "Entre na adrenalina gelada de Sled Storm, onde motos de neve turbinadas encaram trilhas congeladas, saltos radicais e competidores implacáveis. Escolha seu piloto, destrave máquinas potentes e enfrente os ambientes mais extremos em corridas cheias de velocidade, manobras e destruição. Com trilha sonora eletrizante e modos multiplayer intensos, essa é a tempestade que você vai querer enfrentar.",
    price: "28.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d1/Sled_Storm_%281999%29_Coverart.png",
    category: "Corrida",
  },
  {
    id: 2,
    name: "Pokémon Crystal",
    description:
      "Entre numa jornada lendária onde você é o treinador de sua própria história. Enfrente ginásios desafiadores, capture Pokémon raros e enfrente os mistérios do Pokémon lendário Suicune em uma aventura que elevou a série a um novo nível. Com gráficos aprimorados, animações exclusivas e a opção de escolher entre treinador ou treinadora pela primeira vez, Pokémon Crystal é a versão definitiva da geração dourada.",
    price: "38.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/84/Pok%C3%A9mon_Crystal_box_art.png",
    category: "RPG",
  },
  {
    id: 3,
    name: "God of War II",
    description:
      "Kratos enfrenta os deuses do Olimpo em sua jornada por vingança.",
    price: "94.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/7/7e/God_of_War_2_capa.png",
    category: "Ação",
  },
  {
    id: 4,
    name: "Devil May Cry 3",
    description: "Hack and slash intenso com Dante em sua juventude.",
    price: "100.90",
    image: "https://upload.wikimedia.org/wikipedia/pt/c/c1/Dmc3.png",
    category: "Ação",
  },
  {
    id: 5,
    name: "Shadow of the Colossus",
    description: "Obra-prima artística de aventura e ação para PS2.",
    price: "100.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/6/66/ShadowOfTheColossusGH.jpg",
    category: "Ação",
  },
  {
    id: 6,
    name: "Resident Evil 4",
    description:
      "Revolucionário título da franquia com Leon enfrentando o horror em um vilarejo europeu.",
    price: "136.90",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg",
    category: "Survival Horror",
  },
  {
    id: 7,
    name: "Metal Gear Solid 3: Snake Eater",
    description: "Espionagem tática ambientada na Guerra Fria.",
    price: "112.90",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b3/Mgs3box.jpg",
    category: "Ação",
  },
  {
    id: 8,
    name: "Doom (1983)",
    description:
      "O lendário jogo de tiro em primeira pessoa que definiu o gênero.",
    price: "211.90",
    image: "https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg",
    category: "FPS",
  },
  {
    id: 9,
    name: "Need for Speed: Most Wanted (2005)",
    description:
      "Corridas urbanas com perseguições policiais e carros tunados.",
    price: "64.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Most_Wanted_Box_Art.jpg",
    category: "Corrida",
  },
  {
    id: 10,
    name: "GTA: San Andreas",
    description: "Exploração e ação em mundo aberto com CJ em Los Santos.",
    price: "72.90",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg",
    category: "Ação",
  },
  {
    id: 11,
    name: "A Bug's Life",
    description:
      "Acompanhe Flik, um formiga inventiva em busca de heróis para salvar sua colônia dos terríveis gafanhotos. Embarque numa aventura cheia de ação, puzzles criativos e cenários vibrantes inspirados no filme da Disney/Pixar. Explore folhas gigantes, se esgueire por cantos escondidos e descubra que até o menor dos heróis pode fazer uma grande diferença.",
    price: "70.29",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/83/A_Bug%27s_Life_Coverart.png",
    category: "Plataforma",
  },
  {
    id: 12,
    name: "Kensei: Sacred Fist",
    description:
      "Lute com mestres das artes marciais em combates intensos que misturam técnica, velocidade e pura vontade. Escolha entre diversos guerreiros, cada um com seu próprio estilo de luta autêntico, e desafie oponentes em arenas cheias de energia oriental. Com animações fluidas e golpes realistas, este é o jogo que celebra o verdadeiro espírito do combate mano a mano.",
    price: "45.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/29/KenseiSacredFist_NAfrontcover.png",
    category: "Luta",
  },
  {
    id: 13,
    name: "God of War",
    description:
      "O primeiro título da lendária franquia coloca você na pele de Kratos, um guerreiro espartano atormentado por seu passado. Após ser manipulado por Ares, o Deus da Guerra, e acabar assassinando sua própria família, Kratos busca redenção e vingança.",
    price: "50",
    image:
      "https://upload.wikimedia.org/wikipedia/en/b/b5/God_of_War_%282005%29_cover.jpg",
    category: "Ação",
  },
  {
    id: 14,
    name: "Devil May Cry",
    description:
      "Lançado em 2001 pela Capcom, este é o jogo que deu início à lendária franquia. Você assume o papel de Dante, um caçador de demônios estiloso e sarcástico, em uma missão para derrotar o Lorde Demônio Mundus na misteriosa ilha de Mallet.",
    price: "80",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1e/DMC1FrontCover.jpg",
    category: "Ação",
  },
  {
    id: 15,
    name: "The Secret of Monkey Island",
    description:
      "Lançado originalmente em 1990 pela Lucasfilm Games, este clássico do gênero point-and-click acompanha o aspirante a pirata Guybrush Threepwood em sua jornada para se tornar o mais temido dos sete mares.",
    price: "82.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/a/a8/The_Secret_of_Monkey_Island_artwork.jpg",
    category: "Aventura",
  },
  {
    id: 16,
    name: "Resident Evil",
    description:
      "ançado originalmente em 1996 pela Capcom, este é o jogo que definiu o gênero survival horror. Você assume o papel de Chris Redfield ou Jill Valentine, membros da equipe S.T.A.R.S., enviados para investigar assassinatos misteriosos nas Montanhas Arklay, nos arredores de Raccoon City.",
    price: "76.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/a/a6/Resident_Evil_1_cover.png",
    category: "Survival Horror",
  },
  {
    id: 17,
    name: "Metal Gear",
    description:
      "Criado por Hideo Kojima e lançado originalmente para o MSX2, Metal Gear é o jogo que deu início à icônica franquia de espionagem tática.",
    price: "53.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png",
    category: "Ação",
  },
  {
    id: 18,
    name: "Monkey Island 2: A Vingança de LeChuck",
    description:
      "A sequência direta de The Secret of Monkey Island, este clássico da LucasArts leva o aspirante a pirata Guybrush Threepwood em uma nova e hilária jornada para encontrar o lendário tesouro de Big Whoop.",
    price: "43.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/1/1c/LeChuck%27s_Revenge_artwork.jpg",
    category: "Aventura",
  },
  {
    id: 19,
    name: "Twisted Metal",
    description:
      "Twisted Metal 1 (1995 – PlayStation 1) O primeiro jogo da icônica franquia de combate veicular da Sony, Twisted Metal coloca os jogadores em uma competição mortal chamada Twisted Metal Tournament, onde o vencedor tem direito a realizar um desejo qualquer — mas com consequências imprevisíveis.",
    price: "48.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3d/Twisted_Metal_cover.jpg",
    category: "Combate Veicular",
  },
  {
    id: 20,
    name: "Grand Theft Auto: Vice City",
    description:
      "Grand Theft Auto: Vice City (2002 – PS2 / PC / Xbox / outras plataformas) Ambientado em 1986, este clássico da Rockstar Games mergulha os jogadores em uma versão fictícia de Miami, repleta de neon, excessos e criminalidade. Você assume o papel de Tommy Vercetti, um ex-presidiário enviado a Vice City para expandir os negócios da família Forelli.",
    price: "87.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3e/GTA_Vice_City_Stories_PSP_boxart.jpg",
    category: "Ação",
  },
  {
    id: 21,
    name: "Resident Evil Outbreak",
    description:
      "Ambientado em Raccoon City durante o surto do T-Vírus, o jogo permite que você controle um dos oito civis sobreviventes, cada um com habilidades únicas, enquanto tenta escapar da cidade infestada de zumbis e criaturas mutantes.",
    price: "93.90",
    image: "https://upload.wikimedia.org/wikipedia/en/a/ad/Re_outbreak_a.jpg",
    category: "Survival Horror",
  },
  {
    id: 22,
    name: "Sid Meier's Civilization (1991)",
    description:
      "O jogo que deu origem ao gênero 4X (eXplore, eXpand, eXploit, eXterminate), Civilization permite que você construa uma civilização desde 4000 a.C. até o futuro, guiando-a por meio de descobertas científicas, diplomacia, guerras e construção de maravilhas.",
    price: "85.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/ec/Civilizationboxart.jpg",
    category: "Estratégia",
  },
  {
    id: 23,
    name: "The Sims",
    description:
      "The Sims revolucionou os jogos ao permitir que os jogadores simulassem a vida cotidiana de personagens virtuais chamados Sims. Sem objetivos fixos ou “chefões”, o jogo oferece liberdade total para construir casas, desenvolver relacionamentos, seguir carreiras e cuidar das necessidades básicas dos Sims — tudo isso em um ambiente interativo e cheio de possibilidades.",
    price: "63.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/22/The_Sims_Coverart.png",
    category: "Simulação",
  },
  {
    id: 24,
    name: "SimCity 2000",
    description:
      "SimCity 2000 (1993 – PC / Mac / Amiga / SNES / PS1 / Saturn / GBA / outros) Sequência direta do clássico SimCity, este título da Maxis, criado por Will Wright, elevou o gênero de simulação urbana a um novo patamar. Com uma visão isométrica e camadas subterrâneas, SimCity 2000 permite que você construa e gerencie uma cidade complexa, lidando com infraestrutura, orçamento, desastres e a felicidade dos cidadãos.",
    price: "68.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d4/SimCity_2000_Coverart.png",
    category: "Simulação",
  },
  {
    id: 25,
    name: "Shin Megami Tensei (1992)",
    description:
      "O primeiro título principal da série Shin Megami Tensei, lançado pela Atlus, é um RPG sombrio e filosófico que se passa em um mundo pós-apocalíptico dominado por demônios, onde o jogador deve escolher entre ordem, caos ou neutralidade para moldar o destino da humanidade.",
    price: "66.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/43/Shin_Megami_Tensei_The_First.jpg",
    category: "RPG",
  },
  {
    id: 26,
    name: "Metroid",
    description:
      "Lançado pela Nintendo e criado por Gunpei Yokoi, Metroid é um dos pilares do gênero ação e exploração, dando origem ao estilo conhecido como Metroidvania. Você assume o papel da misteriosa caçadora de recompensas Samus Aran, enviada ao planeta Zebes para impedir que os Space Pirates usem os perigosos Metroids como armas biológicas.",
    price: "80.10",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5d/Metroid_boxart.jpg",
    category: "Ação-Aventura",
  },
  {
    id: 27,
    name: "Chrono Trigger (1995)",
    description:
      "Chrono Trigger é um dos RPGs mais aclamados de todos os tempos. Criado pelo lendário “Time dos Sonhos” — Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest) e Akira Toriyama (Dragon Ball) — o jogo combina narrativa envolvente, personagens carismáticos e um sistema de combate inovador.",
    price: "79.99",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg",
    category: "RPG",
  },
  {
    id: 28,
    name: "Chrono Cross",
    description:
      "Desenvolvido pela Square como sucessor espiritual de Chrono Trigger, Chrono Cross é um RPG profundo e poético que explora realidades paralelas, identidade e destino. Você controla Serge, um jovem que descobre que morreu em outra dimensão e embarca numa jornada para entender essa divergência — enfrentando o sombrio Lynx, buscando a misteriosa Frozen Flame, e cruzando caminhos com a ladra carismática Kid.",
    price: "61.90",
    image: "https://upload.wikimedia.org/wikipedia/en/9/9a/Chronocrossbox.jpg",
    category: "RPG",
  },
  {
    id: 29,
    name: "Mortal Kombat (1992)",
    description:
      "Mortal Kombat é o jogo que iniciou uma das franquias mais icônicas e controversas dos videogames. Com gráficos digitalizados de atores reais e uma violência gráfica inédita para a época, o jogo se destacou por sua atmosfera sombria, personagens marcantes e os famosos Fatalities — movimentos de finalização brutais que se tornaram marca registrada da série.",
    price: "42.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/33/Mortal_Kombat_cover.JPG",
    category: "Luta",
  },
  {
    id: 30,
    name: "Snatcher",
    description:
      "que mistura investigação, ficção científica e narrativa cinematográfica. Ambientado em Neo Kobe City, uma metrópole futurista inspirada em Blade Runner, você assume o papel de Gillian Seed, um agente da força-tarefa J.U.N.K.E.R., encarregado de caçar os misteriosos Snatchers.",
    price: "49.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/e9/PC88_Snatcher_Front.jpg",
    category: "Aventura",
  },
  {
    id: 31,
    name: "Policenauts",
    description:
      "Você assume o papel de Jonathan Ingram, um ex-astronauta que, após um acidente, passa 24 anos à deriva em criogenia no espaço. Ao retornar à Terra, ele se torna detetive e é envolvido em uma investigação que o leva de volta à colônia espacial Beyond Coast, onde descobre uma conspiração envolvendo tráfico de órgãos e drogas.",
    price: "159.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/e1/PC-98_Policenauts_box.jpg",
    category: "Aventura",
  },
  {
    id: 32,
    name: "Ninja Gaiden (NES)",
    description:
      "Ninja Gaiden é um dos jogos mais icônicos da era 8-bits. Você controla Ryu Hayabusa, um jovem ninja que viaja aos Estados Unidos para investigar o desaparecimento de seu pai e acaba envolvido em uma trama sombria envolvendo estátuas demoníacas, conspirações globais e uma ameaça ancestral.",
    price: "127.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/9b/Ninja_Gaiden_%28NES%29.jpg",
    category: "Ação",
  },
  {
    id: 33,
    name: "The Legend of Zelda",
    description:
      "The Legend of Zelda é o jogo que deu início a uma das franquias mais influentes da história dos videogames. Você controla Link, um jovem herói que deve resgatar a Princesa Zelda e derrotar o maligno Ganon, reunindo os fragmentos da Triforce da Sabedoria espalhados pelo reino de Hyrule.",
    price: "130.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/41/Legend_of_zelda_cover_%28with_cartridge%29_gold.png",
    category: "Ação-Aventura",
  },
  {
    id: 34,
    name: "Mega Man 3",
    description:
      "Mega Man 3 é o terceiro título da série clássica e marca a estreia de personagens icônicos como Rush, o cão robô, e Proto Man, o misterioso rival de Mega Man. A história gira em torno da criação de um robô gigante chamado Gamma, fruto da colaboração entre Dr. Light e Dr. Wily — que, claro, acaba traindo todos e foge com a máquina.",
    price: "59.90",
    image: "https://upload.wikimedia.org/wikipedia/en/4/49/Megaman3_box.jpg",
    category: "Plataforma",
  },
  {
    id: 35,
    name: "EarthBound",
    description:
      "Você controla Ness, um garoto com poderes psíquicos, que embarca numa jornada surreal para derrotar a entidade maligna Giygas, coletando melodias sagradas e enfrentando inimigos como hippies, robôs, pilhas de vômito e estátuas de lápis.",
    price: "31.90",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1f/EarthBound_Box.jpg",
    category: "RPG",
  },
  {
    id: 36,
    name: "Fire Emblem Gaiden",
    description:
      "A história se passa no continente de Valentia, dividido entre os reinos de Zofia e Rigel, governados pelos deuses Mila e Duma. Você controla dois protagonistas — Alm e Celica — em campanhas paralelas que buscam restaurar a paz e enfrentar os efeitos da corrupção divina.",
    price: "68.90",
    image: "https://upload.wikimedia.org/wikipedia/en/e/ee/Fe2box.png",
    category: "RPG Tático",
  },
  {
    id: 37,
    name: "Super Bomberman 5",
    description:
      "Último título da série Super Bomberman para o Super Nintendo, lançado exclusivamente no Japão pela Hudson Soft, este jogo leva a fórmula clássica de ação e estratégia a um novo nível. O vilão Imperador Terrorin liberta criminosos interdimensionais, e cabe ao Bomberman Branco restaurar a paz no planeta — enfrentando inimigos em zonas inspiradas nos jogos anteriores da franquia.",
    price: "50.90",
    image: "https://upload.wikimedia.org/wikipedia/en/9/9f/SuperBomberman5.jpg",
    category: "Ação",
  },
  {
    id: 38,
    name: "Harvest Moon: Friends of Mineral Town",
    description:
      "Este clássico da série Harvest Moon coloca você no papel de um jovem que herda uma fazenda abandonada em Mineral Town. Seu objetivo? Restaurar a propriedade, cultivar a terra, criar animais e construir relacionamentos com os habitantes da cidade — tudo isso enquanto vive uma vida tranquila e cheia de eventos sazonais.",
    price: "45.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/7a/Harvest_Moon-_FoMT.jpg",
    category: "Simulação",
  },
  {
    id: 39,
    name: "Yu-Gi-Oh! Forbidden Memories",
    description:
      "A história começa no Antigo Egito, com o Príncipe Atem enfrentando conspirações mágicas e duelos intensos. Após ser selado no Enigma do Milênio, ele desperta no futuro como Yugi Mutou, participando de um torneio da KaibaCorp para reunir os Itens do Milênio e salvar o mundo.",
    price: "47.00",
    image:
      "https://upload.wikimedia.org/wikipedia/en/b/b3/Yu-Gi-Oh%21_Forbidden_Memories_Cover.png",
    category: "Card Game",
  },
  {
    id: 40,
    name: "Silent Hill",
    description:
      "O primeiro capítulo de uma das franquias mais influentes do gênero survival horror psicológico. Você controla Harry Mason, um homem comum que chega à misteriosa cidade de Silent Hill em busca de sua filha adotiva Cheryl, desaparecida após um acidente de carro. O que ele encontra é uma cidade envolta em névoa, repleta de criaturas grotescas e segredos perturbadores.",
    price: "43.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png",
    category: "Survival Horror",
  },
  {
    id: 41,
    name: "Super Mario Bros.",
    description:
      "Explore o icônico Reino dos Cogumelos com Mario, o encanador mais famoso do mundo dos games! Pule obstáculos, enfrente inimigos e resgate a Princesa Peach das garras do terrível Bowser. Com fases desafiadoras, trilha sonora marcante e jogabilidade envolvente, Super Mario Bros é uma jornada nostálgica e imperdível para jogadores de todas as idades.",
    price: "23.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/0/03/Super_Mario_Bros._box.png",
    category: "Plataforma",
  },
  {
    id: 42,
    name: "The Legend of Zelda: A Link to the Past",
    description:
      "Embarque numa épica aventura de fantasia com Link, o jovem guerreiro destinado a enfrentar as forças das trevas e salvar o Reino de Hyrule. Descubra mundos paralelos, enigmas envolventes e masmorras traiçoeiras enquanto empunha a lendária Master Sword em busca da verdade e da princesa Zelda.",
    price: "29.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/The_Legenda_of_Zelda_A_Link_to_the_Past_capa.png/330px-The_Legenda_of_Zelda_A_Link_to_the_Past_capa.png",
    category: "Ação-Aventura",
  },
  {
    id: 43,
    name: "Donkey Kong Country",
    description:
      "Prepare-se para uma aventura eletrizante com Donkey Kong e seu parceiro Diddy em uma missão para recuperar seu tesouro de bananas roubado! Com gráficos inovadores, trilha sonora vibrante e uma jogabilidade cheia de ação, Donkey Kong Country é uma explosão de diversão nas profundezas da selva.",
    price: "44.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/1/1a/Donkey_Kong_Country_SNES_cover.png",
    category: "Plataforma",
  },
  {
    id: 44,
    name: "F-Zero",
    description:
      "Enfrente pilotos implacáveis em pistas futuristas a bordo de veículos antigravitacionais que desafiam as leis da física! F-Zero é pura ação acelerada, com gráficos ousados para sua época, trilha sonora marcante e uma experiência de corrida que moldou o gênero.",
    price: "28.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/9b/SNES_F-Zero_boxart.jpg",
    category: "Corrida",
  },
  {
    id: 45,
    name: "Shinobi III: Return of the Ninja Master",
    description:
      "Assuma o papel de Joe Musashi, o lendário mestre ninja, em uma missão eletrizante contra uma organização sombria que ameaça o mundo. Com movimentos ágeis, habilidades mortais e uma trilha sonora pulsante, Shinobi III entrega combates intensos, acrobacias cinematográficas e fases que desafiam seu reflexo e estratégia.",
    price: "59.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/1/1c/Shinobi_III_Return_of_the_Ninja_Master.jpg",
    category: "Ação",
  },
  {
    id: 46,
    name: "Gunstar Heroes",
    description:
      "Entre de cabeça em uma batalha frenética com os irmãos Gunstar, em uma luta desesperada para impedir que uma força maligna conquiste o mundo! Com ação cooperativa vibrante, visuais marcantes e uma variedade insana de armas e habilidades, Gunstar Heroes é adrenalina pura do início ao fim.",
    price: "33.90",
    image: "https://upload.wikimedia.org/wikipedia/en/8/80/Gunstar_Heroes.jpg",
    category: "Ação",
  },
  {
    id: 47,
    name: "Armored Core",
    description:
      "Suba na cabine de um robô de guerra totalmente personalizável e mergulhe em batalhas intensas em um mundo pós-apocalíptico dominado por corporações. Em Armored Core, você é um piloto mercenário, e cada missão exige precisão, estratégia e fogo pesado. Crie sua máquina perfeita combinando armas, armaduras e sistemas de propulsão, e encare desafios que testam sua habilidade e raciocínio tático.",
    price: "82.90",
    image: "https://upload.wikimedia.org/wikipedia/en/d/db/ArmoredCorePS1.jpg",
    category: "Mech Combat",
  },
  {
    id: 48,
    name: "Star Fox 64",
    description:
      "Junte-se ao esquadrão Star Fox em uma missão interplanetária cheia de ação, explosões e frases icônicas. Assuma o controle de Arwings, Tanques e até submarinos enquanto enfrenta o impiedoso exército de Andross e salva o sistema Lylat. Com múltiplas rotas, personagens carismáticos e uma das experiências mais memoráveis do Nintendo 64, Star Fox 64 combina emoção, estratégia e reflexo em cada fase.",
    price: "19.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/63/StarFox64_N64_Game_Box.jpg",
    category: "Tiro",
  },
  {
    id: 49,
    name: "Crash Bandicoot: Warped",
    description:
      "Viaje por diferentes épocas com Crash e Coco em uma missão para impedir os planos do maligno Uka Uka e o cientista maluco Dr. Neo Cortex! De antigos desertos egípcios até o futuro cheio de lasers, Crash Bandicoot: Warped traz variedade insana de fases, habilidades inéditas e aquele humor único que marcou uma geração.",
    price: "81.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3e/Crash_Bandicoot_3_Warped_Original_Box_Art.jpg",
    category: "Plataforma",
  },
  {
    id: 50,
    name: "Gran Turismo 2",
    description:
      "Mergulhe em um dos simuladores de corrida mais emblemáticos do PlayStation! Com mais de 600 carros licenciados e dezenas de pistas ao redor do mundo, Gran Turismo 2 oferece uma experiência profunda e estratégica, combinando desempenho técnico com paixão por velocidade. Prepare-se para ajustar, testar e desafiar os limites da física em cada curva!",
    price: "55.90",
    image: "https://upload.wikimedia.org/wikipedia/en/6/6b/GranTurismo2.jpg",
    category: "Corrida",
  },
  {
    id: 51,
    name: "Kingdom Hearts",
    description:
      "Junte-se a Sora, Donald e Pateta em uma jornada inesquecível por mundos encantados e sombrios, enfrentando criaturas das trevas enquanto busca por seus amigos perdidos. Kingdom Hearts mistura ação, emoção e narrativa envolvente, combinando personagens icônicos, cenários deslumbrantes e batalhas épicas em tempo real.",
    price: "79.90",
    image: "https://upload.wikimedia.org/wikipedia/en/8/85/Kingdom_Hearts.jpg",
    category: "RPG de Ação",
  },
  {
    id: 52,
    name: "Parasite Eve",
    description:
      "Viaje pelas ruas sombrias de Nova York em uma trama onde ciência e horror se misturam. Assuma o papel da agente Aya Brea, enquanto enfrenta mutações grotescas causadas por uma entidade que desafia a evolução humana. Parasite Eve combina combate tático em tempo real, narrativa adulta e atmosfera inquietante, criando uma experiência única que mescla RPG e survival horror.",
    price: "69.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3f/Parasite_Eve_Coverart.png",
    category: "RPG de Sobrevivência",
  },
  {
    id: 53,
    name: "Jurassic Park (SNES)",
    description:
      "Baseado no icônico filme de Steven Spielberg, Jurassic Park para Super Nintendo coloca você na pele do Dr. Grant em uma missão desesperada dentro de uma ilha infestada por dinossauros fora de controle. Com visão aérea e sequências em primeira pessoa, o jogo mistura exploração, tensão e ação, desafiando sua astúcia e reflexo a cada passo.",
    price: "68.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d0/Jurassic_Park_SNES_NA.jpg",
    category: "Ação-Aventura",
  },
  {
    id: 54,
    name: "Resident Evil – Code: Veronica",
    description:
      "Continue a saga sangrenta da série Resident Evil com Claire Redfield, agora presa em uma instalação remota cheia de segredos obscuros e horrores biológicos. Ao lado de novos aliados e enfrentando inimigos ainda mais insanos, Code: Veronica mergulha o jogador em uma narrativa sombria de genética, poder e monstros inesquecíveis — tudo com a tensão e atmosfera que só Resident Evil sabe entregar.",
    price: "55.90",
    image: "https://upload.wikimedia.org/wikipedia/en/4/44/RECV_boxart.jpg",
    category: "Survival Horror",
  },
  {
    id: 55,
    name: "Klonoa: Door to Phantomile",
    description:
      "Descubra um universo onírico com Klonoa, o aventureiro das orelhas compridas e do coração enorme, enquanto explora o mundo de Phantomile em busca de respostas e amigos perdidos. Com uma jogabilidade criativa baseada em vento e movimento, visuais que encantam e uma história surpreendentemente tocante, Klonoa: Door to Phantomile é uma joia cult que mistura ação, plataforma e emoção em doses perfeitas.",
    price: "75.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/25/Klonoa_playstation_front.jpg",
    category: "Plataforma",
  },
  {
    id: 56,
    name: "Alone in the Dark",
    description:
      "Entre em uma mansão esquecida pelo tempo e envolta em mistérios sobrenaturais. Como Edward Carnby ou Emily Hartwood, você desvenda segredos proibidos enquanto enfrenta criaturas saídas dos cantos mais sombrios da imaginação humana. Alone in the Dark combina atmosfera opressiva, puzzles inteligentes e uma trilha sonora inquietante para criar um dos fundadores do gênero survival horror.",
    price: "51.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/73/Alone_in_the_Dark_boxart.jpg",
    category: "Survival Horror",
  },
  {
    id: 57,
    name: "Dino Crisis",
    description:
      "Da mente por trás de Resident Evil, chega um pesadelo ainda mais selvagem. Em Dino Crisis, você assume o controle da agente Regina, enviada a uma instalação secreta onde algo deu terrivelmente errado... e onde dinossauros não estão extintos, estão famintos. A ação mistura survival horror com suspense tático, colocando o jogador frente a frente com criaturas velozes, imprevisíveis e mortais — tudo em tempo real, sem descanso.",
    price: "37.90",
    image: "https://upload.wikimedia.org/wikipedia/en/3/38/Dino_Crisis.jpg",
    category: "Survival Horror",
  },
  {
    id: 58,
    name: "Golden Axe II",
    description:
      "O mal renasceu sob o nome de Dark Guld, e agora cabe aos bravos guerreiros – Ax Battler, Tyris Flare e Gilius Thunderhead – restaurar a paz em um reino mergulhado em trevas. Com combos brutais, magias poderosas e montarias lendárias, Golden Axe II entrega combate arcade direto e feroz, embalado por uma trilha sonora épica e pixel art afiada como uma lâmina.",
    price: "34.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/e3/Golden_Axe_II_NA_Box_Art.jpeg",
    category: "Beat 'em up",
  },
  {
    id: 59,
    name: "Suikoden",
    description:
      "Mergulhe em um épico RPG onde cada escolha pesa e cada aliado importa. Em Suikoden, você assume o papel de um jovem herói envolvido em uma rebelião contra um império corrompido, reunindo até 108 personagens únicos — cada um com habilidades, histórias e destinos entrelaçados. Com batalhas estratégicas, lutas em larga escala e uma narrativa profundamente emocional, este clássico é uma verdadeira odisseia política e espiritual.",
    price: "59.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/f9/Suikoden_packaging01.jpg",
    category: "RPG",
  },
  {
    id: 60,
    name: "Shin Megami Tensei: Devil Summoner",
    description:
      "Assuma o papel de um Devil Summoner, um investigador ocultista que luta contra entidades sobrenaturais em uma cidade repleta de segredos e corrupção. Com visual estilizado, combates táticos em tempo real e a possibilidade de invocar e fundir demônios para formar sua equipe, Devil Summoner mistura RPG profundo com uma atmosfera noir envolvente e cheia de tensão.",
    price: "36.90",
    image: "https://upload.wikimedia.org/wikipedia/en/2/20/Devsum.jpg",
    category: "RPG",
  },
  {
    id: 61,
    name: "Armored Core 2: Another Age",
    description:
      "Volte ao cockpit de seu meca personalizado e enfrente novas ameaças em missões explosivas que expandem ainda mais o universo de Armored Core. Em Another Age, o conflito se intensifica entre facções e corporações, com mais de 100 missões, áreas inéditas e melhorias na customização que levam sua estratégia de combate a um novo nível. Escolha suas peças, monte sua arma de guerra e entre em batalha onde um movimento pode decidir tudo.",
    price: "68.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Armored_Core_2_-_Another_Age.jpg/250px-Armored_Core_2_-_Another_Age.jpg",
    category: "Mech Combat",
  },
  {
    id: 62,
    name: "Xenogears",
    description:
      "Viaje por uma epopeia sci-fi profunda e arrebatadora com Fei Fong Wong, um jovem marcado por traumas e segredos, em um mundo onde tecnologia antiga, religião e identidade colidem. Em Xenogears, você enfrentará batalhas estratégicas com mechas colossais chamados Gears, explorará cidades e ruínas com narrativa densa e temas existenciais — tudo embalado por uma trilha sonora memorável e diálogos que desafiam a mente.",
    price: "25.90",
    image: "https://upload.wikimedia.org/wikipedia/en/6/6f/Xenogears_box.jpg",
    category: "RPG",
  },
  {
    id: 63,
    name: "Digimon World",
    description:
      "Entre no mundo de File Island como um Tamer inesperado e descubra que os Digimon estão perdendo a memória... e o equilíbrio entre o bem e o caos está por um fio! Em Digimon World, você cuida, treina, alimenta e batalha com seu parceiro digital, explorando locais misteriosos, enfrentando criaturas selvagens e desvendando segredos que ameaçam o universo digital.",
    price: "28.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Digimonworld.jpg/250px-Digimonworld.jpg",
    category: "RPG de Simulação",
  },
  {
    id: 64,
    name: "Street Fighter II",
    description:
      "Escolha entre lutadores icônicos como Ryu, Chun-Li, Guile e muitos outros e parta para confrontos eletrizantes em locais exóticos ao redor do mundo. Street Fighter II revolucionou os jogos de luta com combos, especiais e partidas cheias de estratégia e reflexos afiados. Seja no modo arcade ou em duelos com amigos, cada combate é um teste de habilidade e determinação.",
    price: "54.90",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1d/SF2_JPN_flyer.jpg",
    category: "Luta",
  },
  {
    id: 65,
    name: "Ace Combat 2",
    description:
      "Prepare-se para desbravar os céus em missões eletrizantes, pilotando caças supersônicos contra forças inimigas em cenários globais cheios de ação. Em Ace Combat 2, cada missão exige reflexos rápidos, estratégia aérea e domínio total das nuvens — com visuais impressionantes para sua época e uma trilha sonora empolgante que amplifica o ritmo das batalhas.",
    price: "60.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/9/99/Ace_Combat_2_capa.png",
    category: "Simulador de Voo de Combate",
  },
  {
    id: 66,
    name: "Rayman",
    description:
      "Explore mundos fantásticos e surreais com Rayman, o herói flutuante que enfrenta criaturas malucas e desafios criativos para restaurar o equilíbrio de sua terra. Com arte vibrante, trilha sonora encantadora e jogabilidade fluida, Rayman combina ação, plataforma e imaginação em uma experiência cativante e única.",
    price: "46.90",
    image: "https://upload.wikimedia.org/wikipedia/en/4/45/Rayman_1_cover.png",
    category: "Plataforma",
  },
  {
    id: 67,
    name: "Vagrant Story",
    description:
      "Explore uma trama densa e sombria com Ashley Riot, um agente de elite envolvido numa conspiração que mistura magia, religião e política. Em Vagrant Story, cada combate é estratégico e técnico, exigindo domínio sobre armas, combos e afinidades elementais. Ambientado em cenários góticos repletos de mistério, o jogo mescla narrativa madura com gameplay profundo e sistema de customização complexo — tudo embalado por uma trilha sonora atmosférica e visual cinematográfico.",
    price: "40.50",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a3/Vagrantstorybox.jpg",
    category: "RPG de Ação",
  },
  {
    id: 68,
    name: "Suikoden 2",
    description:
      "Prepare-se para uma das experiências mais emocionantes e envolventes do mundo dos RPGs! Em Suikoden II, você vive a trajetória de um jovem soldado que, após uma terrível traição, se vê no centro de um conflito devastador entre nações. Reúna novamente os lendários 108 Stars of Destiny, construa seu castelo, lidere exércitos e enfrente batalhas políticas, táticas e emocionais com profundidade surpreendente.",
    price: "65.90",
    image: "https://upload.wikimedia.org/wikipedia/en/c/cc/Suikoden2_NA.jpg",
    category: "RPG",
  },
  {
    id: 69,
    name: "Koudelka",
    description:
      "Em uma noite envolta por mistério, três estranhos com passados sombrios se encontram em um antigo monastério galês, agora lar de forças malignas e memórias esquecidas. Koudelka mistura elementos de survival horror com RPG tático, trazendo combates em turnos, atmosfera gótica sufocante e uma narrativa madura cheia de intrigas espirituais, conflitos internos e escolhas dolorosas.",
    price: "25.90",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Koudelka_cover.jpg",
    category: "RPG de Sobrevivência",
  },
  {
    id: 70,
    name: "Monster Rancher 2",
    description:
      "Em um mundo onde discos de música revelam criaturas extraordinárias, Monster Rancher 2 te convida a despertar monstros únicos, treiná-los com cuidado e estratégia, e colocá-los em batalhas onde o vínculo entre treinador e criatura decide tudo. Com dezenas de espécies e combinações possíveis, cada jogada é uma surpresa — e cada treino, uma chance de forjar campeões.",
    price: "24.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/64/Monsterrancher2cover.jpg",
    category: "Simulação",
  },
  {
    id: 71,
    name: "Wild Arms 2",
    description:
      "Embarque em uma jornada cinematográfica pelo mundo de Filgaia, onde forças sombrias ameaçam mergulhar o continente em guerra total. Em Wild Arms 2, você assume o comando de uma equipe diversificada — de soldados a outcasts com poderes misteriosos — em batalhas estratégicas por turnos, puzzles inteligentes e uma trilha sonora inesquecível que mistura faroeste, fantasia e ficção científica.",
    price: "52.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/8c/Wild_ARMs_2_Cover_Art.jpg",
    category: "RPG",
  },
  {
    id: 72,
    name: "Legend of Mana",
    description:
      "Embarque em uma jornada poética no universo de Fa’Diel, onde você decide como o mapa do mundo se forma ao posicionar artefatos mágicos. Em Legend of Mana, você vivencia histórias independentes e emocionantes — de cavaleiros encantados a golems perdidos — enquanto enfrenta criaturas místicas, coleta itens raros e forma laços com personagens encantadores. Com arte deslumbrante pintada à mão e uma trilha sonora memorável composta por Yoko Shimomura, essa obra é um verdadeiro conto interativo.",
    price: "48.90",
    image: "https://upload.wikimedia.org/wikipedia/en/0/09/Legend_of_Mana.jpg",
    category: "RPG de Ação",
  },
  {
    id: 73,
    name: "Front Mission 3",
    description:
      "Entre no cockpit dos Wanzers, mechas altamente customizáveis, e mergulhe em uma narrativa tensa e ramificada, onde política internacional, lealdades divididas e conspirações tecnológicas colidem. Em Front Mission 3, cada batalha é um quebra-cabeça tático, com múltiplas estratégias possíveis, enquanto você escolhe entre dois caminhos narrativos distintos — cada um revelando um lado diferente da guerra silenciosa que domina o planeta.",
    price: "33.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/50/Front_Mission_3_Coverart.png",
    category: "RPG Tático",
  },
  {
    id: 74,
    name: "Grandia",
    description:
      "Acompanhe Justin, um jovem sonhador que embarca em uma jornada para provar que os mistérios do mundo estão esperando para serem revelados. Em Grandia, você explora ruínas ancestrais, conhece personagens cativantes e enfrenta perigos em batalhas dinâmicas com um sistema de combate inovador e estratégico — tudo guiado por uma trilha sonora memorável e uma narrativa leve, mas profunda.",
    price: "56.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/25/Grandia_coverart.jpg",
    category: "RPG",
  },
  {
    id: 75,
    name: "Legend of Legaia",
    description:
      "Aventure-se por um mundo onde os Seru, criaturas mágicas que uma vez ajudaram a humanidade, foram corrompidas por uma névoa sombria. Em Legend of Legaia, você guia Vahn, Noa e Gala — três heróis unidos pelo destino — em uma jornada para restaurar a esperança e derrotar a névoa maldita. Com sistema de combate inovador baseado em comandos de artes marciais, narrativa envolvente e trilha sonora emocional, este RPG é uma joia escondida que combina ação e espiritualidade.",
    price: "36.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3f/Legend_of_Legaia_cover.jpg",
    category: "RPG",
  },
  {
    id: 76,
    name: "Tomb Raider",
    description:
      "Prepare-se para explorar tumbas ancestrais, desvendar enigmas mortais e enfrentar criaturas lendárias com Lara Croft, a arqueóloga mais icônica dos videogames. Em Tomb Raider (1996), você embarca em uma jornada épica por locais exóticos em busca do misterioso artefato conhecido como Scion. Com gráficos revolucionários para a época e uma jogabilidade que definiu o gênero de ação e aventura em 3D, este clássico é uma verdadeira cápsula do tempo — e ainda hoje conquista fãs com seu charme retrô e atmosfera envolvente.",
    price: "44.90",
    image:
      "https://upload.wikimedia.org/wikipedia/pt/5/55/Tomb_Raider_1996_capa.png",
    category: "Ação-Aventura",
  },
  {
    id: 77,
    name: "Jackie Chan Stuntmaster",
    description:
      "Entre no mundo eletrizante das artes marciais com Jackie Chan Stuntmaster, um jogo repleto de pancadaria, acrobacias insanas e muito humor! Assuma o papel do lendário Jackie Chan em uma missão para resgatar seu avô sequestrado, enfrentando gangues perigosas pelas ruas de Nova York. Com movimentos inspirados nos filmes do astro e dublagem original do próprio Jackie, este beat ‘em up combina ação frenética com carisma inigualável.",
    price: "27.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/JackieChanStuntmaster.jpg/250px-JackieChanStuntmaster.jpg",
    category: "Beat 'em up",
  },
  {
    id: 78,
    name: "Tactics Ogre",
    description:
      "Mergulhe em um mundo devastado pela guerra civil, onde suas escolhas moldam o destino de nações. Tactics Ogre (1995) é um RPG tático profundo e envolvente, que combina batalhas em turnos com uma narrativa madura e cheia de reviravoltas. Com múltiplos caminhos, personagens complexos e um sistema de classes robusto, este clássico cult é referência absoluta no gênero e precursor de muitos sucessos modernos.",
    price: "64.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/40/SFC_Tactics_Ogre_-_Let_Us_Cling_Together_cover_art.jpg",
    category: "RPG Tático",
  },
  {
    id: 79,
    name: "Final Fantasy Tactics",
    description:
      "Em um reino marcado por intrigas políticas e batalhas sangrentas, Final Fantasy Tactics leva você a uma jornada inesquecível de honra, traição e poder. Com um sistema de combate tático refinado, dezenas de classes para personalizar seu exército e uma história densa e emocionante, este spin-off da lendária franquia Final Fantasy redefiniu o gênero dos RPGs estratégicos.",
    price: "39.90",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4b/Fftbox.jpg",
    category: "RPG Tático",
  },
  {
    id: 80,
    name: "Star Ocean: The Second Story",
    description:
      "Viaje entre mundos e descubra um universo onde ciência e magia colidem! Star Ocean: The Second Story é um RPG de ação com combates em tempo real, múltiplos protagonistas e finais variados que tornam cada jornada única. Escolha entre Claude, um jovem oficial da Federação Espacial, ou Rena, uma misteriosa garota com poderes ocultos — e embarque em uma aventura épica que mistura drama, romance e batalhas interplanetárias.",
    price: "19.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/71/Star_Ocean_Second_Story.jpg",
    category: "RPG de Ação",
  },
  {
    id: 81,
    name: "Armored Core 2",
    description:
      "Prepare-se para pilotar máquinas de guerra colossais em batalhas intensas e estratégicas! Armored Core 2 leva a ação para Marte, onde corporações lutam pelo controle do planeta e você, como um mercenário elite, decide quem vai dominar. Personalize seu mecha com centenas de peças, armas e sistemas, e enfrente missões desafiadoras em ambientes hostis e tecnológicos.",
    price: "46.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/4f/Armored_Core_2_cover_art.jpg",
    category: "Mech Combat",
  },
  {
    id: 82,
    name: "Vandal Hearts",
    description:
      "Em um reino marcado por corrupção e revolta, Vandal Hearts entrega batalhas táticas intensas e uma narrativa sombria cheia de traições e sacrifícios. Com combates em grade, classes evolutivas e cenários dinâmicos, este RPG estratégico é perfeito para quem busca profundidade tática e uma história envolvente. A cada decisão, o sangue derramado molda o futuro da resistência.",
    price: "30.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/26/Vandal_Hearts_Coverart.png",
    category: "RPG Tático",
  },
  {
    id: 83,
    name: "Parasite Eve II",
    description:
      "A agente Aya Brea está de volta — mais letal, mais experiente, e pronta para enfrentar uma nova ameaça mutante. Parasite Eve II mistura ação em tempo real com elementos de survival horror, em uma trama tensa que mergulha nos mistérios da evolução genética e nos horrores que ela pode desencadear. Explore instalações secretas, enfrente criaturas grotescas e desbloqueie habilidades especiais enquanto desvenda uma conspiração que vai muito além da ciência.",
    price: "45.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/92/Parasite_Eve_II_Coverart.png",
    category: "RPG de Sobrevivência",
  },
  {
    id: 84,
    name: "Diablo",
    description:
      "Desça às profundezas da catedral amaldiçoada de Tristram e enfrente o próprio Senhor do Terror em Diablo, o RPG de ação que redefiniu o gênero. Escolha entre guerreiro, ladina ou mago, explore masmorras geradas aleatoriamente, colete itens lendários e enfrente hordas demoníacas em combates sombrios e viscerais. Com atmosfera gótica e trilha sonora arrepiante, este clássico é uma jornada inesquecível ao coração das trevas.",
    price: "37.90",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3a/Diablo_Coverart.png",
    category: "RPG de Ação",
  },
  {
    id: 85,
    name: "Einhander",
    description:
      "Prepare-se para uma guerra interestelar explosiva com Einhänder, o shoot ’em up da Square que surpreendeu o mundo com sua estética futurista e jogabilidade frenética. Pilote caças armados até os dentes em missões contra forças inimigas da Terra, enquanto coleta armas, desvia de ataques insanos e encara chefes colossais. Com gráficos 3D impressionantes e trilha sonora eletrizante, este clássico é pura adrenalina em movimento.",
    price: "21.90",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Einhander.JPG",
    category: "Shoot 'em up",
  },
  {
    id: 86,
    name: "Panzer Dragoon Saga",
    description:
      "Em um mundo pós-apocalíptico dominado por impérios e criaturas ancestrais, Panzer Dragoon Saga entrega uma experiência única: um RPG profundo com combates em tempo real e a liberdade de voar sobre um dragão lendário. Assuma o papel de Edge, um jovem mercenário envolvido em uma trama de conspiração, mistério e poder antigo. Com narrativa cinematográfica, trilha sonora envolvente e um sistema de batalha inovador, este clássico cult do Sega Saturn é uma joia rara que transcende gêneros.",
    price: "28.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/64/PanzerDragoonSagaBox.jpg",
    category: "RPG",
  },
  {
    id: 87,
    name: "Nights into Dreams",
    description:
      "Entre em um mundo mágico onde os sonhos ganham vida e a imaginação não tem limites. NiGHTS into Dreams... é uma aventura onírica que mistura voo acrobático, cores vibrantes e trilha sonora encantadora. Controle NiGHTS, um ser etéreo que ajuda os jovens Claris e Elliot a enfrentar seus medos e restaurar o equilíbrio entre sonho e pesadelo. Com jogabilidade fluida e visual deslumbrante, este clássico do Sega Saturn é pura poesia interativa.",
    price: "49.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/33/NightsIntoDreamsBox.jpg",
    category: "Ação",
  },
  {
    id: 88,
    name: "Faxanadu",
    description:
      "O mundo está em ruínas, e cabe a você restaurar a paz em Faxanadu, um clássico de ação e RPG para o NES que combina exploração, combate e atmosfera única. Retorne à sua cidade natal e descubra que o Reino de El está sob ataque de criaturas demoníacas. Com armas, magias e itens à sua disposição, enfrente labirintos perigosos e chefes desafiadores em uma jornada cheia de mistério e estilo medieval.",
    price: "31.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/57/Faxanadu_NES_US_box.jpg",
    category: "Ação-RPG",
  },
  {
    id: 89,
    name: "Ninja Gaiden III: The Ancient Ship of Doom",
    description:
      "A escuridão se aproxima, e apenas o ninja lendário Ryu Hayabusa pode impedir o fim do mundo. Em Ninja Gaiden III: The Ancient Ship of Doom, a ação é intensa, os inimigos implacáveis e a trama mais sombria do que nunca. Com novos movimentos, gráficos aprimorados e desafios brutais, este capítulo da saga leva você a instalações secretas, ruínas misteriosas e confrontos épicos contra forças que desafiam a realidade.",
    price: "25.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/ec/Ninja_Gaiden_III_The_Ancient_Ship_of_Doom.jpg",
    category: "Ação",
  },
  {
    id: 90,
    name: "Shining Force III",
    description:
      "Em um continente dividido por guerra e intrigas políticas, Shining Force III oferece uma saga tática envolvente com batalhas em turnos, personagens carismáticos e uma narrativa contada sob múltiplas perspectivas. Com gráficos belíssimos para o Sega Saturn e um sistema de evolução profundo, cada decisão no campo de batalha influencia o destino do Império e da Resistência. Viva uma história rica em alianças, traições e heroísmo — onde o verdadeiro poder está na força da sua estratégia.",
    price: "135.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Shining_Force_III_cover.jpg",
    category: "RPG Tático",
  },
  {
    id: 91,
    name: "Virtua Fighter 2",
    description:
      "Entre na arena com os lutadores mais habilidosos do mundo em Virtua Fighter 2, o revolucionário jogo de luta 3D que elevou o realismo e a precisão a um novo patamar. Com gráficos impressionantes para a época, animações fluidas e um sistema de combate baseado em artes marciais reais, cada golpe exige estratégia, tempo e domínio. Escolha entre personagens icônicos como Akira, Pai e Sarah, e prove seu valor no ringue.",
    price: "25.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Virtua-fighter-2-box.jpg",
    category: "Luta",
  },
  {
    id: 92,
    name: "Duck Hunt",
    description:
      "Clássico absoluto do NES, Duck Hunt transforma sua sala em um campo de caça virtual com a revolucionária NES Zapper. Teste sua mira contra patos voadores em cenários simples e divertidos — mas cuidado: errar o tiro significa ouvir a risada inesquecível do cachorro zombeteiro. Com jogabilidade viciante e acessível, é diversão garantida para todas as idades.",
    price: "23.90",
    image: "https://upload.wikimedia.org/wikipedia/en/1/14/DuckHuntBox.jpg",
    category: "Tiro",
  },
  {
    id: 93,
    name: "StarTropics",
    description:
      "Embarque em uma jornada exótica com Mike Jones, um jovem herói armado com um ioiô e muita determinação, em StarTropics, o clássico de ação e aventura do NES. Explore ilhas misteriosas, resolva enigmas ancestrais e enfrente criaturas estranhas enquanto busca por seu tio desaparecido. Com narrativa envolvente, cenários vibrantes e desafios criativos, este jogo é uma carta de amor às aventuras dos anos 90.",
    price: "56.90",
    image: "https://upload.wikimedia.org/wikipedia/en/8/84/Startropics_box.jpg",
    category: "Ação-Aventura",
  },
  {
    id: 94,
    name: "Sega Rally Championship",
    description:
      "Prepare-se para acelerar em terrenos extremos com Sega Rally Championship, o arcade de corrida que definiu o gênero rally nos anos 90. Enfrente pistas de terra, lama e asfalto com física realista, curvas desafiadoras e aquele grito clássico: “Game Over Yeah!”. Escolha entre carros icônicos como o Toyota Celica e o Lancia Delta, e sinta a adrenalina de cada segundo contra o relógio.",
    price: "41.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/eb/Sega_Rally_flyer.jpg",
    category: "Corrida",
  },
  {
    id: 95,
    name: "Blaster Master",
    description:
      "Quando seu sapo de estimação desaparece em um mundo subterrâneo cheio de perigos, só há uma solução: entrar no SOPHIA, um tanque de combate futurista, e partir para o resgate! Blaster Master mistura ação side-scrolling com exploração em múltiplas perspectivas, oferecendo uma jogabilidade variada e desafiadora. Enfrente mutantes, descubra upgrades e mergulhe em cavernas cheias de segredos neste clássico cult do NES.",
    price: "65.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/99/Blaster_Master_boxart.jpg",
    category: "Ação-Aventura",
  },
  {
    id: 96,
    name: "Guardian Heroes",
    description:
      "Prepare-se para uma explosão de ação com Guardian Heroes, o beat ’em up da Treasure que mistura combates frenéticos, RPG profundo e escolhas que moldam o destino. Controle heróis lendários em batalhas épicas contra hordas de inimigos, invoque um guerreiro morto-vivo e desbloqueie múltiplos finais em uma história cheia de humor, magia e reviravoltas. Com gráficos vibrantes e multiplayer caótico, é diversão garantida no Sega Saturn.",
    price: "79.90",
    image: "https://upload.wikimedia.org/wikipedia/en/6/69/GH_front_cover.jpg",
    category: "Beat 'em up",
  },
  {
    id: 97,
    name: "Burning Rangers",
    description:
      "Em um futuro onde a tecnologia reina, o perigo ainda arde — e só os Burning Rangers podem salvar o dia. Neste exclusivo do Sega Saturn, você assume o papel de um bombeiro de elite em missões de resgate cheias de tensão, ação e efeitos visuais impressionantes. Navegue por instalações em chamas, salve civis e enfrente desafios imprevisíveis com estilo anime e trilha sonora empolgante.",
    price: "21.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/75/Burning_Rangers_cover.jpg",
    category: "Ação",
  },
  {
    id: 98,
    name: "Radiant Silvergun",
    description:
      "Prepare-se para uma experiência intensa e refinada com Radiant Silvergun, o lendário shoot ’em up da Treasure que redefiniu o gênero com profundidade estratégica e visual deslumbrante. Enfrente enxames de inimigos em combates vertiginosos, dominando sete tipos de armas desde o início — cada uma com usos táticos únicos. Com narrativa épica, trilha sonora emocionante e batalhas contra chefes colossais, este clássico do Sega Saturn é pura sinfonia de ação.",
    price: "63.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/ff/Radiant_Silvergun_flyer.jpg",
    category: "Shoot 'em up",
  },
  {
    id: 99,
    name: "Dragon Quest",
    description:
      "Em um reino ameaçado pelas forças das trevas, apenas um herói descendente de lendas pode recuperar a paz. Dragon Quest (conhecido como Dragon Warrior no Ocidente) é o RPG que deu origem a uma das franquias mais amadas da história dos videogames. Com batalhas por turnos, exploração de masmorras e uma jornada épica para derrotar o temido Dragonlord, este clássico do NES definiu os pilares do gênero com charme, simplicidade e coração.",
    price: "26.50",
    image: "https://upload.wikimedia.org/wikipedia/en/8/84/Dragon_Warrior.jpg",
    category: "RPG",
  },
  {
    id: 100,
    name: "Dragon Quest V",
    description:
      "Em Dragon Quest V, você não vive apenas uma jornada — você vive uma vida. Acompanhe o herói desde a infância até a idade adulta, enfrentando perdas, descobertas e escolhas que moldam seu destino. Forme laços profundos, escolha sua companheira de vida e lute ao lado de monstros recrutados em batalhas clássicas por turnos. Com narrativa emocional e geração de legado, este capítulo é um dos mais amados da série.",
    price: "24.90",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/89/Dragon_Quest_V_Super_Famicom_front_cover.jpg",
    category: "RPG",
  },
  {
    id: 101,
    name: "The Legend of Zelda: Skyward Sword",
    description:
      "Embarque em uma jornada épica que revela o início da cronologia da franquia Zelda. Assuma o papel de Link, um jovem cavaleiro de Skyloft, e voe pelos céus em seu Loftwing para resgatar sua amiga Zelda e enfrentar forças ancestrais que ameaçam o mundo abaixo das nuvens.",
    price: 89.90,
    image:
      "https://upload.wikimedia.org/wikipedia/pt/7/7a/The_Legend_of_Zelda_Skyward_Sword_capa.png",
    category: "RPG",
  },
];

export default products;