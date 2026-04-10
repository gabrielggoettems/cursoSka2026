export class calculadora {
  A: number = 16;
  B: number = 10;

  resultado: number = 0;

  exibirResultado() {
    console.log("Resultado é " + this.resultado);
  }

  soma(valorA: number, valorB: number) {
    this.resultado = valorA + valorB;
  }

  multiplicacao(valorA: number, valorB: number) {
    this.resultado = valorA * valorB;
  }

  subtracao(valorA: number, valorB: number) {
    this.resultado = valorA - valorB;
  }

  divisao(valorA: number, valorB: number) {
    this.resultado = valorA / valorB;
  }
}
