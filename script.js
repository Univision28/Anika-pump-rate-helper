
function calculate() {
  const target = document.getElementById("targetTime").value;
  const current = document.getElementById("currentTime").value;
  const already = Number(document.getElementById("already").value) || 0;

  if (!current) {
    document.getElementById("result").innerText = "Please enter the current time.";
    return;
  }

  const [ch, cm] = current.split(":").map(Number);
  const [th, tm] = target.split(":").map(Number);

  let currentMins = ch * 60 + cm;
  let targetMins = th * 60 + tm;

  if (targetMins < currentMins) targetMins += 24*60;

  const diffHours = (targetMins - currentMins) / 60;

  const remaining = 2500 - already;
  let rate = Math.ceil(remaining / diffHours);

  if (rate > 300) {
    document.getElementById("result").innerHTML = 
      "⚠️ Rate exceeds 300ml/hr. Please call Shannon.";
    return;
  }

  document.getElementById("result").innerHTML = "Set pump to: <strong>" + rate + " ml/hr</strong>";
}
