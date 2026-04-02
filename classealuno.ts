export class Aluno {
  readonly Nome: string = "";
  readonly Sobrenome: string = "";
  Idade: number = 0;
  Genero: string = "";
  private Nota: number = 0;

  constructor(
    Nome: string,
    Sobrenome: string,
    Idade: number,
    Genero: string,
    nota: number,
  ) {
    this.Nome = Nome; // inicializa o atributo nome
    this.Sobrenome = Sobrenome; // inicializa o atributo idade
    this.Idade = Idade; // inicializa o atributo nome
    this.Genero = Genero; // inicializa o atributo idade
    this.Nota = nota;
  }

  alterarNota(nota:number){

    if(nota > 10 || nota < 0){

        console.log("ERRO NA NOTA!");
        this.Nota = nota = 0;
        
    
    }else{
    this.Nota = nota;

    }
  }

  buscarNota(){
    return this.Nota;

  }
}
