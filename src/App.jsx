import { useState, useEffect } from "react";

const font = `'Segoe UI', 'SF Pro Display', -apple-system, sans-serif`;
const C = {
  bg: "#0c0e14", surface: "#141720", surfaceHover: "#1a1e2b", border: "#1e2333",
  text: "#e4e6ef", textMuted: "#7a7f94", accent: "#6c5ce7", accentLight: "#a29bfe",
  green: "#00cec9", greenBg: "rgba(0,206,201,0.1)", greenBorder: "rgba(0,206,201,0.25)",
  red: "#ff6b6b", redBg: "rgba(255,107,107,0.1)", redBorder: "rgba(255,107,107,0.25)",
  orange: "#ffa502", orangeBg: "rgba(255,165,2,0.1)", orangeBorder: "rgba(255,165,2,0.25)",
  blue: "#3742fa", blueBg: "rgba(55,66,250,0.1)",
  purpleBg: "rgba(108,92,231,0.08)",
};

const BUSINESS_TYPES = {
  RETAIL: { label: "Retail", icon: "🏪", modules: ["inventory","orders","suppliers","reports"] },
  MANUFACTURER: { label: "Manufactura", icon: "🏭", modules: ["inventory","orders","suppliers","reports","production","raw_materials"] },
  HYBRID: { label: "Híbrido", icon: "⚡", modules: ["inventory","orders","suppliers","reports","production","raw_materials"] },
};

const initProducts = () => [
  { id:1, name:"Café Molido Premium", sku:"CAF-001", category:"Bebidas", stock:145, minStock:30, costPrice:85, salePrice:120, type:"COMMERCIAL" },
  { id:2, name:"Pan Artesanal Integral", sku:"PAN-002", category:"Panadería", stock:12, minStock:20, costPrice:15, salePrice:35, type:"MANUFACTURED" },
  { id:3, name:"Aceite de Oliva 500ml", sku:"ACE-003", category:"Abarrotes", stock:67, minStock:15, costPrice:95, salePrice:145, type:"COMMERCIAL" },
  { id:4, name:"Galletas de Avena", sku:"GAL-004", category:"Panadería", stock:5, minStock:25, costPrice:8, salePrice:22, type:"MANUFACTURED" },
  { id:5, name:"Leche Entera 1L", sku:"LEC-005", category:"Lácteos", stock:89, minStock:40, costPrice:22, salePrice:32, type:"COMMERCIAL" },
  { id:6, name:"Queso Fresco 250g", sku:"QUE-006", category:"Lácteos", stock:18, minStock:15, costPrice:35, salePrice:55, type:"COMMERCIAL" },
  { id:7, name:"Pastel de Chocolate", sku:"PAS-007", category:"Repostería", stock:3, minStock:5, costPrice:45, salePrice:120, type:"MANUFACTURED" },
  { id:8, name:"Arroz 5kg", sku:"ARR-008", category:"Abarrotes", stock:200, minStock:50, costPrice:65, salePrice:85, type:"COMMERCIAL" },
];
const initOrders = () => [
  { id:"ORD-0041", date:"2026-04-28", type:"PURCHASE", supplier:"Distribuidora Central", total:4250, status:"COMPLETED", items:8 },
  { id:"ORD-0040", date:"2026-04-27", type:"SALE", supplier:"—", total:1890, status:"COMPLETED", items:5 },
  { id:"ORD-0039", date:"2026-04-27", type:"PURCHASE", supplier:"Lácteos del Valle", total:2100, status:"PENDING", items:3 },
  { id:"ORD-0038", date:"2026-04-26", type:"SALE", supplier:"—", total:3420, status:"COMPLETED", items:12 },
  { id:"ORD-0037", date:"2026-04-25", type:"SALE", supplier:"—", total:780, status:"CANCELLED", items:2 },
];
const initSuppliers = () => [
  { id:1, name:"Distribuidora Central", type:"PRODUCT_SUPPLIER", contact:"Carlos Mejía", phone:"+504 9912-3456", email:"carlos@distcentral.hn", products:24 },
  { id:2, name:"Lácteos del Valle", type:"PRODUCT_SUPPLIER", contact:"María López", phone:"+504 9834-5678", email:"maria@lacteosv.hn", products:8 },
  { id:3, name:"Harinas del Norte", type:"RAW_MATERIAL_SUPPLIER", contact:"José Reyes", phone:"+504 9756-7890", email:"jose@harinasnorte.hn", products:5 },
  { id:4, name:"Empaques Express", type:"BOTH", contact:"Ana Flores", phone:"+504 9678-9012", email:"ana@empaques.hn", products:12 },
];
const initMovements = () => [
  { id:1, date:"2026-04-28 14:23", product:"Café Molido Premium", type:"IN", quantity:50, reason:"Compra ORD-0041", user:"Admin" },
  { id:2, date:"2026-04-28 11:05", product:"Pan Artesanal Integral", type:"OUT", quantity:8, reason:"Venta ORD-0040", user:"Operador" },
  { id:3, date:"2026-04-27 16:30", product:"Galletas de Avena", type:"OUT", quantity:20, reason:"Venta ORD-0038", user:"Operador" },
  { id:4, date:"2026-04-27 09:15", product:"Aceite de Oliva 500ml", type:"IN", quantity:30, reason:"Compra ORD-0039", user:"Admin" },
  { id:5, date:"2026-04-26 13:45", product:"Pastel de Chocolate", type:"OUT", quantity:2, reason:"Venta ORD-0038", user:"Operador" },
  { id:6, date:"2026-04-26 08:00", product:"Leche Entera 1L", type:"ADJUSTMENT", quantity:-3, reason:"Ajuste por merma", user:"Admin" },
];
const initRawMaterials = () => [
  { id:1, name:"Harina de Trigo 25kg", sku:"RM-HAR-001", stock:8, unit:"sacos", minStock:3, supplier:"Harinas del Norte" },
  { id:2, name:"Azúcar 50kg", sku:"RM-AZU-002", stock:5, unit:"sacos", minStock:2, supplier:"Distribuidora Central" },
  { id:3, name:"Mantequilla 5kg", sku:"RM-MAN-003", stock:12, unit:"bloques", minStock:4, supplier:"Lácteos del Valle" },
  { id:4, name:"Huevos (30 unid)", sku:"RM-HUE-004", stock:6, unit:"cartones", minStock:3, supplier:"Distribuidora Central" },
  { id:5, name:"Chocolate en polvo 1kg", sku:"RM-CHO-005", stock:2, unit:"kg", minStock:3, supplier:"Empaques Express" },
];

