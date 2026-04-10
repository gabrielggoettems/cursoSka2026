 export class Veiculo {

    public    marca: string;
    protected Velocidade: number = 0;
   
  constructor(marca:string, velocidade: number){
    this.marca = marca;
    this.Velocidade = velocidade;
  }

  acelerar(velocidade: number){
    this.Velocidade += velocidade;
  }

  exibir() {
   console.log("marca" + this.marca + " " + this.Velocidade + "km/h");
  }
}