
import { Carro } from "../types/carro";

const fotoCivic = require('../../assets/imagens/Civic.webp');
const fotoCruze = require('../../assets/imagens/Cruze.jpg');
const fotoOnix = require('../../assets/imagens/Onix.jpg');
const fotoF40 = require('../../assets/imagens/F40.jpg');



export const carros: Carro[] = [
  {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2024,
    consumoCidade: 12,
    consumoEstrada: 15,
    tipoCombustivel: 'Flex',
    tipoMotor: 'Em linha',
    potencia: 137,
    velocidadeMaxima: 220,
    cor: 'Branco',
    foto : 'fotoCorolla',
  },
  {
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2022,
    consumoCidade: 10,
    consumoEstrada: 14,
    tipoCombustivel: 'Flex',
    tipoMotor: 'Em linha',
    potencia: 150,
    velocidadeMaxima: 220,
    cor: 'Branco',
    foto: fotoCivic,
  },
  {
    marca: 'Chevrolet',
    modelo: 'Cruze',
    ano: 2017,
    consumoCidade: 11,
    consumoEstrada: 14,
    tipoCombustivel: 'Flex',
    tipoMotor: 'Em linha',
    potencia: 137,
    velocidadeMaxima: 220,
    cor: 'Branco',
    foto: fotoCruze,
  },
  {
    marca: 'Chevrolet',
    modelo: 'Onix',
    ano: 2020,
    consumoCidade: 12,
    consumoEstrada: 14,
    tipoCombustivel: 'Flex',
    tipoMotor: 'Em linha',
    potencia: 117,
    velocidadeMaxima: 220,
    cor: 'Azul',
    foto: fotoOnix,
  },
  {
    marca: 'Ferrari',
    modelo: 'F40',
    ano: 1987,
    cor: 'Vermelho',
    foto: fotoF40,
    consumoCidade: 3,
    consumoEstrada: 5,
    tipoCombustivel: 'Gasolina',
    tipoMotor: 'Em V',
    potencia: 478,
    velocidadeMaxima: 324,
  },

];

