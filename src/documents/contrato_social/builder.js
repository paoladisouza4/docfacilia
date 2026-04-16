// ── contrato_social/builder.js ───────────────────────────────────
// Gerador autônomo: Contrato Social
import { valorExtenso, roman, fmtDate, partyLine, cabecalho, signaturas, AVISO, vigText } from '../_shared/docHelpers.js'

export function build(data) {
  const {
    num, dateStr, pa, pb, t1, t2,
    obj_desc, obj_entregaveis, obj_local, obj_inicio, obj_fim,
    obj_obrig_a, obj_obrig_b,
    val_total, val_forma, val_venc, val_banco, val_multa, val_juros,
    jur_foro, jur_local, jur_rescisao, jur_multa_resc, jur_extra,
    clausulasExtras = '', finalClauseN = 7,
  } = data

  const inicio = obj_inicio ? fmtDate(obj_inicio) : dateStr
  const fim    = obj_fim    ? fmtDate(obj_fim)    : 'indeterminado'
  const vig    = vigText(inicio, fim)
  const total  = val_total || '0,00'
  const foro   = jur_foro  || 'Comarca do domicílio das partes'

  return `
${cabecalho(num, 'Contrato Social')}
<div class="doc-subtitle">Instrumento Particular · ${dateStr}</div>

<div class="parties-block">
  <div class="parties-title">Qualificação das Partes</div>
  <div class="party"><div class="party-role">SÓCIO A:</div><p>${partyLine(pa,'SÓCIO A')}</p></div>
  ${pb?.nome ? `<div class="party"><div class="party-role">SÓCIO B:</div><p>${partyLine(pb,'SÓCIO B')}</p></div>` : ''}
</div>

<div class="clausula">
  <div class="clausula-title">Cláusula I — Do Objeto</div>
  <div class="clausula-body">
    <p>1.1. <strong>${obj_desc}</strong></p>
    ${obj_entregaveis ? `<p>1.2. Escopo: ${obj_entregaveis}</p>` : ''}
    <p>${obj_entregaveis ? '1.3.' : '1.2.'} Vigência: ${vig}${obj_local ? ', local: '+obj_local : ''}.</p>
  </div>
</div>

${obj_obrig_a ? `<div class="clausula">
  <div class="clausula-title">Cláusula II — Das Obrigações de Sócio A</div>
  <div class="clausula-body">
    <p>2.1. Compete ao SÓCIO A: ${obj_obrig_a}.</p>
  </div>
</div>` : ''}

${obj_obrig_b && pb?.nome ? `<div class="clausula">
  <div class="clausula-title">Cláusula III — Das Obrigações de Sócio B</div>
  <div class="clausula-body">
    <p>3.1. Compete ao SÓCIO B: ${obj_obrig_b}.</p>
  </div>
</div>` : ''}

<div class="clausula">
  <div class="clausula-title">Cláusula IV — Do Valor e Pagamento</div>
  <div class="clausula-body">
    <p>4.1. Valor: <strong>R$ ${total}</strong> (${valorExtenso(total)}), pago <strong>${val_forma||'à vista'}</strong>${val_venc ? ', com vencimento em '+val_venc : ''}.${val_banco ? ' Pagamento via: '+val_banco+'.' : ''}</p>
    ${val_multa ? `<p>4.2. Multa por atraso: ${val_multa}. Juros de mora: ${val_juros||'1% ao mês'}.</p>` : ''}
  </div>
</div>

${clausulasExtras}

<div class="clausula">
  <div class="clausula-title">Cláusula ${roman(finalClauseN)} — Das Disposições Gerais</div>
  <div class="clausula-body">
    <p>Fica eleito o foro de <strong>${foro}</strong> para dirimir quaisquer litígios.${jur_extra ? ' '+jur_extra : ''}</p>
  </div>
</div>

${signaturas({ pa, pb, roleA:'SÓCIO A', roleB:'SÓCIO B', t1, t2, jur:{local:jur_local}, dateStr })}
${AVISO}`
}
