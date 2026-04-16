// ── confissao_divida/builder.js ──────────────────────────────────
// Gerador autônomo: Confissão de Dívida
import { valorExtenso, fmtDate, partyLine, cabecalho, signaturas, AVISO } from '../_shared/docHelpers.js'

export function build(data) {
  const { num, dateStr, pa, pb, t1, t2,
    obj_desc, obj_local, obj_inicio,
    val_total, val_forma, val_banco, val_multa, val_juros,
    jur_foro, jur_local } = data

  const total = val_total || '0,00'
  const foro  = jur_foro  || 'Comarca do domicílio das partes'

  return `
${cabecalho(num, 'Confissão de Dívida')}
<div class="doc-subtitle">${dateStr}</div>

<div class="parties-block">
  <div class="parties-title">Partes</div>
  <div class="party"><div class="party-role">CREDOR:</div><p>${partyLine(pa,'CREDOR')}</p></div>
  <div class="party"><div class="party-role">DEVEDOR:</div><p>${partyLine(pb,'DEVEDOR')}</p></div>
</div>

<p>Referente a: <strong>${obj_desc}</strong></p>
${obj_inicio ? `<p>Data de referência: ${fmtDate(obj_inicio)}.</p>` : ''}

<p>Valor: <strong>R$ ${total}</strong> (${valorExtenso(total)}).</p>
<p>Forma de pagamento: <strong>${val_forma||'conforme acordado'}</strong>${val_banco ? '. Dados: '+val_banco : ''}.</p>
${val_multa ? `<p>Multa por atraso: ${val_multa}. Juros de mora: ${val_juros||'1% ao mês'}.</p>` : ''}

${signaturas({ pa, pb, roleA:'CREDOR', roleB:'DEVEDOR', t1, t2, jur:{local:jur_local}, dateStr })}
${AVISO}`
}
