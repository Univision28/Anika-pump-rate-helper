function calculate() {
  let cur = document.getElementById('currentTime').value;
  let fin = document.getElementById('finishTime').value;

  if (!cur || !fin) return;

  let [ch, cm] = cur.split(':').map(Number);
  let [fh, fm] = fin.split(':').map(Number);

  let now = new Date();
  let end = new Date();

  now.setHours(ch, cm, 0);
  end.setHours(fh, fm, 0);

  if (end < now) end.setDate(end.getDate() + 1);

  let diffMs = end - now;
  let diffHrs = diffMs / 1000 / 3600;

  let mlRemaining = diffHrs * 2500;
  let rate = mlRemaining / diffHrs;

  document.getElementById('mlRemain').innerText = mlRemaining.toFixed(0);
  document.getElementById('hrsRemain').innerText = diffHrs.toFixed(2);
  document.getElementById('rate').innerText = rate.toFixed(0);
}

setInterval(calculate, 1000);
