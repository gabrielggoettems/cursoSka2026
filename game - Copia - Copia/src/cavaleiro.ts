import { Personagem } from "./personagem.ts";

export class Cavaleiro extends Personagem {
  private ataques = [
    { dano: 5, habilidade: "Ataque fraco", mensagem: "deu um ataque fraco" },
    { dano: 10, habilidade: "Ataque médio", mensagem: "deu um ataque médio" },
    { dano: 20, habilidade: "Ataque poderoso", mensagem: "deu um ataque poderoso" },
  ];

  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 30, "./public/cavaleiro.png");
  }

  public atacar(inimigo: Personagem): string {
    const index = this.gerarAtaque() - 1;
    const ataque = this.ataques[index];

    this.log(`${this.nome} ${ataque.mensagem} em ${inimigo.nome}.`);
    inimigo.sofrerDano(ataque.dano);

    return ataque.habilidade;
  }
}
