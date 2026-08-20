// ToolBox Free — Percentage Calculator
(function () {
  "use strict";

  var modeSelect = document.getElementById("pc-mode");
  var panels = {
    basic: document.getElementById("pc-basic"),
    isWhatPercent: document.getElementById("pc-iswhat"),
    change: document.getElementById("pc-change"),
  };
  var resultEl = document.getElementById("pc-result");
  var labelEl = document.getElementById("pc-result-label");
  var explainEl = document.getElementById("pc-explain");

  if (!modeSelect) return;

  var inputs = {
    basicX: document.getElementById("pc-basic-x"),
    basicY: document.getElementById("pc-basic-y"),
    iswhatX: document.getElementById("pc-iswhat-x"),
    iswhatY: document.getElementById("pc-iswhat-y"),
    changeX: document.getElementById("pc-change-x"),
    changeY: document.getElementById("pc-change-y"),
  };

  function formatNumber(n) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  function switchMode() {
    var mode = modeSelect.value;
    Object.keys(panels).forEach(function (key) {
      panels[key].hidden = key !== mode;
    });
    calculate();
  }

  function calculate() {
    var mode = modeSelect.value;

    if (mode === "basic") {
      var x = parseFloat(inputs.basicX.value);
      var y = parseFloat(inputs.basicY.value);
      if (isNaN(x) || isNaN(y)) {
        resultEl.textContent = "—";
        labelEl.textContent = "Enter values to calculate";
        explainEl.textContent = "";
        return;
      }
      var result = (x / 100) * y;
      resultEl.textContent = formatNumber(result);
      labelEl.textContent = x + "% of " + y;
      explainEl.textContent = x + " ÷ 100 × " + y + " = " + formatNumber(result);
    }

    if (mode === "isWhatPercent") {
      var a = parseFloat(inputs.iswhatX.value);
      var b = parseFloat(inputs.iswhatY.value);
      if (isNaN(a) || isNaN(b) || b === 0) {
        resultEl.textContent = "—";
        labelEl.textContent = b === 0 && !isNaN(b) ? "Can't divide by zero" : "Enter values to calculate";
        explainEl.textContent = "";
        return;
      }
      var pct = (a / b) * 100;
      resultEl.textContent = formatNumber(pct) + "%";
      labelEl.textContent = a + " is what % of " + b;
      explainEl.textContent = a + " ÷ " + b + " × 100 = " + formatNumber(pct) + "%";
    }

    if (mode === "change") {
      var from = parseFloat(inputs.changeX.value);
      var to = parseFloat(inputs.changeY.value);
      if (isNaN(from) || isNaN(to) || from === 0) {
        resultEl.textContent = "—";
        labelEl.textContent = from === 0 && !isNaN(from) ? "Starting value can't be zero" : "Enter values to calculate";
        explainEl.textContent = "";
        return;
      }
      var change = ((to - from) / Math.abs(from)) * 100;
      var sign = change > 0 ? "+" : "";
      resultEl.textContent = sign + formatNumber(change) + "%";
      labelEl.textContent = change >= 0 ? "Percentage increase" : "Percentage decrease";
      explainEl.textContent = "(" + to + " − " + from + ") ÷ " + from + " × 100 = " + sign + formatNumber(change) + "%";
    }
  }

  modeSelect.addEventListener("change", switchMode);
  Object.keys(inputs).forEach(function (key) {
    inputs[key].addEventListener("input", calculate);
  });

  switchMode();
})();
