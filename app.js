const $ = (s) => document.querySelector(s);
const state = { projects: [], filter: "ALL" };
const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const CONTACT_ICON_IDS = new Set(["none","email","wechat","bilibili","xiaohongshu","douyin","youtube","instagram","website","phone","link"]);
function contactIconSvg(id="link"){
 const common='viewBox="0 0 32 32"';
 const icons={
  email:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="24" height="18" rx="3"/><path d="m5 9 11 9 11-9"/></svg>`,
  wechat:`<svg ${common} viewBox="0 0 32 32"><path fill="currentColor" d="M13.1 5.1C7.4 5.1 3 8.6 3 13c0 2.6 1.5 4.8 4.1 6.2l-.9 3.1 3.8-1.8c.9.2 1.9.4 3.1.4-.4-.9-.6-1.8-.6-2.8 0-4.1 3.9-7.4 8.8-7.4h.8c-1.1-3.2-4.7-5.6-9-5.6Zm-3.6 6.6a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm7.1 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/><path fill="currentColor" d="M29 19.2c0-3.4-3.5-6.1-7.8-6.1s-7.8 2.7-7.8 6.1 3.5 6.1 7.8 6.1c.8 0 1.6-.1 2.4-.3l3 1.3-.7-2.4c1.9-1.1 3.1-2.8 3.1-4.7Zm-10.6-1.4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`,
  bilibili:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 4 4 4m6-4-4 4"/><rect x="4" y="9" width="24" height="18" rx="4"/><path d="M11 15v6m10-6v6M4 15H2m28 0h-2"/></svg>`,
  xiaohongshu:`<svg ${common} viewBox="0 0 32 32"><rect x="2" y="3" width="28" height="26" rx="6" fill="currentColor"/><text x="16" y="19.4" text-anchor="middle" fill="#fff" font-size="7.3" font-weight="700" font-family="Arial,sans-serif">小红书</text></svg>`,
  douyin:`<svg ${common} viewBox="0 0 32 32"><path d="M19 4v15.1a5.2 5.2 0 1 1-4-5.1" fill="none" stroke="#25F4EE" stroke-width="3.4" stroke-linecap="round"/><path d="M21 3v15.1a5.2 5.2 0 1 1-4-5.1" fill="none" stroke="#FE2C55" stroke-width="3.4" stroke-linecap="round"/><path d="M20 4v15.1a5.2 5.2 0 1 1-4-5.1M20 4c1.3 3 3.4 4.7 6.4 5.2" fill="none" stroke="#171717" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  youtube:`<svg ${common} viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="18" rx="5" fill="currentColor"/><path d="m13 11 8 5-8 5z" fill="#fff"/></svg>`,
  instagram:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="24" height="24" rx="7"/><circle cx="16" cy="16" r="5.5"/><circle cx="23.3" cy="8.9" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  website:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c4 4 5.5 8 5.5 12S20 24 16 28M16 4c-4 4-5.5 8-5.5 12S12 24 16 28"/></svg>`,
  phone:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h4l2 6-3 2a20 20 0 0 0 8 8l2-3 6 2v4c0 2-1.5 3.5-3.5 3.5C14 26.5 5.5 18 5.5 7.5 5.5 5.5 7 4 9 4Z"/></svg>`,
  link:`<svg ${common} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m13 19-2 2a5 5 0 0 1-7-7l4-4a5 5 0 0 1 7 0m4 3 2-2a5 5 0 0 1 7 7l-4 4a5 5 0 0 1-7 0m-6-6h12"/></svg>`
 };
 return id==="none"?"":(icons[id]||icons.link);
}

const PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#20201e"/><text x="8" y="4.7" font-size="0.65" fill="#92918d" text-anchor="middle" dominant-baseline="middle" font-family="monospace" letter-spacing="0.08">NO COVER</text></svg>'
);

/* 封面路径：中文/空格做一次安全编码，data:/http(s) 直接返回 */
function coverUrl(p){
  const s = String(p || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^(data:|blob:|https?:)/i.test(s)) return s;
  try {
    return encodeURI(decodeURI(s));
  } catch (e) {
    return encodeURI(s);
  }
}

