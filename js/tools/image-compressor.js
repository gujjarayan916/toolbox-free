// ToolBox Free — Image Compressor
(function () {
  "use strict";

  var dropzone = document.getElementById("ic-dropzone");
  var fileInput = document.getElementById("ic-file-input");
  var workspace = document.getElementById("ic-workspace");
  var previewWrap = document.getElementById("ic-preview");
  var previewOriginal = document.getElementById("ic-preview-original");
  var previewCompressed = document.getElementById("ic-preview-compressed");
  var qualityInput = document.getElementById("ic-quality");
  var qualityValue = document.getElementById("ic-quality-value");
  var formatSelect = document.getElementById("ic-format");
  var maxWidthInput = document.getElementById("ic-maxwidth");
  var originalSizeEl = document.getElementById("ic-original-size");
  var newSizeEl = document.getElementById("ic-new-size");
  var savedEl = document.getElementById("ic-saved");
  var downloadBtn = document.getElementById("ic-download");
  var resetBtn = document.getElementById("ic-reset");

  if (!dropzone) return;

  var currentImage = null;
  var currentFile = null;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function loadFile(file) {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) {
      window.ToolBoxToast("Please choose a JPG, PNG or WebP image");
      return;
    }
    currentFile = file;
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        currentImage = img;
        previewOriginal.src = e.target.result;
        originalSizeEl.textContent = formatBytes(file.size);
        workspace.hidden = false;
        previewWrap.hidden = false;
        // Default the format select to match the source, defaulting PNG stays PNG, others JPEG
        formatSelect.value = file.type === "image/png" ? "image/png" : "image/jpeg";
        compress();
      };
      img.onerror = function () {
        window.ToolBoxToast("That image couldn't be read");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function compress() {
    if (!currentImage) return;
    var quality = parseInt(qualityInput.value, 10) / 100;
    var format = formatSelect.value;
    var maxWidth = parseInt(maxWidthInput.value, 10);

    var width = currentImage.naturalWidth;
    var height = currentImage.naturalHeight;
    if (maxWidth && maxWidth > 0 && maxWidth < width) {
      height = Math.round(height * (maxWidth / width));
      width = maxWidth;
    }

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");

    if (format === "image/jpeg") {
      // JPEG has no alpha channel: paint a white background first to avoid black-fill artifacts
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(currentImage, 0, 0, width, height);

    canvas.toBlob(
      function (blob) {
        if (!blob) {
          window.ToolBoxToast("Compression failed — try a different format");
          return;
        }
        var url = URL.createObjectURL(blob);
        previewCompressed.src = url;
        newSizeEl.textContent = formatBytes(blob.size);

        var savedBytes = currentFile.size - blob.size;
        var savedPct = currentFile.size > 0 ? (savedBytes / currentFile.size) * 100 : 0;
        if (savedBytes >= 0) {
          savedEl.textContent = savedPct.toFixed(0) + "%";
        } else {
          savedEl.textContent = "+" + Math.abs(savedPct).toFixed(0) + "%";
        }

        var ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
        var baseName = currentFile.name.replace(/\.[^.]+$/, "");
        downloadBtn.href = url;
        downloadBtn.download = baseName + "-compressed." + ext;
      },
      format,
      format === "image/png" ? undefined : quality
    );
  }

  function resetTool() {
    currentImage = null;
    currentFile = null;
    fileInput.value = "";
    workspace.hidden = true;
    previewWrap.hidden = true;
  }

  dropzone.addEventListener("click", function () { fileInput.click(); });
  dropzone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
    });
  });
  dropzone.addEventListener("drop", function (e) {
    var file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadFile(file);
  });

  qualityInput.addEventListener("input", function () {
    qualityValue.textContent = qualityInput.value;
    compress();
  });
  formatSelect.addEventListener("change", compress);
  maxWidthInput.addEventListener("input", compress);
  resetBtn.addEventListener("click", resetTool);
})();
