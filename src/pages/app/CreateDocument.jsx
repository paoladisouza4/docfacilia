import React, { useState, useEffect, useCallback } from 'react'
import {
  CATEGORIES, OPTIONAL_CLAUSES,
  getModule, getMeta, getByCategory, buildDocument, buildExtraClause,
} from '../../documents/registry.js'
import { generateDocId } from '../../lib/utils'

const STEP_LABELS = ['Tipo','Partes','Objeto','Valores','Cláusulas','Jurídico']

function Field({ f, value, onChange }) {
  const base = { id:f.id, value:value||'', className:'field-input' }
  const onCh = e => onChange(f.id, e.target.value)
  if (f.type==='textarea') return (
    <div className="field form-full">
      <label htmlFor={f.id}>{f.label}{f.required&&<span className="req"> *</span>}</label>
      <textarea {...base} rows={3} placeholder={f.hint||''} onChange={onCh} className="field-input field-textarea"/>
    </div>)
  if (f.type==='date') return (
    <div className="field"><label htmlFor={f.id}>{f.label}</label>
    <input type="date" {...base} onChange={onCh}/></div>)
  if (f.type==='money') return (
    <div className="field">
      <label htmlFor={f.id}>{f.label}{f.required&&<span className="req"> *</span>}</label>
      <input type="text" {...base} inputMode="decimal" placeholder="0,00"
        onChange={e=>{
          let v=e.target.value.replace(/\D/g,'')
          v=(parseInt(v||'0')/100).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')
          onChange(f.id,v)}}/>
    </div>)
  if (f.type==='select') return (
    <div className="field"><label htmlFor={f.id}>{f.label}</label>
    <select {...base} onChange={onCh}>
      <option value="">Selecione...</option>
      {(f.options||[]).map(o=><option key={o} value={o}>{o}</option>)}
    </select></div>)
  return (
    <div className="field">
      <label htmlFor={f.id}>{f.label}{f.required&&<span className="req"> *</span>}</label>
      <input type="text" {...base} placeholder={f.hint||''} onChange={onCh}/>
    </div>)
}

function PartySection({fields,values,onChange,title}){
  return(
    <div style={{marginBottom:24}}>
      <div className="section-label">{title}</div>
      <div className="form-grid">
        {fields.map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={onChange}/>)}
      </div>
    </div>)
}

