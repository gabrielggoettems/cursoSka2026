import { Personagem } from "./personagem.ts";

export class Dragao extends Personagem {
  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 25, "./public/dragao.png");
  }

  public atacar(inimigo: Personagem): void {
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

  ataqueDragao1(inimigo: Personagem): void {
    this.log(`${this.nome} arranhou ${inimigo.nome}.`);
    inimigo.SofrerDano(5);
  }

  ataqueDragao2(inimigo: Personagem): void {
    this.log(`${this.nome} mordeu ${inimigo.nome}.`);
    inimigo.SofrerDano(10);
  }

  ataqueDragao3(inimigo: Personagem): void {
    this.log(`${this.nome} cuspiu fogo em ${inimigo.nome}.`);
    inimigo.SofrerDano(20);
  }
}
