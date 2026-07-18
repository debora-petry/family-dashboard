export interface InmetAlert {
  id: number;
  id_aviso: number;
  id_condicao_severa: number;
  id_icone: number;

  codigo: string;
  referencia: string;

  data_inicio: string;
  data_fim: string;
  hora_inicio: string;
  hora_fim: string;

  //poligono: string;

  municipios: string;
  microrregioes: string;
  mesorregioes: string;
  estados: string;
  regioes: string;
  geocodes: string;

  descricao: string;

  aviso_cor: string;

  id_severidade: number;
  severidade: string;

  riscos: string[];
  //instrucoes: string[];
}

export interface InmetResponse {
  hoje: InmetAlert[];
  futuro?: InmetAlert[];
}
