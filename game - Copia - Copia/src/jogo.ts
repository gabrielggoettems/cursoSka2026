import { Cavaleiro } from "./cavaleiro.ts";
import { Dragao } from "./dragao.ts";
import { Mago } from "./mago.ts";
import { Personagem } from "./personagem.ts";

type TipoPersonagem = "mago" | "cavaleiro" | "dragao";

const textosDosGolpes: Record<TipoPersonagem, string[]> = {
  mago: ["Magia fraca", "Magia média", "Magia poderosa"],
  cavaleiro: ["Ataque fraco", "Ataque médio", "Ataque poderoso"],
  dragao: ["Arranhão fraco", "Mordida média", "Fogo poderoso"],
};

export class Jogo {
  private pausado: boolean = false;
  private cancelado: boolean = false;

  public async iniciarJogo(player1: Personagem, player2: Personagem) {
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
      player1.estaVivo()
        ? `${player1.nome} venceu!`
        : `${player2.nome} venceu!`,
    );
  }

  public pausar(): void {
    this.pausado = true;
  }

  public continuar(): void {
    this.pausado = false;
  }

  public alternarPausa(): boolean {
    this.pausado = !this.pausado;
    return this.pausado;
  }

  public cancelar(): void {
    this.cancelado = true;
    this.pausado = false;
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

  public async esperarTempo() {
    const tempoTotal = 1000;
    const intervalo = 100;
    let tempoPassado = 0;

    while (!this.cancelado && tempoPassado < tempoTotal) {
      await this.esperarSePausado();
      await new Promise((resolve) => setTimeout(resolve, intervalo));
      tempoPassado += intervalo;
    }
  }

  private async esperarSePausado() {
    while (this.pausado && !this.cancelado) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  private log(mensagem: string) {
    const consoleDoJogo = this.buscaComponente<HTMLDivElement>("console");

    if (consoleDoJogo) {
      consoleDoJogo.innerHTML += `<p>${mensagem}</p>`;
      consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
    }
  }
}

let partidaAtual: Jogo | null = null;
let jogoRodando = false;

function criarPersonagem(tipo: TipoPersonagem, jogador: 1 | 2): Personagem {
  const nomes: Record<TipoPersonagem, string> = {
    mago: jogador === 1 ? "Mago Merlin" : "Mago Gandalf",
    cavaleiro: jogador === 1 ? "Cavaleiro Arthur" : "Cavaleiro Morgan",
    dragao: jogador === 1 ? "Dragão Hraezlyr" : "Dragão Shielong",
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

function mostrarHabilidade(numeroDoPlayer: 1 | 2, habilidade: string) {
  const habilidadeAtual = document.getElementById(`habilidade${numeroDoPlayer}`);

  if (habilidadeAtual) {
    habilidadeAtual.textContent = `Usando: ${habilidade}`;
  }
}

function limparHabilidades() {
  mostrarHabilidade(1, "nenhuma");
  mostrarHabilidade(2, "nenhuma");
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
  const botaoJogar = document.getElementById("botaojogar") as HTMLButtonElement | null;
  const botaoPausar = document.getElementById("botaopausar") as HTMLButtonElement | null;

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
  const botaoPausar = document.getElementById("botaopausar") as HTMLButtonElement | null;

  if (!partidaAtual || !jogoRodando) return;

  const pausado = partidaAtual.alternarPausa();

  if (botaoPausar) {
    botaoPausar.textContent = pausado ? "Continuar" : "Pausar";
  }
}

function reiniciarJogo() {
  const botaoPausar = document.getElementById("botaopausar") as HTMLButtonElement | null;

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
