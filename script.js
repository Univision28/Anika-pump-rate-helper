
function calculateRate() {
  const mode = document.getElementById('mode').value;
  const info = parseFloat(document.getElementById('infoAmount').value) || 0;
  let hours = parseFloat(document.getElementById('hours').value) || 0;
  let minutes = parseFloat(document.getElementById('minutes').value) || 0;

  let remaining = mode === 'morning' ? 2500 : (2500 - info);
  minutes = minutes / 60;
  const totalTime = hours + minutes;

  if (totalTime <= 0) {
    document.getElementById('result').textContent = "Invalid time.";
    return;
  }

  let rate = Math.ceil(remaining / totalTime);
  if (rate > 300) {
    rate = 300;
    document.getElementById('result').textContent =
      "Rate capped at 300 ml/hr — CALL SHANNON. Estimated finish time will be later.";
    return;
  }

  document.getElementById('result').textContent = "Set pump to " + rate + " ml/hr";
}
