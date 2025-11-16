function calculateRate() {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const hours = parseFloat(document.getElementById('hoursInput').value);
    if (!amount || !hours) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }
    const rate = amount / hours;
    document.getElementById('result').innerText = "Set pump rate to: " + rate.toFixed(1) + " ml/hr";
}
