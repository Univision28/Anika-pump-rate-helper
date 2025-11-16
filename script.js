
// Logic: builds time selects, handles mode, calculates rate, caps at 300 and shows estimated finish at cap.
(function(){
  const TARGET = 2500;
  const MAX_RATE = 300;

  // elements
  const modeMorning = document.getElementById('modeMorning');
  const modeAfternoon = document.getElementById('modeAfternoon');
  const currentHour = document.getElementById('currentHour');
  const currentMinute = document.getElementById('currentMinute');
  const currentAM = document.getElementById('currentAM');
  const nowBtn = document.getElementById('nowBtn');
  const finishPreset = document.getElementById('finishPreset');
  const customFinish = document.getElementById('customFinish');
  const finishHour = document.getElementById('finishHour');
  const finishMinute = document.getElementById('finishMinute');
  const finishAM = document.getElementById('finishAM');
  const infoRow = document.getElementById('infoRow');
  const infoInput = document.getElementById('infoInput');
  const rateDisplay = document.getElementById('rateDisplay');
  const resultSub = document.getElementById('resultSub');
  const warningEl = document.getElementById('warning');
  const estFinish = document.getElementById('estFinish');
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');
  const instructions = document.querySelector('details');

  let mode = 'morning'; // default

  // populate hours and minutes
  function popHours(sel){
    for(let h=1; h<=12; h++){
      const o = document.createElement('option'); o.value = String(h).padStart(2,'0'); o.text = String(h);
      sel.appendChild(o);
    }
  }
  function popMinutes(sel){
    for(let m=0; m<60; m++){
      const o = document.createElement('option'); o.value = String(m).padStart(2,'0'); o.text = String(m).padStart(2,'0');
      sel.appendChild(o);
    }
  }

  popHours(currentHour); popHours(finishHour);
  popMinutes(currentMinute); popMinutes(finishMinute);

  // set now helper
  function setNow(hSel, mSel, amSel){
    const d = new Date();
    let hh = d.getHours();
    const mm = d.getMinutes();
    const ap = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12; if(hh===0) hh = 12;
    hSel.value = String(hh).padStart(2,'0');
    mSel.value = String(mm).padStart(2,'0');
    amSel.value = ap;
  }

  // initial now
  setNow(currentHour, currentMinute, currentAM);
  setNow(finishHour, finishMinute, finishAM);

  nowBtn.addEventListener('click', ()=>{ setNow(currentHour, currentMinute, currentAM); calculate(); });

  // mode toggles
  function setMode(m){
    mode = m;
    modeMorning.classList.toggle('active', m==='morning');
    modeAfternoon.classList.toggle('active', m==='afternoon');
    infoRow.classList.toggle('hidden', m==='morning');
    // update instructions visibility inside details
    // show only relevant instruction lines by toggling display of list items
    document.getElementById('instrMorning').style.display = m === 'morning' ? 'list-item' : 'none';
    document.getElementById('instrAfternoon').style.display = m === 'afternoon' ? 'list-item' : 'none';
    calculate();
  }

  modeMorning.addEventListener('click', ()=> setMode('morning'));
  modeAfternoon.addEventListener('click', ()=> setMode('afternoon'));

  // finish preset handling
  finishPreset.addEventListener('change', ()=>{
    if(finishPreset.value === 'custom') customFinish.classList.remove('hidden');
    else customFinish.classList.add('hidden');
    calculate();
  });

  // convert selects to minutes since midnight
  function toMinutes(h, m, am){
    let hh = parseInt(h,10);
    const mm = parseInt(m,10);
    const ap = (am+'').toUpperCase();
    if(ap === 'AM'){ if(hh === 12) hh = 0; }
    else { if(hh !== 12) hh = hh + 12; }
    return hh*60 + mm;
  }

  function minsToDisplay(mins){
    mins = Math.round(mins) % 1440; if(mins<0) mins+=1440;
    let h = Math.floor(mins/60); const m = mins % 60;
    const ap = h>=12 ? 'PM' : 'AM'; h = h%12; if(h===0) h=12;
    return `${h}:${String(m).padStart(2,'0')} ${ap}`;
  }

  function calculate(){
    warningEl.classList.add('hidden'); estFinish.textContent=''; resultSub.textContent='';
    let cur = toMinutes(currentHour.value, currentMinute.value, currentAM.value);
    let finish;
    if(finishPreset.value === 'custom') finish = toMinutes(finishHour.value, finishMinute.value, finishAM.value);
    else if(finishPreset.value === 'preset_weekend') finish = toMinutes('08','00','PM');
    else if(finishPreset.value === 'preset_weekday') finish = toMinutes('07','30','PM');
    else { const parts = finishPreset.value.split(':'); finish = parseInt(parts[0],10)*60 + parseInt(parts[1],10); }

    if(isNaN(cur) || isNaN(finish)){ rateDisplay.textContent='0 ml/hr'; resultSub.textContent='Waiting for times and INFO'; return; }

    if(finish <= cur){ rateDisplay.textContent='0 ml/hr'; resultSub.textContent='Finish time must be later than current time.'; return; }

    const minsLeft = finish - cur;
    const hrsLeft = minsLeft / 60;
    let remaining = TARGET;
    if(mode === 'afternoon'){
      const infoVal = parseFloat(infoInput.value) || 0;
      remaining = TARGET - infoVal;
      if(remaining <= 0){ rateDisplay.textContent='0 ml/hr'; resultSub.textContent='Target already reached based on INFO.'; return; }
    }

    let rawRate = remaining / hrsLeft;
    let rate = Math.ceil(rawRate);
    let capped = false;
    if(rate > MAX_RATE){ rate = MAX_RATE; capped = true; }

    rateDisplay.textContent = rate + ' ml/hr';
    resultSub.textContent = (mode==='morning' ? 'Morning — INFO = 0.' : ('Catch-up — INFO = ' + Math.round(parseFloat(infoInput.value)||0) + ' ml.')) + ' Hours left: ' + hrsLeft.toFixed(2) + '. Remaining: ' + Math.round(remaining) + ' ml.';

    if(capped){
      warningEl.classList.remove('hidden');
      const hoursNeeded = remaining / MAX_RATE;
      const finishAt300 = cur + Math.round(hoursNeeded*60);
      estFinish.textContent = 'Estimated finish time at 300 ml/hr: ' + minsToDisplay(finishAt300);
    }
  }

  // wire events to calculate
  const watch = [currentHour, currentMinute, currentAM, finishHour, finishMinute, finishAM, finishPreset, infoInput];
  watch.forEach(el=>{ if(!el) return; el.addEventListener('change', calculate); el.addEventListener('input', calculate); });

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', ()=>{ location.reload(); });

  // initialize values and mode
  setMode('morning');
  calculate();

})();