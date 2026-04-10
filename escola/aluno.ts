import { Aluno } from "../classealuno.ts";

 const student = new  Aluno  ("Cuca","Beludo",12,"Masculino",10); 
 student.alterarNota(12);

 console.log("Nome = " + student.Nome,"\nSobrenome = " + student.Sobrenome,"\nIdade = " + student.Idade,"\nGenero = " + student.Genero, "\nNota = " + student.buscarNota());

