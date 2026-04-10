import { Personagem } from "./personagem.ts";

export class Jogo {
  public iniciarJogo(player1: Personagem, player2: Personagem): void {
    console.log(`${player1.nome} vs ${player2.nome}`);

    let turno = 1;

    while (player1.iscontinuavivo() && player2.iscontinuavivo()) {
      console.log(`\n============= ROUND ${turno} =============\n`);

      player1.atacar(player2);

      if (!player2.iscontinuavivo()) break;

      player2.atacar(player1);

      turno++;
    }

    if (player1.iscontinuavivo()) {
      console.log(`${player1.nome} venceu!`);
    } else {
      console.log(`${player2.nome} venceu!`);
    }
  }
}
