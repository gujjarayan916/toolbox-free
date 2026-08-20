// ToolBox Free — QR Code Generator
// Uses the vendored offline qrcode.js encoder (js/vendor/qrcode.js).
(function () {
  "use strict";

  var textInput = document.getElementById("qr-text");
  var sizeSelect = document.getElementById("qr-size");
  var eccSelect = document.getElementById("qr-ecc");
  var fgInput = document.getElementById("qr-fg");
  var bgInput = document.getElementById("qr-bg");
  var canvas = document.getElementById("qr-canvas");
  var errorEl = document.getElementById("qr-error");
  var downloadPng = document.getElementById("qr-download-png");
  var downloadSvgBtn = document.getElementById("qr-download-svg");

  if (!canvas || typeof qrcode === "undefined") return;

  var ctx = canvas.getContext("2d");
  var lastSvg = "";

  function isValidColor(value) {
    var s = new Option().style;
    s.color = "";
    s.color = value;
    return s.color !== "";
  }

  function render() {
    var text = textInput.value;
    var size = parseInt(sizeSelect.value, 10);
    var ecc = eccSelect.value;
    var fg = isValidColor(fgInput.value) ? fgInput.value : "#161a23";
    var bg = isValidColor(bgInput.value) ? bgInput.value : "#ffffff";

    errorEl.textContent = "";

    if (!text.trim()) {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      downloadPng.setAttribute("aria-disabled", "true");
      return;
    }

    var qr;
    try {
      qr = qrcode(0, ecc); // typeNumber 0 = auto-select smallest version that fits
      qr.addData(text);
      qr.make();
    } catch (e) {
      errorEl.textContent = "That text is too long to encode. Try shortening it or lowering the error correction level.";
      return;
    }

    var count = qr.getModuleCount();
    var cell = Math.floor(size / count) || 1;
    var pixelSize = cell * count;

    canvas.width = pixelSize;
    canvas.height = pixelSize;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, pixelSize, pixelSize);
    ctx.fillStyle = fg;
    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cell, row * cell, cell, cell);
        }
      }
    }

    downloadPng.href = canvas.toDataURL("image/png");
    downloadPng.removeAttribute("aria-disabled");

    // Build an SVG string for the SVG download option
    var svgRects = "";
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          svgRects += '<rect x="' + (c * cell) + '" y="' + (r * cell) + '" width="' + cell + '" height="' + cell + '"/>';
        }
      }
    }
    lastSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + pixelSize + " " + pixelSize + '" width="' + pixelSize + '" height="' + pixelSize + '">' +
      '<rect width="100%" height="100%" fill="' + bg + '"/>' +
      '<g fill="' + fg + '">' + svgRects + "</g></svg>";
  }

  function downloadSvg() {
    if (!lastSvg) return;
    var blob = new Blob([lastSvg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var debounceTimer = null;
  function debouncedRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 120);
  }

  [textInput, sizeSelect, eccSelect, fgInput, bgInput].forEach(function (el) {
    el.addEventListener("input", debouncedRender);
    el.addEventListener("change", debouncedRender);
  });
  downloadSvgBtn.addEventListener("click", downloadSvg);

  render();
})();
