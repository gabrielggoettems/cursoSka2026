export abstract class Personagem {
  public nome: string = "persongem";
  protected vida: number = 0;
  protected forca: number = 0;
  protected defesa: number = 0;
  protected cura: number = 0;

  private jaUsouCura: boolean = false;

  constructor(
    nome: string,
    vida: number,
    forca: number,
    defesa: number,
    cura: number,
  ) {
    this.nome = nome;
    this.vida = vida;
    this.forca = forca;
    this.defesa = defesa;
    this.cura = cura;
  }

  iscontinuavivo(): boolean {
    //is true or false
    return this.vida > 0;
  }
  SofrerDano(dano: number): void {
    const danoReduzido = dano * (1 -this.defesa / 100);

    this.vida = this.vida - danoReduzido;
    

    if (this.vida < 0) {
      this.vida = 0;  
    }

    console.log(
      `${this.nome} tomou ${danoReduzido} de dano e agora tem ${this.vida} de vida.`,
    );

    this.usarCura();

    if (this.vida === 0) {
  
    }
  }

  gerarataque(): number {
    let maximoAtk = 3;

    return Math.floor(Math.random() * maximoAtk) + 1;
  }

  ataqueLancado(): string {
    const ataque = this.gerarataque();

    switch (ataque) {
      case 1:
        return "ataque fraco";
      case 2:
        return "ataque médio";
      case 3:
        return "ataque forte";
      default:
        return "erro";
    }
  }

  public abstract atacar(inimigo: Personagem): void;

  defesaLancada(): string {
    const defesa = this.gerarataque();
    switch (defesa) {
      case 1:
        return "defesa fraca";
      case 2:
        return "defesa média";
      case 3:
        return "defesa forte";
      default:
        return "erro";
    }
  }

  usarCura(): void {
    if (this.vida < 50 && !this.jaUsouCura) {
      this.vida = this.vida + this.cura;
      this.jaUsouCura = true;
      console.log(`${this.nome} usou a cura e recuperou ${this.cura} de vida!`);
    }
  }
}
