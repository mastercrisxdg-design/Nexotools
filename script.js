const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
$("#year").textContent = new Date().getFullYear();

const modal = $("#toolModal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const toast = $("#toast");
let toastTimer;
function notify(message){ toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2400); }
function escapeHtml(value){return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function openTool(name){
  const views = {
    percentage: ["Calculadora de porcentajes", percentageView],
    qr: ["Generador de códigos QR", qrView],
    wordcount: ["Contador de palabras", wordCountView],
    json: ["Formateador de JSON", jsonView],
    password: ["Generador de contraseñas", passwordView],
    units: ["Conversor de unidades", unitsView]
  };
  if(!views[name]) return;
  modalTitle.textContent=views[name][0]; modalBody.innerHTML=views[name][1](); modal.hidden=false; document.body.style.overflow="hidden";
  if(name==="wordcount") updateWordCount();
  if(name==="units") convertUnits();
  const first = $("input, textarea, select, button", modalBody); if(first) first.focus();
}
function closeTool(){modal.hidden=true;document.body.style.overflow="";}
$$(".tool-card").forEach(card=>card.addEventListener("click",()=>openTool(card.dataset.tool)));
$("#closeModal").addEventListener("click",closeTool);
modal.addEventListener("click",e=>{if(e.target===modal)closeTool();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeTool();});

function percentageView(){return `
  <div class="field"><label for="pctBase">Número base</label><input id="pctBase" type="number" step="any" placeholder="Ej. 250"></div>
  <div class="field"><label for="pctPercent">Porcentaje (%)</label><input id="pctPercent" type="number" step="any" placeholder="Ej. 15"></div>
  <div class="button-row"><button class="action-button" id="pctCalc">Calcular porcentaje</button><button class="action-button secondary" id="pctDiscount">Calcular descuento</button><button class="action-button secondary" id="pctIncrease">Calcular aumento</button></div>
  <div class="result-box" id="pctResult" aria-live="polite">Introduce dos números para comenzar.</div>`;
}
function runPercent(mode){
  const base=Number($("#pctBase").value), p=Number($("#pctPercent").value), out=$("#pctResult");
  if($("#pctBase").value.trim()===""||$("#pctPercent").value.trim()===""||!Number.isFinite(base)||!Number.isFinite(p)){out.textContent="Introduce valores numéricos válidos.";return;}
  const fmt=n=>new Intl.NumberFormat("es-PE",{maximumFractionDigits:8}).format(n);
  const amount=base*p/100;
  if(mode==="pct") out.innerHTML=`<div class="muted">${fmt(p)}% de ${fmt(base)} es</div><div class="result-value">${fmt(amount)}</div>`;
  if(mode==="discount") out.innerHTML=`<div class="muted">Descuento: ${fmt(p)}% de ${fmt(base)}</div><div class="result-value">${fmt(base-amount)}</div><div class="muted">Ahorro: ${fmt(amount)}</div>`;
  if(mode==="increase") out.innerHTML=`<div class="muted">${fmt(base)} aumentado en ${fmt(p)}%</div><div class="result-value">${fmt(base+amount)}</div><div class="muted">Aumento: ${fmt(amount)}</div>`;
}
function qrView(){return `<div class="field"><label for="qrText">Enlace o texto</label><textarea id="qrText" placeholder="https://ejemplo.com" maxlength="1500"></textarea></div><button class="action-button" id="makeQr">Generar código QR</button><div id="qrOutput" class="qr-output"></div><p class="muted">La generación del QR requiere conexión a internet para cargar la librería externa. Comprueba el contenido antes de compartirlo.</p>`;}
function wordCountView(){return `<div class="field"><label for="wcText">Escribe o pega tu texto</label><textarea id="wcText" rows="7" placeholder="Empieza a escribir aquí..."></textarea></div><div class="form-row"><div class="result-box"><div class="muted">Palabras</div><div class="result-value" id="wcWords">0</div></div><div class="result-box"><div class="muted">Caracteres</div><div class="result-value" id="wcChars">0</div></div><div class="result-box"><div class="muted">Sin espacios</div><div class="result-value" id="wcNoSpaces">0</div></div><div class="result-box"><div class="muted">Frases aprox.</div><div class="result-value" id="wcSentences">0</div></div></div><div class="button-row"><button class="action-button secondary" id="wcCopy">Copiar texto</button><button class="action-button secondary" id="wcClear">Limpiar</button></div>`;}
function updateWordCount(){const el=$("#wcText");if(!el)return;const t=el.value.trim();$("#wcWords").textContent=t?t.split(/\s+/u).length:0;$("#wcChars").textContent=el.value.length;$("#wcNoSpaces").textContent=el.value.replace(/\s/g,"").length;$("#wcSentences").textContent=t?(t.match(/[.!?]+(?=\s|$)/g)||[]).length||1:0;}
function jsonView(){return `<div class="field"><label for="jsonInput">JSON de entrada</label><textarea id="jsonInput" rows="8" spellcheck="false" placeholder='{"nombre":"NexoTools","activo":true}'></textarea></div><div class="form-row"><div class="field"><label for="jsonIndent">Indentación</label><select id="jsonIndent"><option value="2">2 espacios</option><option value="4">4 espacios</option><option value="0">Compacto</option></select></div><div class="field"><label>Acción</label><button class="action-button" id="formatJson">Validar y formatear</button></div></div><div class="result-box" id="jsonResult" aria-live="polite">El resultado aparecerá aquí.</div><div class="button-row"><button class="action-button secondary" id="copyJson">Copiar resultado</button><button class="action-button secondary" id="clearJson">Limpiar</button></div>`;}
function passwordView(){return `<div class="field"><label for="pwLength">Longitud: <strong id="pwLengthLabel">16</strong> caracteres</label><input id="pwLength" type="range" min="8" max="64" value="16"></div><div class="inline-options"><label><input type="checkbox" id="pwLower" checked> Minúsculas</label><label><input type="checkbox" id="pwUpper" checked> Mayúsculas</label><label><input type="checkbox" id="pwNumbers" checked> Números</label><label><input type="checkbox" id="pwSymbols" checked> Símbolos</label></div><button class="action-button" id="makePassword">Generar contraseña</button><div class="result-box"><div class="muted">Tu contraseña</div><div id="pwOutput" class="password-output">Pulsa “Generar contraseña”.</div></div><div class="button-row"><button class="action-button secondary" id="copyPassword">Copiar contraseña</button></div><p class="muted">Se genera en tu navegador. No reutilices contraseñas y considera un gestor de contraseñas para guardarlas.</p>`;}
const unitTypes = {
  length:{label:"Longitud",units:{"Milímetros":.001,"Centímetros":.01,"Metros":1,"Kilómetros":1000,"Pulgadas":.0254,"Pies":.3048,"Yardas":.9144,"Millas":1609.344}},
  weight:{label:"Peso / masa",units:{"Miligramos":.000001,"Gramos":.001,"Kilogramos":1,"Toneladas métricas":1000,"Onzas":.028349523125,"Libras":.45359237}},
  temp:{label:"Temperatura",units:{"Celsius":1,"Fahrenheit":1,"Kelvin":1}}
};
function unitsView(){return `<div class="unit-tabs"><button class="active" data-unit="length">Longitud</button><button data-unit="weight">Peso</button><button data-unit="temp">Temperatura</button></div><div class="field"><label for="unitValue">Valor</label><input id="unitValue" type="number" step="any" value="1"></div><div class="form-row"><div class="field"><label for="unitFrom">De</label><select id="unitFrom"></select></div><div class="field"><label for="unitTo">A</label><select id="unitTo"></select></div></div><div class="result-box"><div class="muted">Resultado</div><div id="unitResult" class="result-value">—</div></div><div class="button-row"><button class="action-button secondary" id="swapUnits">Intercambiar unidades ⇄</button></div>`;}
let activeUnit="length";
function populateUnits(){const type=unitTypes[activeUnit],from=$("#unitFrom"),to=$("#unitTo");if(!from||!to)return;const names=Object.keys(type.units);from.innerHTML=names.map((n,i)=>`<option ${i===0?"selected":""}>${n}</option>`).join("");to.innerHTML=names.map((n,i)=>`<option ${i===(activeUnit==="temp"?1:1)?"selected":""}>${n}</option>`).join("");convertUnits();}
function convertTemperature(v,from,to){let c=from==="Celsius"?v:from==="Fahrenheit"?(v-32)*5/9:v-273.15;return to==="Celsius"?c:to==="Fahrenheit"?c*9/5+32:c+273.15;}
function convertUnits(){const val=$("#unitValue"),from=$("#unitFrom"),to=$("#unitTo"),out=$("#unitResult");if(!val||!from||!to||!out)return;const v=Number(val.value);if(val.value.trim()===""||!Number.isFinite(v)){out.textContent="Introduce un valor válido";return;}let result;if(activeUnit==="temp")result=convertTemperature(v,from.value,to.value);else result=v*unitTypes[activeUnit].units[from.value]/unitTypes[activeUnit].units[to.value];out.textContent=new Intl.NumberFormat("es-PE",{maximumFractionDigits:10}).format(result)+" "+to.value;}
function randomInt(max){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%(max);}
function generatePassword(){const sets=[];if($("#pwLower").checked)sets.push("abcdefghijkmnopqrstuvwxyz");if($("#pwUpper").checked)sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");if($("#pwNumbers").checked)sets.push("23456789");if($("#pwSymbols").checked)sets.push("!@#$%^&*()-_=+[]{}?");if(!sets.length){notify("Selecciona al menos un tipo de carácter.");return;}const length=Number($("#pwLength").value);let chars=sets.map(s=>s[randomInt(s.length)]);const all=sets.join("");while(chars.length<length)chars.push(all[randomInt(all.length)]);for(let i=chars.length-1;i>0;i--){const j=randomInt(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}$("#pwOutput").textContent=chars.join("");}
async function copyText(text){if(!text){notify("No hay contenido para copiar.");return;}try{await navigator.clipboard.writeText(text);notify("Copiado al portapapeles.");}catch{const area=document.createElement("textarea");area.value=text;document.body.appendChild(area);area.select();document.execCommand("copy");area.remove();notify("Copiado al portapapeles.");}}

modalBody.addEventListener("click",async e=>{
  const id=e.target.id;
  if(id==="pctCalc")runPercent("pct");if(id==="pctDiscount")runPercent("discount");if(id==="pctIncrease")runPercent("increase");
  if(id==="makeQr"){const value=$("#qrText").value.trim(),output=$("#qrOutput");output.innerHTML="";if(!value){notify("Escribe un enlace o texto primero.");return;}if(!window.QRCode){output.innerHTML='<p class="muted">No se pudo cargar la librería QR. Comprueba tu conexión e inténtalo de nuevo.</p>';return;}new QRCode(output,{text:value,width:220,height:220,colorDark:"#101828",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});}
  if(id==="wcCopy")copyText($("#wcText").value);if(id==="wcClear"){$("#wcText").value="";updateWordCount();}
  if(id==="formatJson"){const input=$("#jsonInput").value;try{const parsed=JSON.parse(input);const indent=Number($("#jsonIndent").value);$("#jsonResult").innerHTML='<div class="muted" style="color:#11956b;font-weight:700;margin-bottom:8px">✓ JSON válido</div><div class="json-output" id="jsonFormatted"></div>';$("#jsonFormatted").textContent=JSON.stringify(parsed,null,indent);}catch(err){$("#jsonResult").innerHTML=`<div style="color:#c03955;font-weight:700">JSON no válido</div><div class="muted">${escapeHtml(err.message)}</div>`;}}
  if(id==="copyJson"){const formatted=$("#jsonFormatted");if(formatted)copyText(formatted.textContent);else notify("Primero valida y formatea un JSON.");}
  if(id==="clearJson"){$("#jsonInput").value="";$("#jsonResult").textContent="El resultado aparecerá aquí.";}
  if(id==="makePassword")generatePassword();if(id==="copyPassword")copyText($("#pwOutput").textContent.includes("Pulsa")?"":$("#pwOutput").textContent);
  if(id==="swapUnits"){const f=$("#unitFrom"),t=$("#unitTo");[f.value,t.value]=[t.value,f.value];convertUnits();}
  if(e.target.matches("[data-unit]")){activeUnit=e.target.dataset.unit;$$("[data-unit]",modalBody).forEach(b=>b.classList.toggle("active",b===e.target));populateUnits();}
});
modalBody.addEventListener("input",e=>{if(e.target.id==="wcText")updateWordCount();if(e.target.id==="pwLength")$("#pwLengthLabel").textContent=e.target.value;if(e.target.id==="unitValue")convertUnits();});
modalBody.addEventListener("change",e=>{if(["unitFrom","unitTo"].includes(e.target.id))convertUnits();});
const originalOpenTool=openTool;
openTool=function(name){originalOpenTool(name);if(name==="units")populateUnits();};
