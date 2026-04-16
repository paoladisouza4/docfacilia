// ── carta_demissao/builder.js ────────────────────────────────────
// Gerador autônomo: Carta de Pedido de Demissão
import { fmtDate, partyLine, cabecalho, AVISO } from '../_shared/docHelpers.js'

export function build(data) {
  const { num, dateStr, pa, pb, obj_desc, obj_local, obj_inicio, obj_fim, jur_foro, jur_local } = data

  const foro  = jur_foro || 'Comarca do domicílio das partes'
  const local = jur_local || ''

  return `
${cabecalho(num, 'Carta de Pedido de Demissão')}
<div class="doc-subtitle">${dateStr}</div>

<div class="parties-block">
  <div class="parties-title">Partes / Declarante</div>
  <div class="party"><div class="party-role">DEMISSIONÁRIO:</div><p>${partyLine(pa,'DEMISSIONÁRIO')}</p></div>
  ${pb?.nome ? `<div class="party"><div class="party-role">EMPRESA / EMPREGADOR:</div><p>${partyLine(pb,'EMPRESA / EMPREGADOR')}</p></div>` : ''}
</div>

<p>${obj_desc}</p>
${obj_inicio ? `<p>Período: de ${fmtDate(obj_inicio)}${obj_fim ? ' a '+fmtDate(obj_fim) : ''}.</p>` : ''}
${obj_local ? `<p>Local: ${obj_local}.</p>` : ''}

<p>Declaro ser verdadeiras as informações acima prestadas, ciente das responsabilidades pelo seu conteúdo.</p>

<p style="margin-top:24px;">${local ? local+', ' : ''}${dateStr}.</p>
<div class="signatures-block">
  <div class="sig-grid">
    <div class="sig-item">
      <div class="sig-line"></div>
      <div class="sig-name">${pa.nome}</div>
      <div class="sig-role">DEMISSIONÁRIO</div>
      <div class="sig-doc">CPF/CNPJ: ${pa.doc||'__________________'}</div>
    </div>
    ${pb?.nome ? `<div class="sig-item">
      <div class="sig-line"></div>
      <div class="sig-name">${pb.nome}</div>
      <div class="sig-role">EMPRESA / EMPREGADOR</div>
      <div class="sig-doc">CPF/CNPJ: ${pb.doc||'__________________'}</div>
    </div>` : ''}
  </div>
</div>
${AVISO}`
}
