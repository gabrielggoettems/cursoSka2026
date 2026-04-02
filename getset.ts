 export class  produto {
  private Valor:number = 0;
  private Codigo: number = 0;
  private Descricao: string = "0";

  constructor(Bimbada:number, kakakaka:string, siuuuuu:number) {
    this.Valor = Bimbada;
 this.Descricao = kakakaka;
 this.Codigo = siuuuuu;
 
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