// ─── Utils ──────────────────────────────────────────────────────────────────
const getStatus = (stock, min) => stock <= min * 0.3 ? "critical" : stock <= min ? "low" : "ok";
const nextId = (arr) => Math.max(0, ...arr.map(x => typeof x.id === "number" ? x.id : 0)) + 1;
const nowStr = () => new Date().toISOString().replace("T"," ").slice(0,16);
const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, outline:"none", fontFamily:font, boxSizing:"border-box" };

// ─── Tiny Components ────────────────────────────────────────────────────────
function Badge({children, color="accent", style={}}){
  const m = { accent:{bg:C.purpleBg,text:C.accentLight,bd:"rgba(108,92,231,0.3)"}, green:{bg:C.greenBg,text:C.green,bd:C.greenBorder}, red:{bg:C.redBg,text:C.red,bd:C.redBorder}, orange:{bg:C.orangeBg,text:C.orange,bd:C.orangeBorder}, blue:{bg:C.blueBg,text:"#5f6cfa",bd:"rgba(55,66,250,0.3)"}, muted:{bg:"rgba(122,127,148,0.1)",text:C.textMuted,bd:"rgba(122,127,148,0.2)"} };
  const c = m[color]||m.accent;
  return <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:c.bg,color:c.text,border:`1px solid ${c.bd}`,letterSpacing:.3,textTransform:"uppercase",whiteSpace:"nowrap",...style}}>{children}</span>;
}
function StatCard({icon,label,value,sub,trend,color=C.accent}){
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 24px",flex:"1 1 200px",minWidth:180,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${color},transparent)`}}/>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{fontSize:22}}>{icon}</span><span style={{fontSize:12,color:C.textMuted,fontWeight:500,letterSpacing:.5,textTransform:"uppercase"}}>{label}</span></div>
    <div style={{fontSize:30,fontWeight:700,color:C.text,letterSpacing:-1}}>{value}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}><span style={{fontSize:12,color:C.textMuted}}>{sub}</span>{trend&&<span style={{fontSize:11,color:trend>0?C.green:C.red,fontWeight:600}}>{trend>0?"▲":"▼"} {Math.abs(trend)}%</span>}</div>
  </div>;
}
function MiniChart({data,color=C.accent,height=50}){
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1,w=100/data.length;
  return <svg viewBox={`0 0 100 ${height}`} style={{width:"100%",height}} preserveAspectRatio="none">
    <defs><linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <path d={`M0,${height} ${data.map((v,i)=>`L${i*w+w/2},${height-((v-min)/range)*(height-8)-4}`).join(" ")} L100,${height} Z`} fill={`url(#g${color.replace("#","")})`}/>
    <polyline points={data.map((v,i)=>`${i*w+w/2},${height-((v-min)/range)*(height-8)-4}`).join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>;
}

function Toast({message,type="success",onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  const tc=type==="success"?C.green:type==="error"?C.red:C.orange;
  const bc=type==="success"?C.greenBorder:type==="error"?C.redBorder:C.orangeBorder;
  const bg=type==="success"?C.greenBg:type==="error"?C.redBg:C.orangeBg;
  const ic=type==="success"?"✓":type==="error"?"✕":"⚠";
  return <div style={{position:"fixed",top:24,right:24,zIndex:9999,background:C.surface,border:`1px solid ${bc}`,borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:"slideIn .3s ease"}}>
    <span style={{width:24,height:24,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:tc}}>{ic}</span>
    <span style={{fontSize:13,color:C.text}}>{message}</span>
    <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:16,padding:"0 0 0 8px"}}>×</button>
  </div>;
}

