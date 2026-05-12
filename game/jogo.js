"use strict";
(() => {
  // src/personagem.ts
  var Personagem = class {
    constructor(nome, vida, forca, defesa, cura, imagemDoPersonagem) {
      this.nome = "personagem";
      this.vida = 0;
      this.forca = 0;
      this.defesa = 0;
      this.cura = 0;
      this.imagem = "";
      this.ultimoAtaque = "aguardando";
      this.jaUsouCura = false;
      this.nome = nome;
      this.vida = vida;
      this.forca = forca;
      this.defesa = defesa;
      this.cura = cura;
      this.imagem = imagemDoPersonagem;
    }
    log(mensagem) {
      const consoleDoJogo = document.getElementById("console");
      if (consoleDoJogo) {
        consoleDoJogo.innerHTML += "<p>" + mensagem + "</p>";
        consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
      }
    }
    iscontinuavivo() {
      return this.vida > 0;
    }
    SofrerDano(dano) {
      const danoReduzido = Math.round(dano * (1 - this.defesa / 100));
      this.vida = this.vida - danoReduzido;
      if (this.vida < 0) {
        this.vida = 0;
      }
      this.log(
        `${this.nome} tomou ${danoReduzido} de dano e agora tem ${this.vida} de vida.`
      );
      this.usarCura();
      if (this.vida === 0) {
        this.log(`${this.nome} foi derrotado!`);
      }
    }
    gerarataque() {
      let maximoAtk = 3;
      return Math.floor(Math.random() * maximoAtk) + 1;
    }
    ataqueLancado() {
      const ataque = this.gerarataque();
      switch (ataque) {
        case 1:
          return "ataque fraco";
        case 2:
          return "ataque m\xE9dio";
        case 3:
          return "ataque forte";
        default:
          return "erro";
      }
    }
    registrarAtaque(ataque) {
      this.ultimoAtaque = ataque;
    }
    getUltimoAtaque() {
      return this.ultimoAtaque;
    }
    getVida() {
      return this.vida;
    }
    getImgem() {
      return this.imagem;
    }
    usarCura() {
      if (this.vida < 50 && !this.jaUsouCura) {
        this.vida = this.vida + this.cura;
        if (this.vida > 100) {
          this.vida = 100;
        }
        this.jaUsouCura = true;
        this.log(`${this.nome} usou a cura e recuperou ${this.cura} de vida!`);
      }
    }
  };

  // src/cavaleiro.ts
  var Cavaleiro = class extends Personagem {
    constructor(nome, vida, forca, defesa) {
      super(
        nome,
        vida,
        forca,
        defesa,
        30,
        "./public/cavaleiro.png"
      );
    }
    atacar(inimigo) {
      const ataque = this.gerarataque();
      switch (ataque) {
        case 1:
          this.ataqueCavaleiro1(inimigo);
          break;
        case 2:
          this.ataqueCavaleiro2(inimigo);
          break;
        case 3:
          this.ataqueCavaleiro3(inimigo);
          break;
      }
    }
    ataqueCavaleiro1(inimigo) {
      this.registrarAtaque("Ataque fraco");
      this.log(`${this.nome} deu um ataque fraco em ${inimigo.nome}.`);
      inimigo.SofrerDano(5);
    }
    ataqueCavaleiro2(inimigo) {
      this.registrarAtaque("Ataque medio");
      this.log(`${this.nome} deu um ataque medio em ${inimigo.nome}.`);
      inimigo.SofrerDano(10);
    }
    ataqueCavaleiro3(inimigo) {
      this.registrarAtaque("Ataque poderoso");
      this.log(`${this.nome} deu um ataque poderoso em ${inimigo.nome}.`);
      inimigo.SofrerDano(20);
    }
  };

  // src/dragao.ts
  var Dragao = class extends Personagem {
    constructor(nome, vida, forca, defesa) {
      super(nome, vida, forca, defesa, 25, "./public/dragao.png");
    }
    atacar(inimigo) {
      const ataque = this.gerarataque();
      switch (ataque) {
        case 1:
          this.ataqueDragao1(inimigo);
          break;
        case 2:
          this.ataqueDragao2(inimigo);
          break;
        case 3:
          this.ataqueDragao3(inimigo);
          break;
      }
    }
    ataqueDragao1(inimigo) {
      this.registrarAtaque("Arranhao fraco");
      this.log(`${this.nome} arranhou ${inimigo.nome}.`);
      inimigo.SofrerDano(5);
    }
    ataqueDragao2(inimigo) {
      this.registrarAtaque("Mordida media");
      this.log(`${this.nome} mordeu ${inimigo.nome}.`);
      inimigo.SofrerDano(10);
    }
    ataqueDragao3(inimigo) {
      this.registrarAtaque("Fogo poderoso");
      this.log(`${this.nome} cuspiu fogo em ${inimigo.nome}.`);
      inimigo.SofrerDano(20);
    }
  };

  // src/mago.ts
  var Mago = class extends Personagem {
    constructor(nome, vida, forca, defesa) {
      super(
        nome,
        vida,
        forca,
        defesa,
        30,
        "https://i.pinimg.com/originals/ec/45/80/ec4580d525dfafcd8c22a5a8f4d26033.png"
      );
    }
    atacar(inimigo) {
      const ataque = this.gerarataque();
      switch (ataque) {
        case 1:
          this.registrarAtaque("Magia fraca");
          this.log(`${this.nome} lancou magia fraca de fogo.`);
          inimigo.SofrerDano(5);
          break;
        case 2:
          this.registrarAtaque("Magia media");
          this.log(`${this.nome} lancou magia media de gelo.`);
          inimigo.SofrerDano(10);
          break;
        case 3:
          this.registrarAtaque("Magia poderosa");
          this.log(`${this.nome} lancou magia poderosa de raio.`);
          inimigo.SofrerDano(20);
          break;
      }
    }
  };

  // src/jogo.ts
  var partidaAtual = 0;
  var partidaEmAndamento = false;
  var jogoPausado = false;
  var resolverRetomada = null;
  var textosDosGolpes = {
    mago: ["Magia fraca", "Magia media", "Magia poderosa"],
    cavaleiro: ["Ataque fraco", "Ataque medio", "Ataque poderoso"],
    dragao: ["Arranhao fraco", "Mordida media", "Fogo poderoso"]
  };
  var Jogo = class {
    async iniciarJogo(player1, player2, idDaPartida) {
      let turno = 1;
      this.log(`Partida iniciada: ${player1.nome} VS ${player2.nome}`);
      this.atualizarInterface(player1, player2);
      while (partidaEstaAtiva(idDaPartida) && player1.iscontinuavivo() && player2.iscontinuavivo()) {
        await aguardarRetomada(idDaPartida);
        if (!partidaEstaAtiva(idDaPartida)) break;
        this.log(`Round ${turno}`);
        player1.atacar(player2);
        atualizarAtaqueUsado(1, player1.getUltimoAtaque());
        animarAtaque(1, player1);
        this.atualizarInterface(player1, player2);
        await this.esperarTempo();
        await aguardarRetomada(idDaPartida);
        if (!partidaEstaAtiva(idDaPartida) || !player2.iscontinuavivo()) break;
        player2.atacar(player1);
        atualizarAtaqueUsado(2, player2.getUltimoAtaque());
        animarAtaque(2, player2);
        this.atualizarInterface(player1, player2);
        await this.esperarTempo();
        turno++;
      }
      if (partidaEstaAtiva(idDaPartida)) {
        this.log(
          player1.iscontinuavivo() ? `${player1.nome} venceu!` : `${player2.nome} venceu!`
        );
      }
    }
    buscaComponente(id) {
      return document.getElementById(id);
    }
    atualizarInterface(player1, player2) {
      this.atualizarCarta(1, player1);
      this.atualizarCarta(2, player2);
    }
    atualizarCarta(numeroDoPlayer, player) {
      const carta = this.buscaComponente(`imgplayer${numeroDoPlayer}`);
      const imagem = carta?.querySelector("img");
      const imagemArena = this.buscaComponente(`arenaPlayer${numeroDoPlayer}`);
      const vida = this.buscaComponente(`vida${numeroDoPlayer}`);
      const nome = carta?.querySelector(`.PlayerEfeito${numeroDoPlayer}`);
      const vidaAtual = Math.max(0, Math.round(player.getVida()));
      const tipo = descobrirTipoPersonagem(player);
      if (imagem) {
        imagem.src = player.getImgem();
        imagem.className = `tipo-${tipo}`;
      }
      if (imagemArena) {
        imagemArena.src = player.getImgem();
        imagemArena.className = `arena-personagem arena-player${numeroDoPlayer} tipo-${tipo}`;
      }
      if (vida) {
        vida.style.width = `${vidaAtual}%`;
        vida.textContent = `hp ${vidaAtual}`;
        vida.style.backgroundColor = vidaAtual <= 40 ? "red" : "limegreen";
      }
      if (nome) {
        nome.textContent = player.nome;
      }
    }
    async esperarTempo() {
      return new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    log(mensagem) {
      const consoleDoJogo = this.buscaComponente("console");
      if (consoleDoJogo) {
        consoleDoJogo.innerHTML += `<p>${mensagem}</p>`;
        consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
      }
    }
  };
  function criarPersonagem(tipo, jogador) {
    const nomes = {
      mago: jogador === 1 ? "Mago Merlin" : "Mago Gandalf",
      cavaleiro: jogador === 1 ? "Cavaleiro Arthur" : "Cavaleiro Morgan",
      dragao: jogador === 1 ? "Drag\xE3o Hr\xE6zlyr" : "Drag\xE3o Shielong"
    };
    switch (tipo) {
      case "mago":
        return new Mago(nomes[tipo], 100, 20, 0);
      case "cavaleiro":
        return new Cavaleiro(nomes[tipo], 100, 20, 0);
      case "dragao":
        return new Dragao(nomes[tipo], 100, 20, 0);
    }
  }
  function lerSelecao(id) {
    const select = document.getElementById(id);
    return select?.value || "mago";
  }
  function atualizarGolpes(numeroDoPlayer, tipo) {
    const carta = document.getElementById(`imgplayer${numeroDoPlayer}`);
    const golpes = textosDosGolpes[tipo];
    carta?.querySelectorAll(".golpe1, .golpe2, .golpe3").forEach((golpe, index) => {
      golpe.textContent = golpes[index];
    });
  }
  function descobrirTipoPersonagem(player) {
    const nome = player.nome.toLowerCase();
    if (nome.includes("drag")) return "dragao";
    if (nome.includes("cavaleiro")) return "cavaleiro";
    return "mago";
  }
  function animarAtaque(numeroDoPlayer, player) {
    const ataque = document.querySelector(`.ataque-p${numeroDoPlayer}`);
    const personagemArena = document.getElementById(`arenaPlayer${numeroDoPlayer}`);
    const tipo = descobrirTipoPersonagem(player);
    if (!ataque) return;
    ataque.className = `ataque ataque-p${numeroDoPlayer} ataque-${tipo}`;
    personagemArena?.classList.remove(`arena-atacando-p${numeroDoPlayer}`);
    void ataque.offsetWidth;
    if (personagemArena) void personagemArena.offsetWidth;
    ataque.classList.add(`atacando-p${numeroDoPlayer}`);
    personagemArena?.classList.add(`arena-atacando-p${numeroDoPlayer}`);
  }
  function partidaEstaAtiva(idDaPartida) {
    return partidaEmAndamento && partidaAtual === idDaPartida;
  }
  function atualizarAtaqueUsado(numeroDoPlayer, ataque) {
    const indicador = document.getElementById(`ataqueUsado${numeroDoPlayer}`);
    if (indicador) {
      indicador.textContent = `P${numeroDoPlayer}: ${ataque}`;
    }
  }
  function limparAtaquesUsados() {
    atualizarAtaqueUsado(1, "aguardando");
    atualizarAtaqueUsado(2, "aguardando");
  }
  async function aguardarRetomada(idDaPartida) {
    while (jogoPausado && partidaEstaAtiva(idDaPartida)) {
      await new Promise((resolve) => {
        resolverRetomada = resolve;
      });
    }
  }
  function retomarJogo() {
    jogoPausado = false;
    resolverRetomada?.();
    resolverRetomada = null;
  }
  function atualizarControles(textoBotao, mostrarReiniciar, desabilitarBotao = false) {
    const botao = document.getElementById("botaojogar");
    const botaoReiniciar = document.getElementById("botaoreiniciar");
    if (botao) {
      botao.textContent = textoBotao;
      botao.disabled = desabilitarBotao;
    }
    if (botaoReiniciar) {
      botaoReiniciar.hidden = !mostrarReiniciar;
    }
  }
  function prepararPrevia() {
    const tipoPlayer1 = lerSelecao("selectPlayer1");
    const tipoPlayer2 = lerSelecao("selectPlayer2");
    const partida = new Jogo();
    const player1 = criarPersonagem(tipoPlayer1, 1);
    const player2 = criarPersonagem(tipoPlayer2, 2);
    atualizarGolpes(1, tipoPlayer1);
    atualizarGolpes(2, tipoPlayer2);
    limparAtaquesUsados();
    partida.atualizarInterface(player1, player2);
  }
  async function construirJogo() {
    const consoleDoJogo = document.getElementById("console");
    const tipoPlayer1 = lerSelecao("selectPlayer1");
    const tipoPlayer2 = lerSelecao("selectPlayer2");
    const player1 = criarPersonagem(tipoPlayer1, 1);
    const player2 = criarPersonagem(tipoPlayer2, 2);
    const partida = new Jogo();
    const idDaPartida = ++partidaAtual;
    partidaEmAndamento = true;
    retomarJogo();
    atualizarControles("Pausar", true);
    if (consoleDoJogo) {
      consoleDoJogo.innerHTML = "<p>Console de jogo</p>";
    }
    atualizarGolpes(1, tipoPlayer1);
    atualizarGolpes(2, tipoPlayer2);
    limparAtaquesUsados();
    await partida.iniciarJogo(player1, player2, idDaPartida);
    if (partidaAtual === idDaPartida) {
      partidaEmAndamento = false;
      retomarJogo();
      atualizarControles("Jogar", false);
    }
  }
  function controlarBotaoPrincipal() {
    if (!partidaEmAndamento) {
      construirJogo();
      return;
    }
    jogoPausado = !jogoPausado;
    atualizarControles(jogoPausado ? "Retomar" : "Pausar", true);
    if (!jogoPausado) retomarJogo();
  }
  function reiniciarJogo() {
    partidaAtual++;
    partidaEmAndamento = false;
    retomarJogo();
    construirJogo();
  }
  document.getElementById("botaojogar")?.addEventListener("click", controlarBotaoPrincipal);
  document.getElementById("botaoreiniciar")?.addEventListener("click", reiniciarJogo);
  document.getElementById("selectPlayer1")?.addEventListener("change", prepararPrevia);
  document.getElementById("selectPlayer2")?.addEventListener("change", prepararPrevia);
  prepararPrevia();
})();
