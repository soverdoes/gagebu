// 최소 DOM 으로 페이지 스크립트를 실제 실행해 본다 (로드 시 예외 잡기용)
import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const headHtml = html.slice(0, html.indexOf('<script>'));
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const IDS = [...headHtml.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);

class CL {
  constructor(o){ this.o=o; this.s=new Set(); }
  add(...c){ c.forEach(x=>x&&this.s.add(x)); }
  remove(...c){ c.forEach(x=>this.s.delete(x)); }
  toggle(c,f){ if(f===undefined) f=!this.s.has(c); f?this.s.add(c):this.s.delete(c); }
  contains(c){ return this.s.has(c); }
}
class Style {
  constructor(){ return new Proxy(this,{ get:(t,k)=> k==='cssText'?'':(t[k]??''), set:(t,k,v)=>{t[k]=v;return true;} }); }
}
let nodeSeq = 0;
class El {
  constructor(tag){
    this.tagName=String(tag).toUpperCase(); this.children=[]; this.parentElement=null;
    this._cls=''; this.textContent=''; this.style=new Style(); this.classList=new CL(this);
    this.dataset={}; this.attrs={}; this._listeners={}; this.hidden=false; this.value='';
    this.id=''; this.title=''; this.tabIndex=0; this._n=++nodeSeq;
  }
  get className(){ return [this._cls, ...this.classList.s].filter(Boolean).join(' '); }
  set className(v){ this._cls=v||''; }
  appendChild(c){ if(c){ c.parentElement=this; this.children.push(c); } return c; }
  removeChild(c){ this.children=this.children.filter(x=>x!==c); return c; }
  remove(){ if(this.parentElement) this.parentElement.removeChild(this); }
  set innerHTML(v){ if(!v) this.children=[]; this._html=v; }
  get innerHTML(){ return this._html||''; }
  addEventListener(t,f){ (this._listeners[t]=this._listeners[t]||[]).push(f); }
  removeEventListener(){}
  setAttribute(k,v){ this.attrs[k]=String(v); if(k==='id') this.id=v; }
  getAttribute(k){ return this.attrs[k]; }
  hasAttribute(k){ return k in this.attrs; }
  removeAttribute(k){ delete this.attrs[k]; }
  focus(){ doc.activeElement=this; }
  blur(){ if(doc.activeElement===this) doc.activeElement=null; }
  select(){}
  setSelectionRange(){}
  scrollIntoView(){}
  getBoundingClientRect(){ return {top:10,left:10,bottom:30,right:200,width:190,height:20}; }
  get offsetWidth(){ return 300; }
  get offsetHeight(){ return 160; }
  matches(sel){ return /input|select/.test(sel) && /INPUT|SELECT|TEXTAREA/.test(this.tagName); }
  closest(sel){ let n=this; const want=sel.replace(/^[.#]/,'');
    while(n){ if(n.className.split(' ').includes(want)||n.id===want) return n; n=n.parentElement; } return null; }
  _all(){ return this.children.flatMap(c=>[c, ...c._all()]); }
  querySelector(s){ return this._all().find(n=>match(n,s)) || null; }
  querySelectorAll(s){ return this._all().filter(n=>match(n,s)); }
  fire(t, ev={}){ (this._listeners[t]||[]).forEach(f=>f({preventDefault(){}, stopPropagation(){}, target:this, ...ev})); }
}
function match(n, sel){
  return sel.split(',').some(one=>{
    one=one.trim().split(/\s+/).pop();
    if(one.startsWith('#')) return n.id===one.slice(1);
    if(one.startsWith('.')) return n.className.split(' ').includes(one.slice(1));
    return n.tagName===one.toUpperCase();
  });
}

const doc = new El('document');
doc.documentElement = new El('html');
doc.body = new El('body');
doc.activeElement = null;
doc.createElement = t => new El(t);
doc.createTextNode = t => { const n=new El('#text'); n.textContent=String(t); return n; };
doc.addEventListener = El.prototype.addEventListener.bind(doc);
IDS.forEach(id => { const e=new El('div'); e.id=id; doc.appendChild(e); });

const store = new Map();
const win = {
  document: doc,
  localStorage: { getItem:k=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)),
                  removeItem:k=>store.delete(k) },
  addEventListener(){}, scrollTo(){}, scrollY:0, innerWidth:1440, innerHeight:900,
  requestAnimationFrame(f){ f(); }, setTimeout, clearTimeout, setInterval, clearInterval,
  getComputedStyle: () => ({ getPropertyValue: p => ({'--pA':'#1F6FB2','--pB':'#C56A16','--bar':'#0E8A72'}[p]||'#000') }),
  IntersectionObserver: class { observe(){} disconnect(){} },
  Intl, JSON, Math, Date, isNaN, parseFloat, console, URL:{createObjectURL:()=> 'blob:x', revokeObjectURL(){}},
  Blob: class {}, FileReader: class { readAsText(){} },
};
win.window = win;

const errors = [];
process.on('uncaughtException', e => errors.push('uncaught: ' + e.message));
process.on('unhandledRejection', e => errors.push('rejected: ' + (e && e.message || e)));

try {
  const fn = new Function('window','document','localStorage','getComputedStyle','IntersectionObserver',
                          'requestAnimationFrame','Blob','FileReader','URL','navigator','alert', script);
  fn(win, doc, win.localStorage, win.getComputedStyle, win.IntersectionObserver,
     win.requestAnimationFrame, win.Blob, win.FileReader, win.URL, {}, ()=>{});
  console.log('스크립트 로드: 예외 없음');
} catch (e) {
  console.log('스크립트 로드 실패 ✗ :', e.message);
  console.log(e.stack.split('\n').slice(0,4).join('\n'));
  process.exitCode = 1;
}

setTimeout(() => {
  const ledger = doc.querySelector('#ledger');
  const sections = doc.querySelector('#a-sections');
  const total = doc.querySelector('#a-total');
  const rows = ledger ? ledger.querySelectorAll('.row').length : 0;
  const chk = ledger ? ledger.querySelectorAll('.chk').length : 0;
  const memo = sections ? sections.querySelectorAll('.memo-cell').length : 0;
  const tbl = sections ? sections.querySelectorAll('table').length : 0;
  const asec = sections ? sections.querySelectorAll('.asec').length : 0;
  console.log('가계부 행 수      :', rows, '| 체크박스', chk);
  console.log('자산 큰 섹션 수   :', asec, '| 표', tbl, '| 메모 셀', memo);
  console.log('총액 스트립 자식  :', total ? total.children.length : 0);
  console.log('비동기 오류       :', errors.length ? errors : '없음');
  if (!rows || asec !== 2 || !memo) process.exitCode = 1;

  const undoBtn = doc.querySelector('#btn-undo');
  console.log('실행취소 버튼      :', undoBtn ? '있음' : '없음');
  console.log('식생품 패널        :', doc.querySelector('#grocery') ? '있음' : '없음');
  console.log('드래그 손잡이      :', doc.querySelector('#ledger').querySelectorAll('.grip').length + '개');
  const acct = doc.querySelector('#btn-account');
  console.log('계정 버튼          :', acct ? (acct.hidden ? '숨김(설정 없음 — 정상)' : '보임') : '없음');
  console.log('테마 버튼          :', doc.querySelector('#btn-theme').textContent || '(빈값)');
}, 400);