function Modal({title,onClose,children,width=500}){
  return <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width,maxWidth:"90vw",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.5)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.text}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:20}}>×</button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>;
}
function Field({label,children}){ return <div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{label}</label>{children}</div>; }
function Actions({onCancel,onSave,label="Guardar"}){
  return <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:24,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
    <button onClick={onCancel} style={{padding:"10px 24px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontSize:13,cursor:"pointer"}}>Cancelar</button>
    <button onClick={onSave} style={{padding:"10px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accentLight})`,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:`0 2px 12px rgba(108,92,231,.3)`}}>{label}</button>
  </div>;
}
function ConfirmModal({message,onConfirm,onCancel}){
  return <Modal title="Confirmar" onClose={onCancel} width={400}>
    <p style={{fontSize:14,color:C.text,margin:"0 0 8px",lineHeight:1.6}}>{message}</p>
    <p style={{fontSize:12,color:C.textMuted,margin:0}}>Esta acción no se puede deshacer.</p>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:24}}>
      <button onClick={onCancel} style={{padding:"10px 24px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontSize:13,cursor:"pointer"}}>Cancelar</button>
      <button onClick={onConfirm} style={{padding:"10px 24px",borderRadius:10,border:"none",background:C.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Eliminar</button>
    </div>
  </Modal>;
}
function RowActions({onEdit,onDelete}){
  const btn = (onClick,tip,icon,hc) => <button onClick={e=>{e.stopPropagation();onClick();}} title={tip} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=hc;e.currentTarget.style.color=hc;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}>{icon}</button>;
  return <div style={{display:"flex",gap:4}}>{btn(onEdit,"Editar","✎",C.accent)}{btn(onDelete,"Eliminar","🗑",C.red)}</div>;
}

// ─── Export ──────────────────────────────────────────────────────────────────
function doExport(title,headers,rows,biz){
  const now=new Date().toLocaleString("es-HN");
  const cw=headers.map((h,i)=>Math.max(h.length,...rows.map(r=>String(r[i]||"").length)));
  let t=`INVENTOMETRICS GIA — ${biz}\nReporte: ${title}\nFecha: ${now}\n${"═".repeat(80)}\n\n`;
  t+=headers.map((h,i)=>h.padEnd(cw[i]+2)).join("")+"\n";
  t+=headers.map((_,i)=>"─".repeat(cw[i]+2)).join("")+"\n";
  rows.forEach(r=>{t+=r.map((c,i)=>String(c).padEnd(cw[i]+2)).join("")+"\n";});
  t+=`\n${"═".repeat(80)}\nTotal: ${rows.length} registros\nGenerado por InventometricsGIA\n`;
  const blob=new Blob([t],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`${title.replace(/\s/g,"_")}_${new Date().toISOString().split("T")[0]}.txt`;
  a.click(); URL.revokeObjectURL(a.href);
}

// ─── Form Modals ────────────────────────────────────────────────────────────
function ProductForm({product,onSave,onClose}){
  const [f,setF]=useState(product||{name:"",sku:"",category:"Abarrotes",stock:0,minStock:10,costPrice:0,salePrice:0,type:"COMMERCIAL"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title={product?"Editar Producto":"Nuevo Producto"} onClose={onClose} width={520}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <Field label="Nombre"><input style={inputStyle} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Nombre del producto"/></Field>
      <Field label="SKU"><input style={inputStyle} value={f.sku} onChange={e=>s("sku",e.target.value)} placeholder="CAF-001"/></Field>
      <Field label="Categoría"><select style={inputStyle} value={f.category} onChange={e=>s("category",e.target.value)}>{["Abarrotes","Bebidas","Lácteos","Panadería","Repostería","Limpieza","Otros"].map(c=><option key={c}>{c}</option>)}</select></Field>
      <Field label="Tipo"><select style={inputStyle} value={f.type} onChange={e=>s("type",e.target.value)}><option value="COMMERCIAL">Comercial</option><option value="MANUFACTURED">Fabricado</option></select></Field>
      <Field label="Stock actual"><input style={inputStyle} type="number" value={f.stock} onChange={e=>s("stock",+e.target.value)}/></Field>
      <Field label="Stock mínimo"><input style={inputStyle} type="number" value={f.minStock} onChange={e=>s("minStock",+e.target.value)}/></Field>
      <Field label="Precio costo (L)"><input style={inputStyle} type="number" step=".01" value={f.costPrice} onChange={e=>s("costPrice",+e.target.value)}/></Field>
      <Field label="Precio venta (L)"><input style={inputStyle} type="number" step=".01" value={f.salePrice} onChange={e=>s("salePrice",+e.target.value)}/></Field>
    </div>
    <Actions onCancel={onClose} onSave={()=>{if(f.name&&f.sku)onSave(f);}}/>
  </Modal>;
}
function OrderForm({order,suppliers,onSave,onClose}){
  const [f,setF]=useState(order||{type:"PURCHASE",supplier:suppliers[0]?.name||"",total:0,items:1,status:"PENDING"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title={order?"Editar Orden":"Nueva Orden"} onClose={onClose}>
    <Field label="Tipo"><select style={inputStyle} value={f.type} onChange={e=>s("type",e.target.value)}><option value="PURCHASE">Compra</option><option value="SALE">Venta</option></select></Field>
    {f.type==="PURCHASE"&&<Field label="Proveedor"><select style={inputStyle} value={f.supplier} onChange={e=>s("supplier",e.target.value)}>{suppliers.map(x=><option key={x.id} value={x.name}>{x.name}</option>)}</select></Field>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <Field label="Total (L)"><input style={inputStyle} type="number" step=".01" value={f.total} onChange={e=>s("total",+e.target.value)}/></Field>
      <Field label="Items"><input style={inputStyle} type="number" value={f.items} onChange={e=>s("items",+e.target.value)}/></Field>
    </div>
    <Field label="Estado"><select style={inputStyle} value={f.status} onChange={e=>s("status",e.target.value)}><option value="PENDING">Pendiente</option><option value="COMPLETED">Completada</option><option value="CANCELLED">Cancelada</option></select></Field>
    <Actions onCancel={onClose} onSave={()=>{if(f.total>0)onSave(f);}}/>
  </Modal>;
}
function SupplierForm({supplier,onSave,onClose}){
  const [f,setF]=useState(supplier||{name:"",type:"PRODUCT_SUPPLIER",contact:"",phone:"",email:"",products:0});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title={supplier?"Editar Proveedor":"Nuevo Proveedor"} onClose={onClose}>
    <Field label="Empresa"><input style={inputStyle} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Distribuidora Central"/></Field>
    <Field label="Tipo"><select style={inputStyle} value={f.type} onChange={e=>s("type",e.target.value)}><option value="PRODUCT_SUPPLIER">Productos</option><option value="RAW_MATERIAL_SUPPLIER">Materia prima</option><option value="BOTH">Ambos</option></select></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <Field label="Contacto"><input style={inputStyle} value={f.contact} onChange={e=>s("contact",e.target.value)}/></Field>
      <Field label="Teléfono"><input style={inputStyle} value={f.phone} onChange={e=>s("phone",e.target.value)} placeholder="+504 9999-9999"/></Field>
    </div>
    <Field label="Email"><input style={inputStyle} type="email" value={f.email} onChange={e=>s("email",e.target.value)}/></Field>
    <Actions onCancel={onClose} onSave={()=>{if(f.name)onSave(f);}}/>
  </Modal>;
}
function MovementForm({products,onSave,onClose}){
  const [f,setF]=useState({product:products[0]?.name||"",type:"IN",quantity:1,reason:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title="Registrar Movimiento" onClose={onClose}>
    <Field label="Producto"><select style={inputStyle} value={f.product} onChange={e=>s("product",e.target.value)}>{products.map(p=><option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>)}</select></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <Field label="Tipo"><select style={inputStyle} value={f.type} onChange={e=>s("type",e.target.value)}><option value="IN">Entrada</option><option value="OUT">Salida</option><option value="ADJUSTMENT">Ajuste</option></select></Field>
      <Field label="Cantidad"><input style={inputStyle} type="number" value={f.quantity} onChange={e=>s("quantity",+e.target.value)}/></Field>
    </div>
    <Field label="Razón"><input style={inputStyle} value={f.reason} onChange={e=>s("reason",e.target.value)} placeholder="Compra, venta, merma..."/></Field>
    <Actions onCancel={onClose} onSave={()=>{if(f.reason&&f.quantity>0)onSave(f);}} label="Registrar"/>
  </Modal>;
}
function RawMaterialForm({material,suppliers,onSave,onClose}){
  const [f,setF]=useState(material||{name:"",sku:"",stock:0,unit:"kg",minStock:3,supplier:suppliers[0]?.name||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title={material?"Editar Material":"Nueva Materia Prima"} onClose={onClose}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <Field label="Nombre"><input style={inputStyle} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Harina de Trigo 25kg"/></Field>
      <Field label="SKU"><input style={inputStyle} value={f.sku} onChange={e=>s("sku",e.target.value)} placeholder="RM-HAR-001"/></Field>
      <Field label="Stock"><input style={inputStyle} type="number" value={f.stock} onChange={e=>s("stock",+e.target.value)}/></Field>
      <Field label="Unidad"><select style={inputStyle} value={f.unit} onChange={e=>s("unit",e.target.value)}>{["kg","g","litros","ml","sacos","bloques","cartones","unidades"].map(u=><option key={u}>{u}</option>)}</select></Field>
      <Field label="Stock mínimo"><input style={inputStyle} type="number" value={f.minStock} onChange={e=>s("minStock",+e.target.value)}/></Field>
      <Field label="Proveedor"><select style={inputStyle} value={f.supplier} onChange={e=>s("supplier",e.target.value)}>{suppliers.map(x=><option key={x.id} value={x.name}>{x.name}</option>)}</select></Field>
    </div>
    <Actions onCancel={onClose} onSave={()=>{if(f.name&&f.sku)onSave(f);}}/>
  </Modal>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════
function DashboardPage({products,orders,movements,businessType}){
  const low=products.filter(p=>getStatus(p.stock,p.minStock)!=="ok");
  const totalStock=products.reduce((s,p)=>s+p.stock,0);
  const totalValue=products.reduce((s,p)=>s+p.stock*p.salePrice,0);
  return <div style={{display:"flex",flexDirection:"column",gap:24}}>
    <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
      <StatCard icon="📦" label="Productos" value={products.length} sub={`${low.length} con stock bajo`} trend={12} color={C.accent}/>
      <StatCard icon="🏷️" label="Stock Total" value={totalStock.toLocaleString()} sub="unidades" trend={-3} color={C.green}/>
      <StatCard icon="💰" label="Valor Inventario" value={`L ${totalValue.toLocaleString()}`} sub="precio de venta" trend={8} color={C.orange}/>
      <StatCard icon="📋" label="Órdenes" value={orders.length} sub={`${orders.filter(o=>o.status==="PENDING").length} pendiente(s)`} trend={15} color="#3742fa"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
        <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:.8}}>Ventas - 12 meses</div>
        <MiniChart data={[12,19,8,25,18,30,22,28,35,20,32,40]} color={C.green} height={80}/>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
        <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:.8}}>Nivel de Stock</div>
        <MiniChart data={[200,195,210,180,190,175,185,195,170,180,165,160]} color={C.orange} height={80}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
        <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:.8}}>Últimos Movimientos</div>
        {movements.slice(0,4).map(m=><div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:18}}>{m.type==="IN"?"📥":m.type==="OUT"?"📤":"🔄"}</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.text}}>{m.product}</div><div style={{fontSize:11,color:C.textMuted}}>{m.reason}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:600,color:m.type==="IN"?C.green:m.type==="OUT"?C.red:C.orange}}>{m.type==="IN"?"+":"-"}{Math.abs(m.quantity)}</div><div style={{fontSize:10,color:C.textMuted}}>{m.date.split(" ")[1]}</div></div>
        </div>)}
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
        <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:.8}}>⚠️ Alertas de Stock</div>
        {low.length===0&&<p style={{fontSize:13,color:C.green}}>Todo en niveles óptimos ✓</p>}
        {low.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
          <div><div style={{fontSize:13,fontWeight:500,color:C.text}}>{p.name}</div><div style={{fontSize:11,color:C.textMuted}}>Mín: {p.minStock} | Actual: {p.stock}</div></div>
          <Badge color={getStatus(p.stock,p.minStock)==="critical"?"red":"orange"}>{getStatus(p.stock,p.minStock)==="critical"?"Crítico":"Bajo"}</Badge>
        </div>)}
      </div>
    </div>
    {(businessType==="MANUFACTURER"||businessType==="HYBRID")&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
      <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:.8}}>🏭 Producción Activa</div>
      <div style={{display:"flex",gap:16}}>
        {[{name:"Pan Artesanal",qty:50,progress:65,st:"En proceso"},{name:"Galletas de Avena",qty:100,progress:30,st:"Preparando"},{name:"Pastel Chocolate",qty:10,progress:90,st:"Casi listo"}].map((p,i)=>
          <div key={i} style={{flex:1,background:C.bg,borderRadius:10,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>{p.name}</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{p.qty} unid · {p.st}</div>
            <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{width:`${p.progress}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accentLight})`,borderRadius:3}}/></div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:4,textAlign:"right"}}>{p.progress}%</div>
          </div>)}
      </div>
    </div>}
  </div>;
}

