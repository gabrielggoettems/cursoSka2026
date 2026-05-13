import { Personagem } from "./personagem.ts";

export class Dragao extends Personagem {
  private ataques = [
    { dano: 5, habilidade: "Arranhão fraco", mensagem: "arranhou" },
    { dano: 10, habilidade: "Mordida média", mensagem: "mordeu" },
    { dano: 20, habilidade: "Fogo poderoso", mensagem: "cuspiu fogo em" },
  ];

  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 25, "./public/dragao.png");
  }

  public atacar(inimigo: Personagem): string {
    const index = this.gerarAtaque() - 1;
    const ataque = this.ataques[index];

    this.log(`${this.nome} ${ataque.mensagem} ${inimigo.nome}.`);
    inimigo.sofrerDano(ataque.dano);

    return ataque.habilidade;
  }
}
