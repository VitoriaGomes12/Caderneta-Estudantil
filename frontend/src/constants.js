export const TIPOS = [
  'Atraso',
  'Falta',
  'Falta de material',
  'Indisciplina',
  'Conflito',
  'Elogio',
  'Outro',
];

export const GRAVIDADES = [
  { valor: 'leve', rotulo: 'Leve', classe: 'bg-success' },
  { valor: 'media', rotulo: 'Média', classe: 'bg-warning text-dark' },
  { valor: 'grave', rotulo: 'Grave', classe: 'bg-danger' },
];

export function dadosGravidade(valor) {
  return GRAVIDADES.find((g) => g.valor === valor) || GRAVIDADES[0];
}

// 2026-10-27 -> 27/10/2026
export function formatarData(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}