function normalizeEmbed(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  let src = s;
  const match = s.match(/src\s*=\s*["']([^"']+)["']/i);
  if (match) src = match[1];
  if (src.startsWith("//")) src = "https:" + src;
  try {
    const u = new URL(src);
    const allowed = ["player.bilibili.com", "www.youtube-nocookie.com", "www.youtube.com", "player.vimeo.com"];
    if (allowed.includes(u.hostname)) return u.href;
    if (u.hostname === "open.douyin.com" && u.pathname === "/player/video" && u.searchParams.get("vid")) return u.href;
    if ((u.hostname === "www.douyin.com" || u.hostname === "douyin.com") && /^\/video\/\d+/.test(u.pathname)) {
      const id = u.pathname.match(/^\/video\/(\d+)/)[1];
      return `https://open.douyin.com/player/video?vid=${id}&autoplay=1`;
    }
    if (u.protocol === "https:" && /\.(mp4|webm)(\?.*)?$/i.test(u.pathname + u.search)) return u.href;
  } catch (e) {}
  return "";
}
function isDirectVideo(url=""){return /\.(mp4|webm)(\?.*)?$/i.test(url);}
function videoPlatform(url=""){try{return new URL(url).hostname.includes("bilibili.com")?"BILIBILI":new URL(url).hostname.toUpperCase()}catch(e){return "VIDEO"}}
function visibleProjects(){return state.projects.filter(p=>p.published!==false && (state.filter==="ALL"||p.category===state.filter)).sort((a,b)=>(a.order||0)-(b.order||0));}
function renderFilters(){
 const cats=[...new Set(state.projects.filter(p=>p.published!==false).map(p=>p.category||"OTHER"))];
 $("#filters").innerHTML=["ALL",...cats].map(c=>`<button class="filter-button ${state.filter===c?"active":""}" data-filter="${esc(c)}">${c==="ALL"?"全部作品":esc(c)}</button>`).join("");
 $("#filters").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.filter=b.dataset.filter;renderFilters();renderGrid()}));
}
function renderGrid(){
 const projects=visibleProjects();
 const published=state.projects.filter(p=>p.published!==false);
 const countEl=$("#workCount");
 if(countEl) countEl.textContent=String(published.length).padStart(2,"0");
 $("#workGrid").innerHTML=projects.length?projects.map((p,i)=>{
   const cover = coverUrl(p.cover);
   const meta = [p.category||"", p.subtitle||""].filter(Boolean).join(" · ");
   return `<article class="work-card" tabindex="0" role="button" data-id="${esc(p.id)}" aria-label="查看 ${esc(p.title)}"><div class="work-image" style="display:block;position:relative;width:100%;height:auto;aspect-ratio:16/9;overflow:hidden"><img style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center" decoding="async" src="${esc(cover)}" data-fallback="${esc(PLACEHOLDER)}" alt="${esc(p.title)}"><span class="play-indicator">↗</span></div><div class="work-meta"><div><h3>${esc(p.title)}</h3><p>${esc(meta)}</p></div><span class="work-index">${String(i+1).padStart(2,"0")}</span></div></article>`;
 }).join(""):`<div class="empty-state">${state.filter==="ALL"?"目前没有展示中的作品。":"这个分类暂时没有作品。"}</div>`;

 $("#workGrid").querySelectorAll(".work-image img").forEach(img=>{
   img.addEventListener("error", function onErr(){
     img.removeEventListener("error", onErr);
     img.src = img.dataset.fallback || PLACEHOLDER;
   });
 });

 $("#workGrid").querySelectorAll(".work-card").forEach(card=>{const open=()=>openProject(card.dataset.id);card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}})});
}

/* ===== 抖音播放器自适应缩放 ===== */
let douyinResizeHandler = null;
let douyinObserver = null;

function clearDouyinResize(){
  if (douyinResizeHandler) {
    window.removeEventListener("resize", douyinResizeHandler);
    douyinResizeHandler = null;
  }
  if (douyinObserver) {
    douyinObserver.disconnect();
    douyinObserver = null;
  }
}

