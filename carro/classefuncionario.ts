export abstract class Funcionario {
  public nome: string = "";
  protected salario: number = 0;

  constructor(nome: string, salario: number) {
    this.nome = nome;
    this.salario = salario;
  }

   abstract ferias(dias:number):string;

    abstract ganharAumento(aumento:number):number;

  getSalario() {
    return this.salario;
  }

  setSalario(salario: number) {
    this.salario = salario;
  }

  falar() {
    console.log("Ola sou " + this.nome, "Meu salario é" + this.salario);
  }

 
}
