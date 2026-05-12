export abstract class Personagem {
  public nome: string = "personagem";
  protected vida: number = 0;
  protected forca: number = 0;
  protected defesa: number = 0;
  protected cura: number = 0;
  protected imagem: string = "";
  protected ultimoAtaque: string = "aguardando";

  private jaUsouCura: boolean = false;

  constructor(
    nome: string,
    vida: number,
    forca: number,
    defesa: number,
    cura: number,
    imagemDoPersonagem: string,
  ) {
    this.nome = nome;
    this.vida = vida;
    this.forca = forca;
    this.defesa = defesa;
    this.cura = cura;
    this.imagem = imagemDoPersonagem;
  }

  public log(mensagem: string) {
    const consoleDoJogo = document.getElementById("console");

    if (consoleDoJogo) {
      consoleDoJogo.innerHTML += "<p>" + mensagem + "</p>";
      consoleDoJogo.scrollTop = consoleDoJogo.scrollHeight;
    }
  }

  iscontinuavivo(): boolean {
    return this.vida > 0;
  }
  SofrerDano(dano: number): void {
    const danoReduzido = Math.round(dano * (1 - this.defesa / 100));

    this.vida = this.vida - danoReduzido;

    if (this.vida < 0) {
      this.vida = 0;
    }

    this.log(
      `${this.nome} tomou ${danoReduzido} de dano e agora tem ${this.vida} de vida.`,
    );

    this.usarCura();

    if (this.vida === 0) {
      this.log(`${this.nome} foi derrotado!`);
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

  protected registrarAtaque(ataque: string): void {
    this.ultimoAtaque = ataque;
  }

  getUltimoAtaque() {
    return this.ultimoAtaque;
  }

  getVida() {
    return this.vida;
  }

  getImgem() {
    return this.imagem;
  }

  usarCura(): void {
    if (this.vida < 50 && !this.jaUsouCura) {
      this.vida = this.vida + this.cura;

      if (this.vida > 100) {
        this.vida = 100;
      }

      this.jaUsouCura = true;
      this.log(`${this.nome} usou a cura e recuperou ${this.cura} de vida!`);
    }
  }
}
