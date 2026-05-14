import { Personagem } from "./personagem.ts";

export class Cavaleiro extends Personagem {
  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(
      nome,
      vida,
      forca,
      defesa,
      30,
      "./public/cavaleiro.png",
    );
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
    this.log(`${this.nome} deu um ataque fraco em ${inimigo.nome}.`);
    inimigo.SofrerDano(5);
  }

  ataqueCavaleiro2(inimigo: Personagem): void {
    this.log(`${this.nome} deu um ataque medio em ${inimigo.nome}.`);
    inimigo.SofrerDano(10);
  }

  ataqueCavaleiro3(inimigo: Personagem): void {
    this.log(`${this.nome} deu um ataque poderoso em ${inimigo.nome}.`);
    inimigo.SofrerDano(20);
  }
}
