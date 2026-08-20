// ToolBox Free — Password Generator
(function () {
  "use strict";

  var output = document.getElementById("pg-output");
  var copyBtn = document.getElementById("pg-copy");
  var generateBtn = document.getElementById("pg-generate");
  var lengthInput = document.getElementById("pg-length");
  var lengthValue = document.getElementById("pg-length-value");
  var upperCb = document.getElementById("pg-upper");
  var lowerCb = document.getElementById("pg-lower");
  var numbersCb = document.getElementById("pg-numbers");
  var symbolsCb = document.getElementById("pg-symbols");
  var excludeCb = document.getElementById("pg-exclude-ambiguous");
  var strengthBar = document.getElementById("pg-strength-bar");
  var strengthLabel = document.getElementById("pg-strength-label");

  if (!output) return;

  var CHARSETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
  };
  var AMBIGUOUS = /[l1IO0]/g;

  function secureRandomInt(maxExclusive) {
    // Rejection sampling against a cryptographically secure source to avoid modulo bias
    var range = maxExclusive;
    var maxUint32 = 0xffffffff;
    var limit = maxUint32 - (maxUint32 % range);
    var array = new Uint32Array(1);
    var value;
    do {
      window.crypto.getRandomValues(array);
      value = array[0];
    } while (value >= limit);
    return value % range;
  }

  function buildCharset() {
    var pool = "";
    if (upperCb.checked) pool += CHARSETS.upper;
    if (lowerCb.checked) pool += CHARSETS.lower;
    if (numbersCb.checked) pool += CHARSETS.numbers;
    if (symbolsCb.checked) pool += CHARSETS.symbols;
    if (excludeCb.checked) pool = pool.replace(AMBIGUOUS, "");
    return pool;
  }

  function generate() {
    var length = parseInt(lengthInput.value, 10);
    var pool = buildCharset();

    if (!pool) {
      output.value = "";
      strengthLabel.textContent = "Select at least one character type";
      strengthBar.style.width = "0%";
      return;
    }

    var chars = [];
    for (var i = 0; i < length; i++) {
      chars.push(pool[secureRandomInt(pool.length)]);
    }
    output.value = chars.join("");
    updateStrength(output.value, pool.length);
  }

  function updateStrength(password, poolSize) {
    if (!password) {
      strengthBar.style.width = "0%";
      strengthLabel.textContent = "Strength: —";
      return;
    }
    // Approximate entropy in bits: length * log2(pool size)
    var entropy = password.length * (Math.log(poolSize) / Math.log(2));
    var pct, label, color;
    if (entropy < 40) { pct = 25; label = "Weak"; color = "#d1453b"; }
    else if (entropy < 60) { pct = 50; label = "Fair"; color = "#e08a1f"; }
    else if (entropy < 80) { pct = 75; label = "Strong"; color = "#1fae7f"; }
    else { pct = 100; label = "Very strong"; color = "#1fae7f"; }
    strengthBar.style.width = pct + "%";
    strengthBar.style.background = color;
    strengthLabel.textContent = "Strength: " + label + " (~" + Math.round(entropy) + " bits of entropy)";
  }

  lengthInput.addEventListener("input", function () {
    lengthValue.textContent = lengthInput.value;
    generate();
  });
  [upperCb, lowerCb, numbersCb, symbolsCb, excludeCb].forEach(function (cb) {
    cb.addEventListener("change", function () {
      // Guard: don't allow unchecking every character type
      if (!upperCb.checked && !lowerCb.checked && !numbersCb.checked && !symbolsCb.checked) {
        cb.checked = true;
      }
      generate();
    });
  });
  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    if (!output.value) {
      window.ToolBoxToast("Generate a password first");
      return;
    }
    window.ToolBoxCopy(output.value).then(function () {
      window.ToolBoxToast("Password copied to clipboard");
    });
  });

  generate();
})();