function InventoryPage({products,onEdit,onDelete}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const filtered=products.filter(p=>{
    if(filter==="low"&&getStatus(p.stock,p.minStock)==="ok")return false;
    if(filter==="commercial"&&p.type!=="COMMERCIAL")return false;
    if(filter==="manufactured"&&p.type!=="MANUFACTURED")return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.sku.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const fb=(k,l)=><button onClick={()=>setFilter(k)} style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${filter===k?C.accent:C.border}`,background:filter===k?C.purpleBg:"transparent",color:filter===k?C.accentLight:C.textMuted,fontSize:12,fontWeight:500,cursor:"pointer"}}>{l}</button>;
  return <div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto o SKU..." style={{flex:"1 1 200px",padding:"10px 16px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,outline:"none",fontFamily:font}}/>
      <div style={{display:"flex",gap:6}}>{fb("all","Todos")}{fb("low","Stock Bajo")}{fb("commercial","Comercial")}{fb("manufactured","Fabricado")}</div>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr .7fr .9fr .9fr .7fr .6fr",padding:"14px 20px",background:"rgba(108,92,231,.05)",borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:.8}}>
        <span>Producto</span><span>SKU</span><span>Categoría</span><span>Stock</span><span>Costo</span><span>Precio</span><span>Estado</span><span></span>
      </div>
      {filtered.map((p,i)=>{const st=getStatus(p.stock,p.minStock);return<div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr .7fr .9fr .9fr .7fr .6fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2?"rgba(255,255,255,.01)":"transparent"}}>
        <div><div style={{fontSize:13,fontWeight:500,color:C.text}}>{p.name}</div><Badge color={p.type==="MANUFACTURED"?"accent":"muted"} style={{marginTop:4}}>{p.type==="MANUFACTURED"?"Fabricado":"Comercial"}</Badge></div>
        <span style={{fontSize:12,color:C.textMuted,fontFamily:"monospace"}}>{p.sku}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{p.category}</span>
        <span style={{fontSize:13,fontWeight:600,color:st==="critical"?C.red:st==="low"?C.orange:C.text}}>{p.stock}</span>
        <span style={{fontSize:12,color:C.textMuted}}>L {p.costPrice.toFixed(2)}</span>
        <span style={{fontSize:13,fontWeight:500,color:C.text}}>L {p.salePrice.toFixed(2)}</span>
        <Badge color={st==="critical"?"red":st==="low"?"orange":"green"}>{st==="critical"?"Crítico":st==="low"?"Bajo":"OK"}</Badge>
        <RowActions onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)}/>
      </div>;})}
      {filtered.length===0&&<div style={{padding:40,textAlign:"center",color:C.textMuted,fontSize:13}}>No se encontraron productos.</div>}
    </div>
  </div>;
}

function OrdersPage({orders,onEdit,onDelete}){
  const pur=orders.filter(o=>o.type==="PURCHASE"&&o.status==="COMPLETED").reduce((s,o)=>s+o.total,0);
  const sal=orders.filter(o=>o.type==="SALE"&&o.status==="COMPLETED").reduce((s,o)=>s+o.total,0);
  return <div>
    <div style={{display:"flex",gap:16,marginBottom:24}}>
      <StatCard icon="📥" label="Compras" value={`L ${pur.toLocaleString()}`} sub={`${orders.filter(o=>o.type==="PURCHASE").length} órdenes`} color={C.accent}/>
      <StatCard icon="📤" label="Ventas" value={`L ${sal.toLocaleString()}`} sub={`${orders.filter(o=>o.type==="SALE").length} órdenes`} color={C.green}/>
      <StatCard icon="📊" label="Balance" value={`L ${(sal-pur).toLocaleString()}`} sub="ventas - compras" trend={sal>pur?5:-5} color={C.orange}/>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr .7fr 1.5fr 1fr .8fr .5fr .5fr",padding:"14px 20px",background:"rgba(108,92,231,.05)",borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:.8}}>
        <span>Orden</span><span>Fecha</span><span>Tipo</span><span>Proveedor</span><span>Total</span><span>Estado</span><span>Items</span><span></span>
      </div>
      {orders.map((o,i)=><div key={o.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr .7fr 1.5fr 1fr .8fr .5fr .5fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2?"rgba(255,255,255,.01)":"transparent"}}>
        <span style={{fontSize:13,fontWeight:600,color:C.accentLight,fontFamily:"monospace"}}>{o.id}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{o.date}</span>
        <Badge color={o.type==="PURCHASE"?"blue":"green"}>{o.type==="PURCHASE"?"Compra":"Venta"}</Badge>
        <span style={{fontSize:12,color:C.textMuted}}>{o.supplier}</span>
        <span style={{fontSize:13,fontWeight:600,color:C.text}}>L {o.total.toLocaleString()}</span>
        <Badge color={o.status==="COMPLETED"?"green":o.status==="PENDING"?"orange":"red"}>{o.status==="COMPLETED"?"Completada":o.status==="PENDING"?"Pendiente":"Cancelada"}</Badge>
        <span style={{fontSize:12,color:C.textMuted,textAlign:"center"}}>{o.items}</span>
        <RowActions onEdit={()=>onEdit(o)} onDelete={()=>onDelete(o.id)}/>
      </div>)}
    </div>
  </div>;
}

function SuppliersPage({suppliers,onEdit,onDelete}){
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
    {suppliers.map(s=><div key={s.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:24,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontSize:16,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{s.contact}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Badge color={s.type==="PRODUCT_SUPPLIER"?"green":s.type==="RAW_MATERIAL_SUPPLIER"?"orange":"accent"}>{s.type==="PRODUCT_SUPPLIER"?"Productos":s.type==="RAW_MATERIAL_SUPPLIER"?"Materia Prima":"Ambos"}</Badge>
          <RowActions onEdit={()=>onEdit(s)} onDelete={()=>onDelete(s.id)}/>
        </div>
      </div>
      <div style={{display:"flex",gap:20,fontSize:12,color:C.textMuted}}><span>📞 {s.phone}</span><span>📧 {s.email}</span></div>
      <div style={{marginTop:12,fontSize:12,color:C.textMuted}}><span style={{fontWeight:600,color:C.text}}>{s.products}</span> productos</div>
    </div>)}
  </div>;
}

function MovementsPage({movements}){
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
    <div style={{display:"grid",gridTemplateColumns:"1.2fr 2fr .6fr .6fr 2fr .8fr",padding:"14px 20px",background:"rgba(108,92,231,.05)",borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:.8}}>
      <span>Fecha</span><span>Producto</span><span>Tipo</span><span>Cant.</span><span>Razón</span><span>Usuario</span>
    </div>
    {movements.map((m,i)=><div key={m.id} style={{display:"grid",gridTemplateColumns:"1.2fr 2fr .6fr .6fr 2fr .8fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2?"rgba(255,255,255,.01)":"transparent"}}>
      <span style={{fontSize:12,color:C.textMuted,fontFamily:"monospace"}}>{m.date}</span>
      <span style={{fontSize:13,fontWeight:500,color:C.text}}>{m.product}</span>
      <Badge color={m.type==="IN"?"green":m.type==="OUT"?"red":"orange"}>{m.type==="IN"?"Entrada":m.type==="OUT"?"Salida":"Ajuste"}</Badge>
      <span style={{fontSize:13,fontWeight:600,color:m.type==="IN"?C.green:m.type==="OUT"?C.red:C.orange}}>{m.type==="IN"?"+":"-"}{Math.abs(m.quantity)}</span>
      <span style={{fontSize:12,color:C.textMuted}}>{m.reason}</span>
      <span style={{fontSize:12,color:C.textMuted}}>{m.user}</span>
    </div>)}
    {movements.length===0&&<div style={{padding:40,textAlign:"center",color:C.textMuted}}>Sin movimientos.</div>}
  </div>;
}

function RawMaterialsPage({materials,onEdit,onDelete}){
  return <div>
    <div style={{background:"rgba(108,92,231,.06)",border:"1px solid rgba(108,92,231,.2)",borderRadius:12,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:18}}>🏭</span><span style={{fontSize:13,color:C.accentLight}}>Módulo de manufactura — solo para negocios tipo <strong>Manufactura</strong> o <strong>Híbrido</strong></span>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr .5fr .5fr .5fr 1.5fr .5fr",padding:"14px 20px",background:"rgba(108,92,231,.05)",borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:.8}}>
        <span>Material</span><span>SKU</span><span>Stock</span><span>Unidad</span><span>Mín.</span><span>Proveedor</span><span></span>
      </div>
      {materials.map((m,i)=><div key={m.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr .5fr .5fr .5fr 1.5fr .5fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2?"rgba(255,255,255,.01)":"transparent"}}>
        <span style={{fontSize:13,fontWeight:500,color:C.text}}>{m.name}</span>
        <span style={{fontSize:12,color:C.textMuted,fontFamily:"monospace"}}>{m.sku}</span>
        <span style={{fontSize:13,fontWeight:600,color:m.stock<=m.minStock?C.red:C.text}}>{m.stock}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{m.unit}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{m.minStock}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{m.supplier}</span>
        <RowActions onEdit={()=>onEdit(m)} onDelete={()=>onDelete(m.id)}/>
      </div>)}
    </div>
  </div>;
}

// ─── Onboarding ─────────────────────────────────────────────────────────────
function Onboarding({onComplete}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [type,setType]=useState(null);
  const [anim,setAnim]=useState(false);
  const next=()=>{setAnim(true);setTimeout(()=>{setStep(s=>s+1);setAnim(false);},300);};
  const box={minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:font};
  const inner=(mw)=>({maxWidth:mw,width:"100%",padding:40,opacity:anim?0:1,transform:anim?"translateY(20px)":"none",transition:"all .3s ease"});
  const mainBtn=(ok,click,label)=><button onClick={click} disabled={!ok} style={{marginTop:24,width:"100%",padding:14,borderRadius:12,border:"none",background:ok?`linear-gradient(135deg,${C.accent},${C.accentLight})`:C.border,color:ok?"#fff":C.textMuted,fontSize:14,fontWeight:600,cursor:ok?"pointer":"default",boxShadow:ok?`0 4px 24px rgba(108,92,231,.3)`:"none"}}>{label}</button>;

  if(step===0)return<div style={box}><div style={{...inner(500),textAlign:"center"}}>
    <div style={{fontSize:56,marginBottom:24}}>📦</div>
    <h1 style={{fontSize:36,fontWeight:800,color:C.text,margin:0,letterSpacing:-1}}>Inventometrics<span style={{color:C.accent}}>GIA</span></h1>
    <p style={{color:C.textMuted,fontSize:15,margin:"16px 0 40px",lineHeight:1.7}}>Sistema de Gestión de Inventario Adaptativo.<br/>Se adapta automáticamente al tipo de negocio.</p>
    <button onClick={next} style={{padding:"14px 48px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accentLight})`,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",boxShadow:`0 4px 24px rgba(108,92,231,.3)`}}>Comenzar Demo →</button>
  </div></div>;

  if(step===1)return<div style={box}><div style={inner(440)}>
    <div style={{fontSize:11,color:C.accent,fontWeight:600,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>Paso 1 de 2</div>
    <h2 style={{fontSize:24,fontWeight:700,color:C.text,margin:"0 0 8px"}}>¿Cómo se llama tu negocio?</h2>
    <p style={{color:C.textMuted,fontSize:13,margin:"0 0 28px"}}>Aparecerá en reportes y facturas.</p>
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Pulpería Doña Rosa" style={{...inputStyle,fontSize:15,padding:"14px 18px"}} onKeyDown={e=>e.key==="Enter"&&name.trim()&&next()}/>
    {mainBtn(name.trim(),next,"Continuar →")}
  </div></div>;

  return<div style={box}><div style={inner(580)}>
    <div style={{fontSize:11,color:C.accent,fontWeight:600,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>Paso 2 de 2</div>
    <h2 style={{fontSize:24,fontWeight:700,color:C.text,margin:"0 0 8px"}}>¿Qué tipo de negocio es <span style={{color:C.accent}}>{name}</span>?</h2>
    <p style={{color:C.textMuted,fontSize:13,margin:"0 0 28px"}}>El sistema activará los módulos necesarios.</p>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {Object.entries(BUSINESS_TYPES).map(([k,bt])=><div key={k} onClick={()=>setType(k)} style={{padding:"20px 24px",borderRadius:14,border:`2px solid ${type===k?C.accent:C.border}`,background:type===k?C.purpleBg:C.surface,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:28}}>{bt.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600,color:C.text}}>{bt.label}</div>
            <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{k==="RETAIL"?"Compra y revende. Tiendas, pulperías.":k==="MANUFACTURER"?"Fabrica con materia prima. Panaderías, talleres.":"Revende y fabrica. Lo mejor de ambos."}</div>
          </div>
          {type===k&&<span style={{color:C.accent,fontSize:20}}>✓</span>}
        </div>
        {type===k&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(108,92,231,.2)"}}>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Módulos:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{bt.modules.map(m=><Badge key={m} color="accent">{m==="inventory"?"📦 Inventario":m==="orders"?"📋 Órdenes":m==="suppliers"?"🤝 Proveedores":m==="reports"?"📊 Reportes":m==="production"?"🏭 Producción":"🧪 Materia Prima"}</Badge>)}</div>
        </div>}
      </div>)}
    </div>
    {mainBtn(type,()=>onComplete(name,type),"Entrar al Sistema →")}
  </div></div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const [boarded,setBoarded]=useState(false);
  const [bizName,setBizName]=useState("");
  const [bizType,setBizType]=useState("HYBRID");
  const [page,setPage]=useState("dashboard");
  const [hover,setHover]=useState(null);
  const [products,setProducts]=useState(initProducts);
  const [orders,setOrders]=useState(initOrders);
  const [suppliers,setSuppliers]=useState(initSuppliers);
  const [movements,setMovements]=useState(initMovements);
  const [rawMats,setRawMats]=useState(initRawMaterials);
  const [modal,setModal]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [toast,setToast]=useState(null);
  const show=(msg,t="success")=>setToast({message:msg,type:t});
  const close=()=>setModal(null);
  const mfg=bizType==="MANUFACTURER"||bizType==="HYBRID";
  const bt=BUSINESS_TYPES[bizType]||BUSINESS_TYPES.HYBRID;

  // CRUD Products
  const saveProduct=f=>{const st=getStatus(f.stock,f.minStock);if(f.id){setProducts(ps=>ps.map(p=>p.id===f.id?{...f,status:st}:p));show(`"${f.name}" actualizado`);}else{setProducts(ps=>[...ps,{...f,id:nextId(ps),status:st}]);show(`"${f.name}" creado`);}close();};
  const delProduct=id=>{const p=products.find(x=>x.id===id);setConfirm({type:"product",id,name:p?.name});};
  // CRUD Orders
  const saveOrder=f=>{if(f.id){setOrders(os=>os.map(o=>o.id===f.id?{...f}:o));show(`${f.id} actualizada`);}else{const id=`ORD-${String(orders.length+42).padStart(4,"0")}`;const date=new Date().toISOString().split("T")[0];setOrders(os=>[{...f,id,date,supplier:f.type==="SALE"?"—":f.supplier},...os]);show(`${id} creada`);}close();};
  const delOrder=id=>setConfirm({type:"order",id,name:id});
  // CRUD Suppliers
  const saveSupplier=f=>{if(f.id){setSuppliers(ss=>ss.map(s=>s.id===f.id?{...f}:s));show(`"${f.name}" actualizado`);}else{setSuppliers(ss=>[...ss,{...f,id:nextId(ss),products:0}]);show(`"${f.name}" creado`);}close();};
  const delSupplier=id=>{const s=suppliers.find(x=>x.id===id);setConfirm({type:"supplier",id,name:s?.name});};
  // Movement
  const saveMovement=f=>{setMovements(ms=>[{id:nextId(ms),date:nowStr(),...f,user:"Admin"},...ms]);setProducts(ps=>ps.map(p=>{if(p.name===f.product){const ns=f.type==="IN"?p.stock+f.quantity:Math.max(0,p.stock-f.quantity);return{...p,stock:ns};}return p;}));show(`Movimiento registrado`);close();};
  // CRUD Raw
  const saveRaw=f=>{if(f.id){setRawMats(rs=>rs.map(r=>r.id===f.id?{...f}:r));show(`"${f.name}" actualizado`);}else{setRawMats(rs=>[...rs,{...f,id:nextId(rs)}]);show(`"${f.name}" creado`);}close();};
  const delRaw=id=>{const m=rawMats.find(x=>x.id===id);setConfirm({type:"raw",id,name:m?.name});};
  // Confirm
  const doConfirm=()=>{const{type:t,id,name:n}=confirm;if(t==="product")setProducts(ps=>ps.filter(p=>p.id!==id));else if(t==="order")setOrders(os=>os.filter(o=>o.id!==id));else if(t==="supplier")setSuppliers(ss=>ss.filter(s=>s.id!==id));else if(t==="raw")setRawMats(rs=>rs.filter(r=>r.id!==id));show(`"${n}" eliminado`,"error");setConfirm(null);};
  // Export
  const handleExport=()=>{
    if(page==="inventory")doExport("Inventario",["Nombre","SKU","Cat","Stock","Costo","Precio"],products.map(p=>[p.name,p.sku,p.category,p.stock,`L${p.costPrice}`,`L${p.salePrice}`]),bizName);
    else if(page==="orders")doExport("Órdenes",["ID","Fecha","Tipo","Proveedor","Total","Estado"],orders.map(o=>[o.id,o.date,o.type,o.supplier,`L${o.total}`,o.status]),bizName);
    else if(page==="suppliers")doExport("Proveedores",["Nombre","Tipo","Contacto","Tel","Email"],suppliers.map(s=>[s.name,s.type,s.contact,s.phone,s.email]),bizName);
    else if(page==="movements")doExport("Kardex",["Fecha","Producto","Tipo","Cant","Razón","User"],movements.map(m=>[m.date,m.product,m.type,m.quantity,m.reason,m.user]),bizName);
    else if(page==="raw_materials")doExport("Materia_Prima",["Nombre","SKU","Stock","Unidad","Mín","Proveedor"],rawMats.map(m=>[m.name,m.sku,m.stock,m.unit,m.minStock,m.supplier]),bizName);
    else doExport("Dashboard",["Métrica","Valor"],[["Productos",products.length],["Stock",products.reduce((s,p)=>s+p.stock,0)],["Valor",`L${products.reduce((s,p)=>s+p.stock*p.salePrice,0)}`],["Órdenes",orders.length],["Proveedores",suppliers.length]],bizName);
    show("Reporte exportado");
  };
  // New
  const handleNew=()=>{
    if(page==="inventory"||page==="dashboard")setModal({type:"product"});
    else if(page==="orders")setModal({type:"order"});
    else if(page==="suppliers")setModal({type:"supplier"});
    else if(page==="movements")setModal({type:"movement"});
    else if(page==="raw_materials")setModal({type:"raw"});
  };

  if(!boarded)return<Onboarding onComplete={(n,t)=>{setBizName(n);setBizType(t);setBoarded(true);}}/>;

  const nav=[{key:"dashboard",icon:"📊",label:"Dashboard"},{key:"inventory",icon:"📦",label:"Inventario"},{key:"movements",icon:"🔄",label:"Kardex"},{key:"orders",icon:"📋",label:"Órdenes"},{key:"suppliers",icon:"🤝",label:"Proveedores"},...(mfg?[{key:"raw_materials",icon:"🧪",label:"Materia Prima"}]:[])];
  const newLabel={dashboard:"+ Nuevo Producto",inventory:"+ Nuevo Producto",orders:"+ Nueva Orden",suppliers:"+ Nuevo Proveedor",movements:"+ Nuevo Movimiento",raw_materials:"+ Nuevo Material"};
  const pageDesc={dashboard:`Resumen de ${bizName}`,inventory:"Gestión de productos y stock",movements:"Entradas, salidas y ajustes",orders:"Órdenes de compra y venta",suppliers:"Directorio de proveedores",raw_materials:"Materias primas para producción"};

  return <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:font,color:C.text}}>
    <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    {confirm&&<ConfirmModal message={`¿Eliminar "${confirm.name}"?`} onConfirm={doConfirm} onCancel={()=>setConfirm(null)}/>}
    {modal?.type==="product"&&<ProductForm product={modal.data} onSave={saveProduct} onClose={close}/>}
    {modal?.type==="order"&&<OrderForm order={modal.data} suppliers={suppliers} onSave={saveOrder} onClose={close}/>}
    {modal?.type==="supplier"&&<SupplierForm supplier={modal.data} onSave={saveSupplier} onClose={close}/>}
    {modal?.type==="movement"&&<MovementForm products={products} onSave={saveMovement} onClose={close}/>}
    {modal?.type==="raw"&&<RawMaterialForm material={modal.data} suppliers={suppliers} onSave={saveRaw} onClose={close}/>}

    <aside style={{width:240,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"28px 24px 20px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:18,fontWeight:800,letterSpacing:-.5}}>Inventometrics<span style={{color:C.accent}}>GIA</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}><span style={{fontSize:16}}>{bt.icon}</span><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{bizName}</div><div style={{fontSize:10,color:C.textMuted}}>{bt.label}</div></div></div>
      </div>
      <nav style={{padding:"12px",flex:1}}>
        {nav.map(n=><button key={n.key} onClick={()=>setPage(n.key)} onMouseEnter={()=>setHover(n.key)} onMouseLeave={()=>setHover(null)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 14px",borderRadius:10,border:"none",background:page===n.key?C.purpleBg:hover===n.key?"rgba(255,255,255,.03)":"transparent",color:page===n.key?C.accentLight:C.textMuted,fontSize:13,fontWeight:page===n.key?600:400,cursor:"pointer",transition:"all .15s",textAlign:"left",marginBottom:2,borderLeft:page===n.key?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{fontSize:16}}>{n.icon}</span>{n.label}</button>)}
      </nav>
      <div style={{padding:"16px 20px",borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.accent},${C.accentLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>A</div>
          <div><div style={{fontSize:12,fontWeight:500,color:C.text}}>Admin</div><div style={{fontSize:10,color:C.textMuted}}>SUPER_ADMIN</div></div>
        </div>
      </div>
    </aside>

    <main style={{flex:1,padding:"28px 32px",overflowY:"auto",maxHeight:"100vh"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,margin:0,color:C.text}}>{nav.find(n=>n.key===page)?.icon} {nav.find(n=>n.key===page)?.label}</h1>
          <p style={{fontSize:13,color:C.textMuted,margin:"4px 0 0"}}>{pageDesc[page]}</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={handleExport} style={{padding:"9px 20px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:12,fontWeight:500,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.target.style.borderColor=C.accent} onMouseLeave={e=>e.target.style.borderColor=C.border}>📄 Exportar Reporte</button>
          <button onClick={handleNew} style={{padding:"9px 20px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accentLight})`,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",boxShadow:`0 2px 12px rgba(108,92,231,.3)`}} onMouseEnter={e=>e.target.style.transform="scale(1.03)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>{newLabel[page]}</button>
        </div>
      </div>
      {page==="dashboard"&&<DashboardPage products={products} orders={orders} movements={movements} businessType={bizType}/>}
      {page==="inventory"&&<InventoryPage products={products} onEdit={p=>setModal({type:"product",data:p})} onDelete={delProduct}/>}
      {page==="movements"&&<MovementsPage movements={movements}/>}
      {page==="orders"&&<OrdersPage orders={orders} onEdit={o=>setModal({type:"order",data:o})} onDelete={delOrder}/>}
      {page==="suppliers"&&<SuppliersPage suppliers={suppliers} onEdit={s=>setModal({type:"supplier",data:s})} onDelete={delSupplier}/>}
      {page==="raw_materials"&&<RawMaterialsPage materials={rawMats} onEdit={m=>setModal({type:"raw",data:m})} onDelete={delRaw}/>}
    </main>
  </div>;
}
