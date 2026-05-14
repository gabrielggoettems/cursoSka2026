import { Personagem } from "./personagem.ts";

export class Mago extends Personagem {
  private ataques = [
    { dano: 5, habilidade: "Magia fraca de fogo", mensagem: "lançou magia fraca de fogo" },
    { dano: 10, habilidade: "Magia média de gelo", mensagem: "lançou magia média de gelo" },
    { dano: 20, habilidade: "Magia poderosa de raio", mensagem: "lançou magia poderosa de raio" },
  ];

  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 30, "./public/mago.png",);
  }

  public atacar(inimigo: Personagem): string {
    const index = this.gerarAtaque() - 1;
    const ataque = this.ataques[index];

    this.log(`${this.nome} ${ataque.mensagem}.`);
    inimigo.sofrerDano(ataque.dano);

    return ataque.habilidade;
  }
}
