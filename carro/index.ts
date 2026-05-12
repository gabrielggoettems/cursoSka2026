import { Gerente } from "./classeGerente.ts";

const g = new Gerente("gerente", "Ana", 5000);

console.log(g.getSalario()); // 5000

g.ganharAumento(1000);

console.log(g.getSalario()); // 6000