function fitDouyin(box, allowRetry){
  const wrap = box.querySelector(".douyin-scale-wrap");
  if (!wrap) return;
  const iframe = wrap.querySelector("iframe");
  if (!iframe) return;
  const portrait = box.classList.contains("portrait-player");
  const baseW = portrait ? 720 : 1280;
  const baseH = portrait ? 1280 : 720;
  iframe.style.width  = baseW + "px";
  iframe.style.height = baseH + "px";
  wrap.style.width  = baseW + "px";
  wrap.style.height = baseH + "px";
  const availW = box.clientWidth;
  const availH = box.clientHeight;
  if (!availW || !availH) {
    if (allowRetry !== false) setTimeout(() => fitDouyin(box, false), 100);
    return;
  }
  const scale = Math.min(availW / baseW, availH / baseH);
  wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
/* ===== 抖音播放器适配结束 ===== */

function openProject(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 $("#modalCategory").textContent=p.category||"PROJECT";$("#modalTitle").textContent=p.title||"Untitled";$("#modalSubtitle").textContent=p.subtitle||"";
 $("#modalDescription").textContent=p.description||"";
 $("#modalTags").innerHTML=(p.tags||[]).map(t=>`<span class="modal-tag">${esc(t)}</span>`).join("");
 const url=normalizeEmbed(p.embed||"");const box=$("#modalVideo");
 const isDouyin=!!url && new URL(url).hostname==="open.douyin.com";
 const portrait=isDouyin && p.orientation==="portrait";
 box.classList.toggle("douyin-player",isDouyin);
 box.classList.toggle("portrait-player",portrait);
 clearDouyinResize();

 if(url){
   if(isDirectVideo(url)){
     box.innerHTML=`<video controls playsinline src="${esc(url)}"></video>`;
   }else if(isDouyin){
     const iframeUrl=url.replace(/([?&])autoplay=0(&|$)/,"$1autoplay=1$2")
                        .replace(/([?&])muted=[^&]*/,"")
                        + (url.includes("?") ? "&" : "?") + "muted=1";
     const baseW=portrait?720:1280, baseH=portrait?1280:720;
     box.innerHTML=`<div class="douyin-scale-wrap" style="width:${baseW}px;height:${baseH}px"><iframe src="${esc(iframeUrl)}" width="${baseW}" height="${baseH}" style="width:${baseW}px;height:${baseH}px" title="${esc(p.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" scrolling="no" referrerpolicy="unsafe-url" allowfullscreen></iframe></div>`;
     douyinResizeHandler=()=>fitDouyin(box);
     window.addEventListener("resize",douyinResizeHandler);
     if ("ResizeObserver" in window) {
       douyinObserver = new ResizeObserver(() => fitDouyin(box, false));
       douyinObserver.observe(box);
     }
     requestAnimationFrame(()=>requestAnimationFrame(()=>fitDouyin(box)));
   }else{
     box.innerHTML=`<iframe src="${esc(url)}" title="${esc(p.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" scrolling="no" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
   }
 }else{
   box.innerHTML=`<div style="position:absolute;inset:0;display:grid;place-items:center;color:#999;font-size:13px">请在管理后台添加有效的视频嵌入代码</div>`;
 }

 const ext=$("#originalLink");if(url){ext.style.display="inline-flex";ext.href=url}else{ext.style.display="none";ext.removeAttribute("href")}
 $("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false");document.body.classList.add("no-scroll");$("#modalClose").focus();
}

function closeModal(){
 clearDouyinResize();
 $("#modal").classList.remove("open");
 $("#modal").setAttribute("aria-hidden","true");
 $("#modalVideo").innerHTML="";
 document.body.classList.remove("no-scroll");
}

$("#modalClose").addEventListener("click",closeModal);
$("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

function applySiteSettings(s={}){
 const setText=(selector,value)=>{const el=$(selector);if(el&&value!==undefined&&value!==null)el.textContent=value;};
 setText("#heroIntro",s.heroIntro);
 if(s.heroKicker!==undefined){const kicker=document.querySelector(".hero-kicker");if(kicker)kicker.innerHTML='<span></span> '+esc(s.heroKicker);}
 setText(".hero-copy h1",s.heroTitle);
 setText(".hero-caption",s.heroCaption);
 if(s.heroImage){const heroImage=document.querySelector(".hero-image");if(heroImage&&heroImage.getAttribute("src")!==s.heroImage)heroImage.src=s.heroImage;}
 setText("#aboutTitle",s.aboutTitle||"关于我");
 setText("#aboutText",s.aboutText);
 setText("#aboutNote",s.aboutNote);
 setText("#contactTitle",s.contactTitle||"联系合作");
 setText("#contactText",s.contactText);
 setText("#footerName",s.footerName||"鱼肠 YuChang");
 if(Array.isArray(s.skills))$("#skills").innerHTML=s.skills.map(x=>`<span class="skill">${esc(x)}</span>`).join("");
 const contactHost=$("#contactMethods");
 if(contactHost){
   let methods=Array.isArray(s.contactMethods)?s.contactMethods:[];
   // Backward compatibility with older site-settings.json files that only had an email field.
   if(!methods.length&&s.email)methods=[{name:"Email",value:s.email,url:`mailto:${s.email}`}];
   contactHost.innerHTML=methods.filter(item=>item&&(item.name||item.value)).map(item=>{
     const name=esc(item.name||"联系");const value=esc(item.value||"");
     const rawUrl=(item.url||"").trim();
     const safeUrl=/^(https?:\/\/|mailto:|weixin:\/\/)/i.test(rawUrl)?rawUrl:"";
     const content=safeUrl?`<a href="${esc(safeUrl)}"${/^https?:\/\//i.test(safeUrl)?' target="_blank" rel="noopener noreferrer"':''}>${value}</a>`:`<span class="contact-value">${value}</span>`;
     const iconId=CONTACT_ICON_IDS.has(item.icon)?item.icon:(/e-?mail/i.test(item.name||"")?"email":/微信/.test(item.name||"")?"wechat":/bilibili|哔哩|B站/i.test(item.name||"")?"bilibili":/小红书/.test(item.name||"")?"xiaohongshu":/抖音/.test(item.name||"")?"douyin":"link");
     return `<div class="contact-method"><span class="contact-icon contact-icon--${iconId}" aria-hidden="true">${contactIconSvg(iconId)}</span><span class="contact-method-name">${name}</span><strong>${content}</strong></div>`;
   }).join("");
 }
}

// Only accept live-preview updates from this site's own settings page.
window.addEventListener("message",event=>{
 if(event.origin!==location.origin||event.data?.type!=="YC_LIVE_PREVIEW")return;
 applySiteSettings(event.data.settings||{});
});

async function init(){
 $("#year").textContent=new Date().getFullYear();
 try{
   const r=await fetch("projects.json",{cache:"no-store"});
   if(!r.ok)throw new Error("HTTP "+r.status);
   state.projects=await r.json();
   renderFilters();renderGrid();
 }catch(e){$("#workGrid").innerHTML='<div class="empty-state">作品列表暂时无法载入。请通过网站服务器预览，或检查 projects.json。</div>';}
 try{
   const r=await fetch("site-settings.json",{cache:"no-store"});
   if(!r.ok)return;
   const s=await r.json();
   applySiteSettings(s);
 }catch(e){/* 使用页面内置默认内容 */}
}
init();


// Subtle pointer parallax for the hero artwork.
(() => {
  const hero = document.querySelector('.hero');
  const image = document.querySelector('.hero-image');
  if (!hero || !image || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    image.style.setProperty('--hero-x', `${-x * 16}px`);
    image.style.setProperty('--hero-y', `${-y * 10}px`);
  });
  hero.addEventListener('pointerleave', () => {
    image.style.setProperty('--hero-x', '0px');
    image.style.setProperty('--hero-y', '0px');
  });
})();
