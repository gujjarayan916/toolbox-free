// ToolBox Free — Case Converter
(function () {
  "use strict";

  var input = document.getElementById("cc-input");
  var output = document.getElementById("cc-output");
  var copyBtn = document.getElementById("cc-copy");
  var buttons = document.querySelectorAll("[data-case]");

  if (!input) return;

  var converters = {
    upper: function (t) { return t.toUpperCase(); },
    lower: function (t) { return t.toLowerCase(); },
    title: function (t) {
      return t.toLowerCase().replace(/(^|\s|["'([{-])([a-z\u00C0-\u017F])/g, function (m, sep, ch) {
        return sep + ch.toUpperCase();
      });
    },
    sentence: function (t) {
      return t.toLowerCase().replace(/(^\s*[a-z\u00C0-\u017F])|([.!?]\s+[a-z\u00C0-\u017F])/g, function (m) {
        return m.toUpperCase();
      });
    },
    camel: function (t) {
      var words = t
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean);
      return words
        .map(function (w, i) {
          var lower = w.toLowerCase();
          if (i === 0) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    },
    alternating: function (t) {
      var result = "";
      var upper = false;
      for (var i = 0; i < t.length; i++) {
        var ch = t[i];
        if (/[a-zA-Z]/.test(ch)) {
          result += upper ? ch.toUpperCase() : ch.toLowerCase();
          upper = !upper;
        } else {
          result += ch;
        }
      }
      return result;
    },
  };

  var lastCase = "upper";

  function convert(caseType) {
    lastCase = caseType;
    var text = input.value;
    if (!text) {
      output.value = "";
      return;
    }
    output.value = converters[caseType](text);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("btn-primary"); b.classList.add("btn-secondary"); });
      btn.classList.remove("btn-secondary");
      btn.classList.add("btn-primary");
      convert(btn.getAttribute("data-case"));
    });
  });

  input.addEventListener("input", function () { convert(lastCase); });

  copyBtn.addEventListener("click", function () {
    if (!output.value) {
      window.ToolBoxToast("Nothing to copy yet");
      return;
    }
    window.ToolBoxCopy(output.value).then(function () {
      window.ToolBoxToast("Result copied to clipboard");
    });
  });
})();
