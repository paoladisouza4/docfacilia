// ══════════════════════════════════════════════════════════════
//  documents/registry.js
//  Registry central — único arquivo que conhece todos os módulos.
//
//  PAPEL: apenas catalogar e carregar.
//  Não contém lógica de geração, templates ou formulários.
//
//  Para adicionar um novo documento:
//    1. Criar src/documents/MEU_DOC/{meta.js, form.jsx, builder.js, index.js}
//    2. Adicionar uma linha aqui
//    3. Pronto. Nada mais muda no sistema.
// ══════════════════════════════════════════════════════════════

// ── Imports estáticos de meta (leves, apenas metadados) ──────
import * as servico         from './servico/index.js'
import * as freelancer      from './freelancer/index.js'
import * as trabalho_pj     from './trabalho_pj/index.js'
import * as autonomo        from './autonomo/index.js'
import * as compravenda     from './compravenda/index.js'
import * as parceria        from './parceria/index.js'
import * as plano_parceria  from './plano_parceria/index.js'
import * as comissao        from './comissao/index.js'
import * as nda             from './nda/index.js'
import * as influenciador   from './influenciador/index.js'
import * as aluguel_res     from './aluguel_res/index.js'
import * as aluguel_com     from './aluguel_com/index.js'
import * as locacao_simples from './locacao_simples/index.js'
import * as locacao_fiador  from './locacao_fiador/index.js'
import * as recibo_aluguel  from './recibo_aluguel/index.js'
import * as vistoria        from './vistoria/index.js'
import * as notif_desocupacao from './notif_desocupacao/index.js'
import * as acordo_inadimpl from './acordo_inadimpl/index.js'
import * as estagio         from './estagio/index.js'
import * as curriculo       from './curriculo/index.js'
import * as carta_apres     from './carta_apres/index.js'
import * as carta_demissao  from './carta_demissao/index.js'
import * as decl_experiencia from './decl_experiencia/index.js'
import * as decl_residencia  from './decl_residencia/index.js'
import * as decl_renda       from './decl_renda/index.js'
import * as decl_informal    from './decl_informal/index.js'
import * as decl_comparec    from './decl_comparec/index.js'
import * as decl_respons     from './decl_respons/index.js'
import * as decl_uniao       from './decl_uniao/index.js'
import * as recibo           from './recibo/index.js'
import * as quitacao         from './quitacao/index.js'
import * as confissao_divida from './confissao_divida/index.js'
import * as parcelamento     from './parcelamento/index.js'
import * as nota_servico     from './nota_servico/index.js'
import * as lgpd_termo       from './lgpd_termo/index.js'
import * as politica_priv    from './politica_priv/index.js'
import * as termo_uso        from './termo_uso/index.js'
import * as notif_extra      from './notif_extra/index.js'
import * as acordo_amigavel  from './acordo_amigavel/index.js'
import * as abertura_empresa from './abertura_empresa/index.js'
import * as contrato_social  from './contrato_social/index.js'
import * as acordo_socios    from './acordo_socios/index.js'
import * as termo_invest     from './termo_invest/index.js'

// ── Mapa interno ─────────────────────────────────────────────
const ALL = [
  servico, freelancer, trabalho_pj, autonomo, compravenda,
  parceria, plano_parceria, comissao, nda, influenciador,
  aluguel_res, aluguel_com, locacao_simples, locacao_fiador, recibo_aluguel,
  vistoria, notif_desocupacao, acordo_inadimpl,
  estagio, curriculo, carta_apres, carta_demissao, decl_experiencia,
  decl_residencia, decl_renda, decl_informal, decl_comparec, decl_respons, decl_uniao,
  recibo, quitacao, confissao_divida, parcelamento, nota_servico,
  lgpd_termo, politica_priv, termo_uso, notif_extra, acordo_amigavel,
  abertura_empresa, contrato_social, acordo_socios, termo_invest,
]

// Constrói mapa id → módulo
const MAP = Object.fromEntries(ALL.map(m => [m.meta.id, m]))

// ── API pública ───────────────────────────────────────────────

/** Retorna o módulo completo pelo id */
export function getModule(id) {
  return MAP[id] || null
}

/** Retorna apenas os metadados de um tipo */
export function getMeta(id) {
  return MAP[id]?.meta || null
}

/** Retorna todos os módulos de uma categoria */
export function getByCategory(category) {
  return ALL.filter(m => m.meta.category === category)
}

/** Retorna todos os módulos */
export function getAll() {
  return ALL
}

/** Gera o HTML de um documento a partir dos dados do formulário */
export function buildDocument(id, data) {
  const mod = MAP[id]
  if (!mod) throw new Error(`Módulo não encontrado: ${id}`)
  return mod.build(data)
}

