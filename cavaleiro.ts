import { Personagem } from "./personagem.ts";

export class Cavaleiro extends Personagem {
  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(nome, vida, forca, defesa, 30);
  }

  public atacar(inimigo: Personagem): void {
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

  ataqueCavaleiro1(inimigo: Personagem): void {
    console.log(`${this.nome} deu um corte rápido em ${inimigo.nome}`);
    inimigo.SofrerDano(this.forca = 15); // fraco
  }

  ataqueCavaleiro2(inimigo: Personagem): void {
    console.log(`${this.nome} golpeou ${inimigo.nome}`);
    inimigo.SofrerDano(this.forca = 20); // normal
  }

  ataqueCavaleiro3(inimigo: Personagem): void {
    console.log(`${this.nome} deu um ataque pesado em ${inimigo.nome}`);
    inimigo.SofrerDano(this.forca = 30); // forte
  }
}