
let mode = "morning";

document.getElementById("morningBtn").onclick = () => { mode = "morning"; toggleMode(); };
document.getElementById("afternoonBtn").onclick = () => { mode = "afternoon"; toggleMode(); };

function toggleMode() {
  document.getElementById("morningBtn").classList.toggle("active", mode === "morning");
  document.getElementById("afternoonBtn").classList.toggle("active", mode === "afternoon");
  document.getElementById("afternoonInput").classList.toggle("hidden", mode !== "afternoon");
}

document.getElementById("calcBtn").onclick = () => {
  let finish = Number(document.getElementById("finishTime").value);
  let now = new Date();
  let hoursLeft = finish - now.getHours();

  let total = mode === "morning" ? 800 : 800 - Number(document.getElementById("givenInput").value);

  let mlPerHour = Math.max(1, Math.round(total / hoursLeft));

  document.getElementById("result").innerHTML =
    `Set pump rate to: <strong>${mlPerHour} ml/hr</strong>`;
  document.getElementById("result").classList.remove("hidden");
};
