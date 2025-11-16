// App logic for Anika Pump Rate Helper (Option 1)
(function(){
  const TARGET = 2500;
  const MAX_RATE = 300;

  // Elements
  const btnMorning = document.getElementById('btnMorning');
  const btnAfternoon = document.getElementById('btnAfternoon');

  const morningPanel = document.getElementById('morningPanel');
  const afternoonPanel = document.getElementById('afternoonPanel');

  const mHour = document.getElementById('mHour');
  const mMinute = document.getElementById('mMinute');
  const mAM = document.getElementById('mAM');
  const nowMorning = document.getElementById('nowMorning');
  const mFinishPreset = document.getElementById('mFinishPreset');
  const mFinishCustom = document.getElementById('mFinishCustom');
  const mFH = document.getElementById('mFH');
  const mFM = document.getElementById('mFM');
  const mFAM = document.getElementById('mFAM');

  const aInfo = document.getElementById('aInfo');
  const aHour = document.getElementById('aHour');
  const aMinute = document.getElementById('aMinute');
  const aAM = document.getElementById('aAM');
  const nowAfternoon = document.getElementById('nowAfternoon');
  const aFinishPreset = document.getElementById('aFinishPreset');
  const aFinishCustom = document.getElementById('aFinishCustom');
  const aFH = document.getElementById('aFH');
  const aFM = document.getElementById('aFM');
  const aFAM = document.getElementById('aFAM');

  const rateDisplay = document.getElementById('rateDisplay');
  const resultSub = document.getElementById('resultSub');
  const warningEl = document.getElementById('warning');
  const estFinish = document.getElementById('estFinish');

  // populate hour/minute selects (1-12, 00-59)
  function populate(selectHour, selectMinute){
    if(selectHour){
      for(let h=1; h<=12; h++){
        const o = document.createElement('option'); o.value = String(h).padStart(2,'0'); o.text = String(h);
        selectHour.appendChild(o);
      }
    }
    if(selectMinute){
      for(let m=0; m<60; m++){
        const t = String(m).padStart(2,'0');
        const o = document.createElement('option'); o.value = t; o.text = t;
        selectMinute.appendChild(o);
      }
    }
  }

  ['mHour','mFH','aHour','aFH'].forEach(id => populate(document.getElementById(id), null));
  ['mMinute','mFM','aMinute','aFM'].forEach(id => populate(null, document.getElementById(id)));

  // set now helpers
  function setNowTo(hourEl, minuteEl, amEl){
    const d = new Date();
    let hh = d.getHours();
    const mm = d.getMinutes();
    const ap = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12; if(hh===0) hh=12;
    hourEl.value = String(hh).padStart(2,'0');
    minuteEl.value = String(mm).padStart(2,'0');
    amEl.value = ap;
  }

  setNowTo(mHour, mMinute, mAM);
  setNowTo(aHour, aMinute, aAM);

  nowMorning.addEventListener('click', ()=> { setNowTo(mHour,mMinute,mAM); calculate(); });
  nowAfternoon.addEventListener('click', ()=> { setNowTo(aHour,aMinute,aAM); calculate(); });

  // mode toggle
  btnMorning.addEventListener('click', ()=> {
    btnMorning.classList.add('active'); btnAfternoon.classList.remove('active');
    morningPanel.classList.remove('hidden'); afternoonPanel.classList.add('hidden');
    calculate();
  });
  btnAfternoon.addEventListener('click', ()=> {
    btnAfternoon.classList.add('active'); btnMorning.classList.remove('active');
    afternoonPanel.classList.remove('hidden'); morningPanel.classList.add('hidden');
    calculate();
  });

  // finish preset handling
  mFinishPreset.addEventListener('change', ()=> {
    if(mFinishPreset.value === 'custom') mFinishCustom.classList.remove('hidden');
    else mFinishCustom.classList.add('hidden');
    // set custom default based on choice
    if(mFinishPreset.value === 'preset_weekday'){
      // 7:30pm
      mFH.value = '07'; mFM.value = '30'; mFAM.value = 'PM';
    } else if(mFinishPreset.value === 'preset_weekend'){
      mFH.value = '08'; mFM.value = '00'; mFAM.value = 'PM';
    }
    calculate();
  });

  aFinishPreset.addEventListener('change', ()=> {
    if(aFinishPreset.value === 'custom') aFinishCustom.classList.remove('hidden');
    else aFinishCustom.classList.add('hidden');
    calculate();
  });

  // helper: convert 12hr selects to minutes since midnight
  function toMins(h, m, am){
    let hh = parseInt(h,10);
    const mm = parseInt(m,10);
    const ap = (am+'').toUpperCase();
    if(ap === 'AM'){ if(hh === 12) hh=0; }
    else { if(hh !== 12) hh = hh + 12; }
    return hh*60 + mm;
  }
  function minsToDisplay(mins){
    mins = Math.round(mins) % 1440; if(mins<0) mins+=1440;
    let h = Math.floor(mins/60); const m = mins % 60;
    const ap = h>=12 ? 'PM' : 'AM'; h = h%12; if(h===0) h=12;
    return `${h}:${String(m).padStart(2,'0')} ${ap}`;
  }

  // calculate function
  function calculate(){
    warningEl.classList.add('hidden'); warningEl.textContent=''; estFinish.textContent=''; resultSub.textContent='';

    // detect mode
    const morningVisible = !morningPanel.classList.contains('hidden');

    // get current and finish mins
    let curMins, finishMins;
    if(morningVisible){
      curMins = toMins(mHour.value, mMinute.value, mAM.value);
      if(mFinishPreset.value === 'custom'){
        finishMins = toMins(mFH.value, mFM.value, mFAM.value);
      } else {
        // preset stored as "preset_weekday" or "preset_weekend"
        // decide based on current day (weekday/weekend)
        const now = new Date();
        const day = now.getDay(); // 0 Sun .. 6 Sat
        if(mFinishPreset.value === 'preset_weekend' || day===0 || day===6){
          finishMins = toMins('08','00','PM');
        } else {
          finishMins = toMins('07','30','PM');
        }
      }
    } else {
      curMins = toMins(aHour.value, aMinute.value, aAM.value);
      if(aFinishPreset.value === 'custom'){
        finishMins = toMins(aFH.value, aFM.value, aFAM.value);
      } else {
        // preset is like "20:30"
        const parts = aFinishPreset.value.split(':');
        finishMins = parseInt(parts[0],10)*60 + parseInt(parts[1],10);
      }
    }

    if(isNaN(curMins) || isNaN(finishMins)){
      rateDisplay.textContent = '0 ml/hr';
      resultSub.textContent = 'Waiting for times and INFO';
      return;
    }

    if(finishMins <= curMins){
      rateDisplay.textContent = '0 ml/hr';
      resultSub.textContent = 'Finish time must be later than current time.';
      return;
    }

    const minsLeft = finishMins - curMins;
    const hrsLeft = minsLeft / 60;
    let remaining = TARGET;
    if(!morningVisible){
      const infoVal = parseFloat(aInfo.value);
      remaining = TARGET - (isNaN(infoVal) ? 0 : infoVal);
      if(remaining < 0) remaining = 0;
    }

    if(remaining === 0){
      rateDisplay.textContent = '0 ml/hr';
      resultSub.textContent = 'Target already reached based on INFO.';
      return;
    }

    let rawRate = remaining / hrsLeft;
    let rate = Math.ceil(rawRate);
    let capped = false;
    if(rate > MAX_RATE){ rate = MAX_RATE; capped = true; }

    rateDisplay.textContent = rate + ' ml/hr';
    resultSub.textContent = (morningVisible ? 'Morning — INFO = 0.' : 'Catch-up — INFO = ' + Math.round(parseFloat(aInfo.value)||0) + ' ml.') + ' Hours left: ' + hrsLeft.toFixed(2) + '. Remaining: ' + Math.round(remaining) + ' ml.';

    if(capped){
      warningEl.classList.remove('hidden');
      warningEl.textContent = 'Calculated rate exceeds the safe maximum of 300 ml/hr. The helper has capped the rate at 300 ml/hr. Please call Shannon.';
      const hoursNeeded = remaining / MAX_RATE;
      const finishAt300 = Math.round(curMins + hoursNeeded*60);
      estFinish.textContent = 'Estimated finish time at 300 ml/hr: ' + minsToDisplay(finishAt300);
    }
  }

  // wire inputs to recalc
  const watch = [mHour,mMinute,mAM,mFH,mFM,mFAM,mFinishPreset,aHour,aMinute,aAM,aFH,aFM,aFAM,aFinishPreset,aInfo];
  watch.forEach(el => {
    if(!el) return;
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  // initial calculate
  calculate();

  // expose calculate to window for manual use if needed
  window.calculate = calculate;
})();