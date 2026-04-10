import { Cavaleiro } from "./cavaleiro.ts";
import { Mago } from "./mago.ts";
import { Jogo } from "./jogo.ts";

const mago: Mago = new Mago("Merlin", 200, 120, 0);
const cavaleiro: Cavaleiro = new Cavaleiro("Arthur", 300, 90, 0);

const partida: Jogo = new Jogo();

partida.iniciarJogo(mago, cavaleiro);