/** Lista de categorias com seus documentos */
export const CATEGORIES = {
  contratos:   { label:'📜 Contratos',   emoji:'📜' },
  imobiliario: { label:'🏠 Imobiliário', emoji:'🏠' },
  trabalho:    { label:'💼 Trabalho',    emoji:'💼' },
  declaracoes: { label:'🧍 Declarações', emoji:'🧍' },
  financeiro:  { label:'💰 Financeiro',  emoji:'💰' },
  juridico:    { label:'⚖️ Jurídico',    emoji:'⚖️' },
  empresarial: { label:'🏢 Empresarial', emoji:'🏢' },
}

/** Cláusulas extras opcionais (step 5) */
export const OPTIONAL_CLAUSES = [
  { id:'lgpd',          name:'LGPD — Proteção de Dados',      desc:'Conformidade com Lei 13.709/2018' },
  { id:'exclusividade', name:'Exclusividade',                 desc:'Vedação de serviços a concorrentes' },
  { id:'propriedade',   name:'Propriedade Intelectual',       desc:'Titularidade de obras e criações' },
  { id:'sigilo',        name:'Sigilo e Confidencialidade',    desc:'Obrigação de sigilo das informações' },
  { id:'subcontratacao',name:'Vedação de Subcontratação',     desc:'Proibição de subcontratar sem anuência' },
  { id:'reembolso',     name:'Reembolso de Despesas',         desc:'Cobertura de despesas operacionais' },
  { id:'garantia',      name:'Garantia de Execução',          desc:'Garantia de qualidade e prazo' },
  { id:'forca_maior',   name:'Força Maior',                   desc:'Isenção por eventos imprevisíveis' },
  { id:'antisuborno',   name:'Anticorrupção',                 desc:'Conformidade com Lei 12.846/2013' },
  { id:'resolucao',     name:'Resolução Antecipada',          desc:'Encerramento antecipado por mútuo acordo' },
  { id:'penalidade',    name:'Penalidade por Descumprimento', desc:'Sanções em caso de inadimplemento' },
]

const _R = (n) => {
  const map = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',
    11:'XI',12:'XII',13:'XIII',14:'XIV',15:'XV',16:'XVI',17:'XVII',18:'XVIII',19:'XIX',20:'XX'}
  return map[n]||String(n)
}

const _CLAUSE_BODIES = {
  lgpd:          (n) => `<p>${n}.1. As partes comprometem-se a tratar os dados pessoais em conformidade com a Lei nº 13.709/2018 (LGPD).</p>`,
  exclusividade: (n) => `<p>${n}.1. Fica vedado ao CONTRATADO prestar serviços a empresas concorrentes durante a vigência deste instrumento.</p>`,
  propriedade:   (n) => `<p>${n}.1. Todos os materiais desenvolvidos serão de propriedade exclusiva do CONTRATANTE, nos termos da Lei nº 9.610/1998.</p>`,
  sigilo:        (n) => `<p>${n}.1. As partes comprometem-se a manter absoluto sigilo sobre informações técnicas, comerciais e financeiras durante a vigência e por 2 anos após.</p>`,
  subcontratacao:(n) => `<p>${n}.1. É vedada a subcontratação sem prévia e expressa anuência da outra parte, sob pena de rescisão imediata.</p>`,
  reembolso:     (n) => `<p>${n}.1. Despesas operacionais previamente aprovadas serão reembolsadas em até 10 dias úteis mediante comprovante.</p>`,
  garantia:      (n) => `<p>${n}.1. O CONTRATADO garante a qualidade dos serviços por 90 dias após a entrega, comprometendo-se a corrigir gratuitamente falhas identificadas.</p>`,
  forca_maior:   (n) => `<p>${n}.1. Nenhuma das partes será responsabilizada por atrasos decorrentes de caso fortuito ou força maior, nos termos do art. 393 do Código Civil.</p>`,
  antisuborno:   (n) => `<p>${n}.1. As partes declaram conformidade com a Lei nº 12.846/2013 (Lei Anticorrupção), não praticando atos de corrupção ou suborno.</p>`,
  resolucao:     (n) => `<p>${n}.1. As partes poderão encerrar este instrumento por mútuo acordo mediante distrato escrito, sem necessidade de cumprir aviso prévio.</p>`,
  penalidade:    (n) => `<p>${n}.1. O descumprimento de qualquer obrigação sujeitará a parte infratora ao pagamento de multa de 10% sobre o valor total do contrato.</p>`,
}

/** Gera HTML de uma cláusula extra (síncrono) */
export function buildExtraClause(clause, clauseNum) {
  const body = _CLAUSE_BODIES[clause.id]?.(clauseNum) || `<p>${clauseNum}.1. ${clause.desc}.</p>`
  return `<div class="clausula"><div class="clausula-title">Cláusula ${_R(clauseNum)} — ${clause.name}</div><div class="clausula-body">${body}</div></div>`
}
