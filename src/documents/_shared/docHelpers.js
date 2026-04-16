// ══════════════════════════════════════════════════════════════
//  _shared/docHelpers.js
//  Funções de FORMATAÇÃO pura — sem lógica de documento.
//  Cada módulo importa daqui apenas o que precisa.
//  NÃO contém templates, builders ou lógica de geração.
// ══════════════════════════════════════════════════════════════

// ── Texto por extenso ─────────────────────────────────────────
export function valorExtenso(val) {
  if (!val) return 'valor a ser definido'
  const n = parseFloat(String(val).replace(/\./g, '').replace(',', '.'))
  if (isNaN(n) || n === 0) return 'valor a ser definido'
  const U = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez',
             'onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove']
  const D = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa']
  const C = ['','cem','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos']
  const ext = (num) => {
    if (!num) return ''
    if (num === 100) return 'cem'
    if (num < 20) return U[num]
    if (num < 100) return D[Math.floor(num/10)] + (num%10 ? ' e '+U[num%10] : '')
    return C[Math.floor(num/100)] + (num%100 ? ' e '+ext(num%100) : '')
  }
  const int = Math.floor(n)
  const cts = Math.round((n - int) * 100)
  let s = ''
  if (!int) s = 'zero'
  else if (int < 1000) s = ext(int) + (int===1?' real':' reais')
  else if (int < 1e6) {
    const m=Math.floor(int/1000),r=int%1000
    s = (m===1?'mil':ext(m)+' mil') + (r?' e '+ext(r):'') + ' reais'
  } else {
    const m=Math.floor(int/1e6),r=int%1e6
    s = ext(m)+(m===1?' milhão':' milhões')+(r?' e '+ext(r):'') + ' de reais'
  }
  if (!cts) return s
  const sc = ext(cts)+(cts===1?' centavo':' centavos')
  return int ? s+' e '+sc : sc
}

// ── Numeral romano ────────────────────────────────────────────
export function roman(n) {
  const map = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',
    11:'XI',12:'XII',13:'XIII',14:'XIV',15:'XV',16:'XVI',17:'XVII',18:'XVIII',19:'XIX',20:'XX'}
  return map[n] || String(n)
}

// ── Formata data ISO → "12 de janeiro de 2026" ───────────────
export function fmtDate(d) {
  if (!d) return ''
  const [y,m,day] = d.split('-')
  const months = ['janeiro','fevereiro','março','abril','maio','junho',
                  'julho','agosto','setembro','outubro','novembro','dezembro']
  return `${parseInt(day)} de ${months[parseInt(m)-1]} de ${y}`
}

// ── Linha de qualificação da parte ───────────────────────────
export function partyLine(p, role) {
  if (!p?.nome) return `[${role} — dados não preenchidos]`
  return [
    `<strong>${p.nome}</strong>`,
    p.nac||'',
    p.est||'',
    p.prof||'',
    p.doc ? (p.doc.replace(/\D/g,'').length>11 ? `CNPJ nº ${p.doc}` : `CPF nº ${p.doc}`) : '',
    p.rg  ? `RG nº ${p.rg}` : '',
    p.end ? `residente e domiciliado(a) na ${p.end}` : '',
    p.tel  ? `Tel.: ${p.tel}` : '',
    p.email ? `E-mail: ${p.email}` : '',
  ].filter(Boolean).join(', ') + '.'
}

// ── Cabeçalho padrão do documento ────────────────────────────
export function cabecalho(num, title) {
  return `<div class="doc-header"><div class="doc-title">${title}</div><div class="doc-num">Nº ${num}</div></div>`
}

// ── Bloco de assinaturas ─────────────────────────────────────
export function signaturas({ pa, pb, roleA, roleB, t1, t2, jur, dateStr }) {
  const local = jur?.local ? `${jur.local}, ` : ''
  return `
  <div class="signatures-block">
    <div class="signatures-title">${local}${dateStr}</div>
    <div class="sig-grid">
      <div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">${pa.nome||'___________________________'}</div>
        <div class="sig-role">${roleA}</div>
        <div class="sig-doc">CPF/CNPJ: ${pa.doc||'__________________'}</div>
      </div>
      ${pb?.nome?`<div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">${pb.nome}</div>
        <div class="sig-role">${roleB}</div>
        <div class="sig-doc">CPF/CNPJ: ${pb.doc||'__________________'}</div>
      </div>`:''}
    </div>
    ${t1?.nome?`<div class="witnesses-block">
      <div class="witnesses-title">Testemunhas</div>
      <div class="sig-grid">
        <div class="sig-item"><div class="sig-line"></div><div class="sig-name">${t1.nome}</div><div class="sig-doc">CPF: ${t1.doc||''}</div></div>
        <div class="sig-item"><div class="sig-line"></div><div class="sig-name">${t2?.nome||'___________________________'}</div><div class="sig-doc">CPF: ${t2?.doc||''}</div></div>
      </div>
    </div>`:''}
  </div>`
}

// ── Aviso legal ───────────────────────────────────────────────
export const AVISO = `<div class="doc-aviso">⚠️ Este modelo foi gerado pelo DocFácil IA e é um instrumento particular de referência. Não constitui assessoria ou consultoria jurídica. Para situações específicas, consulte um profissional habilitado.</div>`

// ── Texto de vigência ─────────────────────────────────────────
export function vigText(inicio, fim) {
  if (fim && fim !== 'indeterminado') return `de ${inicio} a ${fim}`
  return `a partir de ${inicio}`
}

// ── Máscara de moeda ─────────────────────────────────────────
export function maskMoney(raw) {
  let v = String(raw).replace(/\D/g,'')
  v = (parseInt(v||'0')/100).toFixed(2)
  return v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}
