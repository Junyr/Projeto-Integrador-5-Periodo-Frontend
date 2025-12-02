import {Bairro} from './Bairro';

export interface Rua {
  id?: number;
  origem: Bairro;
  destino: Bairro;
  distanciaKm: number;
}
