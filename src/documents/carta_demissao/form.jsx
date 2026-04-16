// ── carta_demissao/form.jsx ────────────────────────────────────
// Formulário exclusivo: Carta de Pedido de Demissão
// Não depende de nenhum outro documento.

export const fields = {
  parteA: [
    { id:'pa_nome',  label:'Nome / Razão Social *', type:'text',     required:true },
    { id:'pa_doc',   label:'CPF / CNPJ',             type:'text' },
    { id:'pa_rg',    label:'RG (opcional)',           type:'text' },
    { id:'pa_nac',   label:'Nacionalidade',           type:'text' },
    { id:'pa_est',   label:'Estado civil',            type:'text' },
    { id:'pa_prof',  label:'Profissão',               type:'text' },
    { id:'pa_end',   label:'Endereço completo',       type:'text' },
    { id:'pa_tel',   label:'Telefone',                type:'text' },
    { id:'pa_email', label:'E-mail',                  type:'text' },
  ],
  parteB: [
    { id:'pb_nome',  label:'Nome / Razão Social *', type:'text',     required:true },
    { id:'pb_doc',   label:'CPF / CNPJ',             type:'text' },
    { id:'pb_rg',    label:'RG (opcional)',           type:'text' },
    { id:'pb_nac',   label:'Nacionalidade',           type:'text' },
    { id:'pb_est',   label:'Estado civil',            type:'text' },
    { id:'pb_prof',  label:'Profissão',               type:'text' },
    { id:'pb_end',   label:'Endereço completo',       type:'text' },
    { id:'pb_tel',   label:'Telefone',                type:'text' },
    { id:'pb_email', label:'E-mail',                  type:'text' },
  ],
  objeto: [
    { id:'obj_desc',  label:'Descrição / Objeto *', type:'textarea', required:true,
      hint:'Descreva detalhadamente o objeto deste documento' },
    { id:'obj_local', label:'Cidade',               type:'text' },
    { id:'obj_inicio',label:'Data de Início',       type:'date' },
    { id:'obj_fim',   label:'Data de Término',      type:'date' },
  ],
  juridico: [
    { id:'jur_foro',  label:'Foro competente',               type:'text' },
    { id:'jur_local', label:'Cidade / Local da assinatura',  type:'text' },
  ],
  testemunhas: [
    { id:'t1_nome', label:'Testemunha 1 — Nome', type:'text' },
    { id:'t1_doc',  label:'Testemunha 1 — CPF',  type:'text' },
    { id:'t2_nome', label:'Testemunha 2 — Nome', type:'text' },
    { id:'t2_doc',  label:'Testemunha 2 — CPF',  type:'text' },
  ],
}

export const labels = {
  parteA: 'Demissionário',
  parteB: 'Empresa / Empregador',
  step2title: 'Demissionário  e  Empresa / Empregador',
}