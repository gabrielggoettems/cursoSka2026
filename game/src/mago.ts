import { Personagem } from "./personagem.ts";

export class Mago extends Personagem {
  constructor(nome: string, vida: number, forca: number, defesa: number) {
    super(
      nome,
      vida,
      forca,
      defesa,
      30,
      "https://i.pinimg.com/originals/ec/45/80/ec4580d525dfafcd8c22a5a8f4d26033.png",
    );
  }

  public atacar(inimigo: Personagem): void {
    const ataque = this.gerarataque();

    switch (ataque) {
      case 1:
        this.registrarAtaque("Magia fraca");
        this.log(`${this.nome} lancou magia fraca de fogo.`);
        inimigo.SofrerDano(5);
        break;

      case 2:
        this.registrarAtaque("Magia media");
        this.log(`${this.nome} lancou magia media de gelo.`);
        inimigo.SofrerDano(10);
        break;

      case 3:
        this.registrarAtaque("Magia poderosa");
        this.log(`${this.nome} lancou magia poderosa de raio.`);
        inimigo.SofrerDano(20);
        break;
    }
  }
}
