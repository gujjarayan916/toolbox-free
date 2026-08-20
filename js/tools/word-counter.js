// ToolBox Free — Word Counter
(function () {
  "use strict";

  var input = document.getElementById("wc-input");
  var hint = document.getElementById("wc-hint");
  var statWords = document.getElementById("stat-words");
  var statChars = document.getElementById("stat-chars");
  var statCharsNs = document.getElementById("stat-chars-ns");
  var statSentences = document.getElementById("stat-sentences");
  var statParagraphs = document.getElementById("stat-paragraphs");
  var statReading = document.getElementById("stat-reading");
  var clearBtn = document.getElementById("wc-clear");
  var copyBtn = document.getElementById("wc-copy");

  if (!input) return;

  function countWords(text) {
    var trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function countSentences(text) {
    var trimmed = text.trim();
    if (!trimmed) return 0;
    var matches = trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
    if (!matches) return 0;
    return matches.filter(function (s) { return s.trim().length > 0; }).length;
  }

  function countParagraphs(text) {
    var trimmed = text.trim();
    if (!trimmed) return 0;
    var parts = trimmed.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; });
    return parts.length || (trimmed.length ? 1 : 0);
  }

  function update() {
    var text = input.value;
    var words = countWords(text);
    var chars = text.length;
    var charsNs = text.replace(/\s/g, "").length;
    var sentences = countSentences(text);
    var paragraphs = countParagraphs(text);
    var minutes = Math.max(1, Math.ceil(words / 200));

    statWords.textContent = words.toLocaleString();
    statChars.textContent = chars.toLocaleString();
    statCharsNs.textContent = charsNs.toLocaleString();
    statSentences.textContent = sentences.toLocaleString();
    statParagraphs.textContent = paragraphs.toLocaleString();
    statReading.textContent = words === 0 ? "0 min" : minutes + " min";
    hint.textContent = words.toLocaleString() + (words === 1 ? " word" : " words");
  }

  input.addEventListener("input", update);

  clearBtn.addEventListener("click", function () {
    input.value = "";
    update();
    input.focus();
  });

  copyBtn.addEventListener("click", function () {
    if (!input.value) {
      window.ToolBoxToast("Nothing to copy yet");
      return;
    }
    window.ToolBoxCopy(input.value).then(function () {
      window.ToolBoxToast("Text copied to clipboard");
    });
  });

  update();
})();
