import { Funcionario } from "./classefuncionario.ts";

export class Gerente extends Funcionario {
  public cargo: string = "gerente";

  constructor(cargo: string, nome: string, salario: number) {
    super(nome, salario);
    this.cargo = cargo;
  }

   ferias(dias:number): string {
    if(dias>40) { 
    return "erro,dias invalidos";
    }
    return "ferias";
   }

   ganharAumento(aumento: number): number {

    this.salario += aumento;
    return this.salario;       
   }

  mandarAlgueM() {
    console.log("quero um relatorio ate o fim do dia");
  }

  override falar(){

    console.log("Meu salario é maior");
  }

  }
  


