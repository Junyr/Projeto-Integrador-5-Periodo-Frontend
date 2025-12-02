export interface PontoColeta {
  id?: number;
  nome: string;
  responsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  endereco: string;
  horario: string;
  bairroId: number;
  tiposResiduos: number[];
}
