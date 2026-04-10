import { Personagem } from "./personagem.ts";

export class Mago extends Personagem {
  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 30);
  }

  public atacar(inimigo: Personagem): void {
    const ataque = this.gerarataque();

    switch (ataque) {
      case 1:
        console.log(`${this.nome} lançou magia fraca de fogo`);
        inimigo.SofrerDano(this.forca = 15);
        break;

      case 2:
        console.log(`${this.nome} lançou magia média de gelo`);
        inimigo.SofrerDano(this.forca = 20);
        break;

      case 3:
        console.log(`${this.nome} lançou magia poderosa de raio`);
        inimigo.SofrerDano(this.forca = 30);
        break;
    }
  }
}
