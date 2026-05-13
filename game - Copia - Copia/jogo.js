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
    estaVivo() {
      return this.vida > 0;
    }
    sofrerDano(dano) {
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
    gerarAtaque() {
      const maximoAtaque = 3;
      return Math.floor(Math.random() * maximoAtaque) + 1;
    }
    ataqueLancado() {
      const ataque = this.gerarAtaque();
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
    defesaLancada() {
      const defesa = this.gerarAtaque();
      switch (defesa) {
        case 1:
          return "defesa fraca";
        case 2:
          return "defesa m\xE9dia";
        case 3:
          return "defesa forte";
        default:
          return "erro";
      }
    }
    getVida() {
      return this.vida;
    }
    getImagem() {
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
      this.ataques = [
        { dano: 5, habilidade: "Ataque fraco", mensagem: "deu um ataque fraco" },
        { dano: 10, habilidade: "Ataque m\xE9dio", mensagem: "deu um ataque m\xE9dio" },
        { dano: 20, habilidade: "Ataque poderoso", mensagem: "deu um ataque poderoso" }
      ];
    }
    atacar(inimigo) {
      const index = this.gerarAtaque() - 1;
      const ataque = this.ataques[index];
      this.log(`${this.nome} ${ataque.mensagem} em ${inimigo.nome}.`);
      inimigo.sofrerDano(ataque.dano);
      return ataque.habilidade;
    }
  };

  // src/dragao.ts
  var Dragao = class extends Personagem {
    constructor(nome, vida, forca, defesa) {
      super(nome, vida, forca, defesa, 25, "./public/dragao.png");
      this.ataques = [
        { dano: 5, habilidade: "Arranh\xE3o fraco", mensagem: "arranhou" },
        { dano: 10, habilidade: "Mordida m\xE9dia", mensagem: "mordeu" },
        { dano: 20, habilidade: "Fogo poderoso", mensagem: "cuspiu fogo em" }
      ];
    }
    atacar(inimigo) {
      const index = this.gerarAtaque() - 1;
      const ataque = this.ataques[index];
      this.log(`${this.nome} ${ataque.mensagem} ${inimigo.nome}.`);
      inimigo.sofrerDano(ataque.dano);
      return ataque.habilidade;
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
      this.ataques = [
        { dano: 5, habilidade: "Magia fraca de fogo", mensagem: "lan\xE7ou magia fraca de fogo" },
        { dano: 10, habilidade: "Magia m\xE9dia de gelo", mensagem: "lan\xE7ou magia m\xE9dia de gelo" },
        { dano: 20, habilidade: "Magia poderosa de raio", mensagem: "lan\xE7ou magia poderosa de raio" }
      ];
    }
    atacar(inimigo) {
      const index = this.gerarAtaque() - 1;
      const ataque = this.ataques[index];
      this.log(`${this.nome} ${ataque.mensagem}.`);
      inimigo.sofrerDano(ataque.dano);
      return ataque.habilidade;
    }
  };

  // src/jogo.ts
  var textosDosGolpes = {
    mago: ["Magia fraca", "Magia m\xE9dia", "Magia poderosa"],
    cavaleiro: ["Ataque fraco", "Ataque m\xE9dio", "Ataque poderoso"],
    dragao: ["Arranh\xE3o fraco", "Mordida m\xE9dia", "Fogo poderoso"]
  };
  var Jogo = class {
    constructor() {
      this.pausado = false;
      this.cancelado = false;
    }
    async iniciarJogo(player1, player2) {
      let turno = 1;
      this.log(`Partida iniciada: ${player1.nome} VS ${player2.nome}`);
      this.atualizarInterface(player1, player2);
      limparHabilidades();
      while (!this.cancelado && player1.estaVivo() && player2.estaVivo()) {
        await this.esperarSePausado();
        if (this.cancelado) break;
        this.log(`Round ${turno}`);
        const habilidadePlayer1 = player1.atacar(player2);
        mostrarHabilidade(1, habilidadePlayer1);
        mostrarHabilidade(2, "Aguardando...");
        animarAtaque(1, player1);
        this.atualizarInterface(player1, player2);
        await this.esperarTempo();
        if (this.cancelado || !player2.estaVivo()) break;
        await this.esperarSePausado();
        if (this.cancelado) break;
        const habilidadePlayer2 = player2.atacar(player1);
        mostrarHabilidade(2, habilidadePlayer2);
        mostrarHabilidade(1, "Aguardando...");
        animarAtaque(2, player2);
        this.atualizarInterface(player1, player2);
        await this.esperarTempo();
        turno++;
      }
      if (this.cancelado) {
        return;
      }
      limparHabilidades();
      this.log(
        player1.estaVivo() ? `${player1.nome} venceu!` : `${player2.nome} venceu!`
      );
    }
    pausar() {
      this.pausado = true;
    }
    continuar() {
      this.pausado = false;
    }
    alternarPausa() {
      this.pausado = !this.pausado;
      return this.pausado;
    }
    cancelar() {
      this.cancelado = true;
      this.pausado = false;
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
      if (imagem) {
        imagem.src = player.getImagem();
      }
      if (imagemArena) {
        imagemArena.src = player.getImagem();
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
      const tempoTotal = 1e3;
      const intervalo = 100;
      let tempoPassado = 0;
      while (!this.cancelado && tempoPassado < tempoTotal) {
        await this.esperarSePausado();
        await new Promise((resolve) => setTimeout(resolve, intervalo));
        tempoPassado += intervalo;
      }
    }
    async esperarSePausado() {
      while (this.pausado && !this.cancelado) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    log(mensagem) {
      const consoleDoJogo = this.buscaComponente("console");
      if (consoleDoJogo) {
        consoleDoJogo.innerHTML += `<p>${mensagem}</p>`;
        consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
      }
    }
  };
  var partidaAtual = null;
  var jogoRodando = false;
  function criarPersonagem(tipo, jogador) {
    const nomes = {
      mago: jogador === 1 ? "Mago Merlin" : "Mago Gandalf",
      cavaleiro: jogador === 1 ? "Cavaleiro Arthur" : "Cavaleiro Morgan",
      dragao: jogador === 1 ? "Drag\xE3o Hraezlyr" : "Drag\xE3o Shielong"
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
  function mostrarHabilidade(numeroDoPlayer, habilidade) {
    const habilidadeAtual = document.getElementById(`habilidade${numeroDoPlayer}`);
    if (habilidadeAtual) {
      habilidadeAtual.textContent = `Usando: ${habilidade}`;
    }
  }
  function limparHabilidades() {
    mostrarHabilidade(1, "nenhuma");
    mostrarHabilidade(2, "nenhuma");
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
  function prepararPrevia() {
    const tipoPlayer1 = lerSelecao("selectPlayer1");
    const tipoPlayer2 = lerSelecao("selectPlayer2");
    const partida = new Jogo();
    const player1 = criarPersonagem(tipoPlayer1, 1);
    const player2 = criarPersonagem(tipoPlayer2, 2);
    atualizarGolpes(1, tipoPlayer1);
    atualizarGolpes(2, tipoPlayer2);
    partida.atualizarInterface(player1, player2);
    limparHabilidades();
  }
  function limparConsole() {
    const consoleDoJogo = document.getElementById("console");
    if (consoleDoJogo) {
      consoleDoJogo.innerHTML = "<p>Console de jogo</p>";
    }
  }
  function atualizarBotoes() {
    const botaoJogar = document.getElementById("botaojogar");
    const botaoPausar = document.getElementById("botaopausar");
    if (botaoJogar) {
      botaoJogar.disabled = jogoRodando;
    }
    if (botaoPausar) {
      botaoPausar.disabled = !jogoRodando;
    }
  }
  async function construirJogo() {
    const tipoPlayer1 = lerSelecao("selectPlayer1");
    const tipoPlayer2 = lerSelecao("selectPlayer2");
    const player1 = criarPersonagem(tipoPlayer1, 1);
    const player2 = criarPersonagem(tipoPlayer2, 2);
    const partida = new Jogo();
    partidaAtual?.cancelar();
    partidaAtual = partida;
    jogoRodando = true;
    atualizarBotoes();
    limparConsole();
    limparHabilidades();
    atualizarGolpes(1, tipoPlayer1);
    atualizarGolpes(2, tipoPlayer2);
    await partida.iniciarJogo(player1, player2);
    if (partidaAtual === partida) {
      jogoRodando = false;
      partidaAtual = null;
      atualizarBotoes();
    }
  }
  function pausarJogo() {
    const botaoPausar = document.getElementById("botaopausar");
    if (!partidaAtual || !jogoRodando) return;
    const pausado = partidaAtual.alternarPausa();
    if (botaoPausar) {
      botaoPausar.textContent = pausado ? "Continuar" : "Pausar";
    }
  }
  function reiniciarJogo() {
    const botaoPausar = document.getElementById("botaopausar");
    partidaAtual?.cancelar();
    partidaAtual = null;
    jogoRodando = false;
    if (botaoPausar) {
      botaoPausar.textContent = "Pausar";
    }
    limparConsole();
    prepararPrevia();
    atualizarBotoes();
  }
  document.getElementById("botaojogar")?.addEventListener("click", construirJogo);
  document.getElementById("botaopausar")?.addEventListener("click", pausarJogo);
  document.getElementById("botaoreiniciar")?.addEventListener("click", reiniciarJogo);
  document.getElementById("selectPlayer1")?.addEventListener("change", reiniciarJogo);
  document.getElementById("selectPlayer2")?.addEventListener("change", reiniciarJogo);
  prepararPrevia();
  atualizarBotoes();
})();
