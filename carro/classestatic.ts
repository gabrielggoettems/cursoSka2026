
export class Contador {
  static total: number = 0;  // pertence à classe
  public nome: string;      // pertence à instância

  constructor(nome: string) {
    this.nome = nome;
    Contador.total++;         // acessa via nome da classe
  }

  static resetar(): void {
    Contador.total = 0;
  }
}
