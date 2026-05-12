import { Cavaleiro } from "./cavaleiro.ts";
import { Dragao } from "./dragao.ts";
import { Mago } from "./mago.ts";
import { Personagem } from "./personagem.ts";

type TipoPersonagem = "mago" | "cavaleiro" | "dragao";

let partidaAtual = 0;
let partidaEmAndamento = false;
let jogoPausado = false;
let resolverRetomada: (() => void) | null = null;

const textosDosGolpes: Record<TipoPersonagem, string[]> = {
  mago: ["Magia fraca", "Magia media", "Magia poderosa"],
  cavaleiro: ["Ataque fraco", "Ataque medio", "Ataque poderoso"],
  dragao: ["Arranhao fraco", "Mordida media", "Fogo poderoso"],
};

export class Jogo {
  public async iniciarJogo(player1: Personagem, player2: Personagem, idDaPartida: number) {
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
        player1.iscontinuavivo()
          ? `${player1.nome} venceu!`
          : `${player2.nome} venceu!`,
      );
    }
  }

  buscaComponente<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T | null;
  }

  public atualizarInterface(player1: Personagem, player2: Personagem) {
    this.atualizarCarta(1, player1);
    this.atualizarCarta(2, player2);
  }

  private atualizarCarta(numeroDoPlayer: 1 | 2, player: Personagem) {
    const carta = this.buscaComponente<HTMLDivElement>(`imgplayer${numeroDoPlayer}`);
    const imagem = carta?.querySelector("img");
    const imagemArena = this.buscaComponente<HTMLImageElement>(`arenaPlayer${numeroDoPlayer}`);
    const vida = this.buscaComponente<HTMLDivElement>(`vida${numeroDoPlayer}`);
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

  public async esperarTempo() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private log(mensagem: string) {
    const consoleDoJogo = this.buscaComponente<HTMLDivElement>("console");

    if (consoleDoJogo) {
      consoleDoJogo.innerHTML += `<p>${mensagem}</p>`;
      consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
    }
  }
}

function criarPersonagem(tipo: TipoPersonagem, jogador: 1 | 2): Personagem {
  const nomes: Record<TipoPersonagem, string> = {
    mago: jogador === 1 ? "Mago Merlin" : "Mago Gandalf",
    cavaleiro: jogador === 1 ? "Cavaleiro Arthur" : "Cavaleiro Morgan",
    dragao: jogador === 1 ? "Dragão Hræzlyr" : "Dragão Shielong",
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

function lerSelecao(id: string): TipoPersonagem {
  const select = document.getElementById(id) as HTMLSelectElement | null;
  return (select?.value || "mago") as TipoPersonagem;
}

function atualizarGolpes(numeroDoPlayer: 1 | 2, tipo: TipoPersonagem) {
  const carta = document.getElementById(`imgplayer${numeroDoPlayer}`);
  const golpes = textosDosGolpes[tipo];

  carta?.querySelectorAll(".golpe1, .golpe2, .golpe3").forEach((golpe, index) => {
    golpe.textContent = golpes[index];
  });
}

function descobrirTipoPersonagem(player: Personagem): TipoPersonagem {
  const nome = player.nome.toLowerCase();

  if (nome.includes("drag")) return "dragao";
  if (nome.includes("cavaleiro")) return "cavaleiro";
  return "mago";
}

function animarAtaque(numeroDoPlayer: 1 | 2, player: Personagem) {
  const ataque = document.querySelector<HTMLDivElement>(`.ataque-p${numeroDoPlayer}`);
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

function partidaEstaAtiva(idDaPartida: number) {
  return partidaEmAndamento && partidaAtual === idDaPartida;
}

function atualizarAtaqueUsado(numeroDoPlayer: 1 | 2, ataque: string) {
  const indicador = document.getElementById(`ataqueUsado${numeroDoPlayer}`);

  if (indicador) {
    indicador.textContent = `P${numeroDoPlayer}: ${ataque}`;
  }
}

function limparAtaquesUsados() {
  atualizarAtaqueUsado(1, "aguardando");
  atualizarAtaqueUsado(2, "aguardando");
}

async function aguardarRetomada(idDaPartida: number) {
  while (jogoPausado && partidaEstaAtiva(idDaPartida)) {
    await new Promise<void>((resolve) => {
      resolverRetomada = resolve;
    });
  }
}

function retomarJogo() {
  jogoPausado = false;
  resolverRetomada?.();
  resolverRetomada = null;
}

function atualizarControles(textoBotao: string, mostrarReiniciar: boolean, desabilitarBotao = false) {
  const botao = document.getElementById("botaojogar") as HTMLButtonElement | null;
  const botaoReiniciar = document.getElementById("botaoreiniciar") as HTMLButtonElement | null;

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
