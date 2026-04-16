// ── acordo_amigavel/builder.js ───────────────────────────────────
// Gerador autônomo: Acordo Amigável entre Partes
import { valorExtenso, fmtDate, partyLine, cabecalho, signaturas, AVISO } from '../_shared/docHelpers.js'

export function build(data) {
  const { num, dateStr, pa, pb, t1, t2,
    obj_desc, obj_local, obj_inicio,
    val_total, val_forma, val_banco, val_multa, val_juros,
    jur_foro, jur_local } = data

  const total = val_total || '0,00'
  const foro  = jur_foro  || 'Comarca do domicílio das partes'

  return `
${cabecalho(num, 'Acordo Amigável entre Partes')}
<div class="doc-subtitle">${dateStr}</div>

<div class="parties-block">
  <div class="parties-title">Partes</div>
  <div class="party"><div class="party-role">PARTE A:</div><p>${partyLine(pa,'PARTE A')}</p></div>
  <div class="party"><div class="party-role">PARTE B:</div><p>${partyLine(pb,'PARTE B')}</p></div>
</div>

<p>Referente a: <strong>${obj_desc}</strong></p>
${obj_inicio ? `<p>Data de referência: ${fmtDate(obj_inicio)}.</p>` : ''}

<p>Valor: <strong>R$ ${total}</strong> (${valorExtenso(total)}).</p>
<p>Forma de pagamento: <strong>${val_forma||'conforme acordado'}</strong>${val_banco ? '. Dados: '+val_banco : ''}.</p>
${val_multa ? `<p>Multa por atraso: ${val_multa}. Juros de mora: ${val_juros||'1% ao mês'}.</p>` : ''}

${signaturas({ pa, pb, roleA:'PARTE A', roleB:'PARTE B', t1, t2, jur:{local:jur_local}, dateStr })}
${AVISO}`
}
