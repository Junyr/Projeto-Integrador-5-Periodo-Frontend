export interface Rota {
  id?: number;
  caminhaoId: number;
  bairros: number[];
  ruas: number[];
  tiposResiduos: number[];
  distanciaTotal: number;
}
