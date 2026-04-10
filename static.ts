import { Contador } from "./classestatic.ts";

const a = new Contador("Alice");
const b = new Contador("Bob");

console.log(Contador.total);   // 2 
console.log(a.nome);    
