import { bootsy } from './characters.js';
const INTRO_KEY = 'bootstrap-seru-intro-seen';
export function shouldIntroduce(page) {
  if (page !== 'landing') return false;
  try { return sessionStorage.getItem(INTRO_KEY) !== 'yes'; } catch { return true; }
}
/** A short, skippable introduction, separate from assessment state and timer. */
export function showBootsyIntro() {
  if (document.querySelector('.bootsy-intro')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [
    { mood:'success', title:'HAI, AKU BOOTSY!', text:'Temanmu buat beresin web. Helm siap, semangat juga siap!' },
    { mood:'panic', title:'EH… WEB-NYA KENAPA?!', text:'Container kabur, kolom rebutan tempat, input ikut lari. Waduh!' },
    { mood:'celebration', title:'KITA BERESIN BARENG!', text:'Ada 8 misi singkat. Kalau bingung, panggil aku lewat tombol “Bantuin, Bootsy”.' },
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'bootsy-intro';
  dialog.setAttribute('aria-labelledby','intro-title');
  dialog.innerHTML = `<div class="intro-stage"><button class="intro-skip" type="button" data-intro-close>Lewati perkenalan ↗</button><div class="intro-art"><span class="intro-pop pop-left">halo!</span><div class="intro-character"></div><span class="intro-pop pop-right">siap!</span><div class="intro-shadow"></div></div><div class="intro-story" aria-live="polite" aria-atomic="true"><span class="issue-sticker">KENALAN DULU, YUK!</span><h2 id="intro-title"></h2><p class="intro-line"></p></div><div class="intro-controls"><div class="intro-beats" aria-hidden="true"><i></i><i></i><i></i></div><button class="game-button" type="button" data-intro-close>YUK, MULAI! →</button></div></div>`;
  document.body.append(dialog);
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow='hidden';
  let timer, index=0;
  function draw() {
    const scene=scenes[index];
    dialog.querySelector('.intro-character').innerHTML=bootsy(scene.mood);
    dialog.querySelector('#intro-title').textContent=scene.title;
    dialog.querySelector('.intro-line').textContent=scene.text;
    dialog.querySelectorAll('.intro-beats i').forEach((dot,i)=>dot.classList.toggle('active',i<=index));
    if (!reduced && index<scenes.length-1) timer=setTimeout(()=>{index++;draw();},2600);
  }
  if(reduced) { index=2; scenes[2]={mood:"success",title:"HAI, AKU BOOTSY!",text:"Temanmu buat beresin web lewat 8 misi singkat. Kalau bingung, panggil aku lewat tombol “Bantuin, Bootsy”."}; }
  draw();
  dialog.addEventListener('click',event=>{if(event.target.closest('[data-intro-close]'))dialog.close();});
  dialog.addEventListener('close',()=>{
    clearTimeout(timer);
    document.body.style.overflow=previousOverflow;
    try{sessionStorage.setItem(INTRO_KEY,'yes');}catch{}
    dialog.remove();
    document.querySelector('[data-action="start"]')?.focus({preventScroll:true});
  },{once:true});
  dialog.showModal();
}