export default function CreateDocument({onDocumentCreated, quickTypeId}){
  const [step,setStep]=useState(1)
  const [selectedType,setSelectedType]=useState('')
  const [selectedCat,setSelectedCat]=useState('contratos')
  const [mod,setMod]=useState(null)
  const [values,setValues]=useState({})
  const [clauses,setClauses]=useState([])
  const [testemunhas,setTestemunhas]=useState(false)

  useEffect(()=>{
    if(!quickTypeId) return
    const m=getMeta(quickTypeId)
    if(m){setSelectedCat(m.category);doSelectType(quickTypeId)}
  },[quickTypeId])

  const doSelectType=useCallback((id)=>{
    const m=getModule(id)
    if(!m) return
    setSelectedType(id); setMod(m)
    setValues({obj_inicio:new Date().toISOString().split('T')[0]})
    setClauses([]); setTestemunhas(false)
  },[])

  const activeSteps=mod?.meta.steps||[1,2,3,4,5,6]
  const curIdx=activeSteps.indexOf(step)
  const isLast=curIdx===activeSteps.length-1

  const setVal=(id,v)=>setValues(p=>({...p,[id]:v}))
  const toggleClause=(id)=>setClauses(p=>p.includes(id)?p.filter(c=>c!==id):[...p,id])

  function next(){
    if(step===1&&!selectedType) return
    if(step===3&&values.obj_local&&!values.jur_foro)
      setValues(p=>({...p,jur_foro:p.obj_local,jur_local:p.obj_local}))
    if(isLast){generate();return}
    setStep(activeSteps[curIdx+1])
  }
  function back(){if(curIdx>0) setStep(activeSteps[curIdx-1])}

  function generate(){
    const now=new Date()
    const dateStr=now.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
    const num=generateDocId()
    const meta=mod.meta
    const party=prefix=>({
      nome:(values[`${prefix}_nome`]||'').trim(),
      doc:(values[`${prefix}_doc`]||'').trim(),
      rg:(values[`${prefix}_rg`]||'').trim(),
      nac:(values[`${prefix}_nac`]||'Brasileiro(a)').trim(),
      est:(values[`${prefix}_est`]||'solteiro(a)').trim(),
      prof:(values[`${prefix}_prof`]||'').trim(),
      end:(values[`${prefix}_end`]||'').trim(),
      tel:(values[`${prefix}_tel`]||'').trim(),
      email:(values[`${prefix}_email`]||'').trim(),
    })
    const pa=party('pa')
    const pb=meta.parteB?party('pb'):{}
    const t1=testemunhas?{nome:values.t1_nome||'___________________________',doc:values.t1_doc||''}:{nome:null,doc:null}
    const t2=testemunhas?{nome:values.t2_nome||'___________________________',doc:values.t2_doc||''}:{nome:null,doc:null}
    const selectedClauses=OPTIONAL_CLAUSES.filter(c=>clauses.includes(c.id))
    let clausN=4
    const clausulasExtras=selectedClauses.map(c=>buildExtraClause(c,++clausN)).join('')
    const html=buildDocument(selectedType,{num,dateStr,pa,pb,t1,t2,...values,clausulasExtras,finalClauseN:clausN+1})
    const mods=getByCategory(meta.category)
    const emoji=mods.find(m=>m.meta.id===meta.id)?.meta?.emoji||'📄'
    onDocumentCreated({
      id:num,type:selectedType,
      typeInfo:{id:meta.id,name:meta.title,emoji},
      title:`${meta.title} — ${pa.nome||'Novo documento'}`,
      pa,pb,html,status:'rascunho',
      createdAt:new Date().toISOString(),
    })
  }

  const ff=mod?.fields||{}

  return(
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Criar Documento</div>
        <div className="page-subtitle">Escolha o tipo e preencha os dados</div>
      </div>

      <div className="wizard-steps">
        {activeSteps.map((s,i)=>(
          <React.Fragment key={s}>
            <div className={`wizard-step${step===s?' active':''}${step>s?' done':''}`}>
              <div className="step-num">{step>s?'✓':i+1}</div>
              <div className="step-label">{STEP_LABELS[s-1]}</div>
            </div>
            {i<activeSteps.length-1&&<div className={`step-connector${step>s?' done':''}`}/>}
          </React.Fragment>
        ))}
      </div>

      {step===1&&(
        <div className="wizard-body">
          <div className="wizard-title">Selecione o tipo de documento</div>
          <div className="wizard-subtitle">Escolha entre os modelos profissionais disponíveis</div>
          <div className="cat-tabs">
            {Object.entries(CATEGORIES).map(([key,cat])=>(
              <button key={key} className={`cat-tab${selectedCat===key?' active':''}`}
                onClick={()=>setSelectedCat(key)}>{cat.label}</button>
            ))}
          </div>
          <div className="types-grid">
            {getByCategory(selectedCat).map(m=>(
              <div key={m.meta.id}
                className={`type-card${selectedType===m.meta.id?' selected':''}`}
                onClick={()=>doSelectType(m.meta.id)}>
                <div className="type-card-check">✓</div>
                <div className="type-emoji">{m.meta.emoji||'📄'}</div>
                <div className="type-name">{m.meta.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step===2&&mod&&(
        <div className="wizard-body">
          <div className="wizard-title">Dados das Partes</div>
          <div className="wizard-subtitle">Informe os dados de: {mod.labels?.step2title}</div>
          <PartySection fields={ff.parteA||[]} values={values} onChange={setVal} title={`Parte A — ${mod.labels?.parteA||'Contratante'}`}/>
          {mod.meta.parteB&&<PartySection fields={ff.parteB||[]} values={values} onChange={setVal} title={`Parte B — ${mod.labels?.parteB||'Contratado'}`}/>}
          {ff.fiador&&<div style={{marginBottom:24}}><div className="section-label">Fiador</div><div className="form-grid">{ff.fiador.map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div></div>}
          {ff.instituicao&&<div style={{marginBottom:24}}><div className="section-label">Instituição de Ensino</div><div className="form-grid">{ff.instituicao.map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div></div>}
          {ff.contato&&<div style={{marginBottom:24}}><div className="section-label">Contato Profissional</div><div className="form-grid">{ff.contato.map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div></div>}
          {mod.meta.testemunhas&&(
            <div>
              <div className="section-label">Testemunhas</div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <button type="button" className={`cat-tab${testemunhas?' active':''}`}
                  style={{padding:'6px 14px',fontSize:12}} onClick={()=>setTestemunhas(t=>!t)}>
                  {testemunhas?'✓ Incluir no documento':'Não incluir'}
                </button>
              </div>
              {testemunhas&&<div className="form-grid">{(ff.testemunhas||[]).map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div>}
            </div>
          )}
        </div>
      )}

      {step===3&&mod&&(
        <div className="wizard-body">
          <div className="wizard-title">Objeto do Documento</div>
          <div className="wizard-subtitle">Descreva detalhadamente o que está sendo contratado</div>
          <div className="form-grid">{(ff.objeto||[]).map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div>
        </div>
      )}

      {step===4&&mod&&(
        <div className="wizard-body">
          <div className="wizard-title">Valores e Pagamento</div>
          <div className="wizard-subtitle">Defina as condições financeiras</div>
          <div className="form-grid">{(ff.valor||[]).map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div>
        </div>
      )}

      {step===5&&(
        <div className="wizard-body">
          <div className="wizard-title">Cláusulas Adicionais</div>
          <div className="wizard-subtitle">Adicione proteções extras ao seu documento</div>
          <div className="checkbox-group">
            {OPTIONAL_CLAUSES.map(c=>(
              <div key={c.id} className={`checkbox-item${clauses.includes(c.id)?' checked':''}`}
                onClick={()=>toggleClause(c.id)}>
                <div className="check-box">{clauses.includes(c.id)?'✓':''}</div>
                <div><div className="check-text">{c.name}</div><div className="check-desc">{c.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step===6&&mod&&(
        <div className="wizard-body">
          <div className="wizard-title">Dados Jurídicos Finais</div>
          <div className="wizard-subtitle">Informações legais e foro competente</div>
          <div className="form-grid">{(ff.juridico||[]).map(f=><Field key={f.id} f={f} value={values[f.id]} onChange={setVal}/>)}</div>
          <div className="info-box">
            <div style={{fontSize:13,fontWeight:600,color:'var(--accent)',marginBottom:4}}>✦ Tudo pronto para gerar!</div>
            <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>Clique em <strong>Gerar Documento</strong> para criar seu documento completo.</div>
          </div>
        </div>
      )}

      <div className="wizard-nav">
        <button className="btn-back" style={{visibility:step>1?'visible':'hidden'}} onClick={back}>← Voltar</button>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:12,color:'var(--text3)'}}>Etapa {curIdx+1} de {activeSteps.length}</span>
          <button className="btn-next"
            style={{background:isLast?'var(--green)':'var(--accent)'}}
            onClick={next} disabled={step===1&&!selectedType}>
            {isLast?'✨ Gerar Documento':'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  )
}
