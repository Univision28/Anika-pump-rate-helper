
function calculate() {
  const start = parseFloat(document.getElementById('startVol').value);
  const end = parseFloat(document.getElementById('endVol').value);
  const hours = parseFloat(document.getElementById('hours').value);

  if (isNaN(start) || isNaN(end) || isNaN(hours)) {
    document.getElementById('result').innerHTML = "Please fill in all fields correctly.";
    return;
  }

  const used = start - end;
  const rate = used / hours;
  document.getElementById('result').innerHTML =
    `<strong>Used:</strong> ${used.toFixed(1)} mL<br><strong>Rate:</strong> ${rate.toFixed(1)} mL/hr`;
}
