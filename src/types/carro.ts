export interface Carro {
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    foto?: string | number | null;
    
    consumoCidade: number;
    consumoEstrada: number;

    tipoCombustivel: 'Gasolina' | 'Flex' | 'Disel' | 'Hibrido' | 'Eletrico';
    tipoMotor: 'Em linha' | 'Em V' | 'Boxer' | 'Rotativo';

    potencia: number;

    velocidadeMaxima: number;

} 