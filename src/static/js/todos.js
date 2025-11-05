function docReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function () {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (target.dataset.action != null) {
      fetch(target.dataset.task, { method: "delete" }).then((res) => {
        window.location.href = res.url;
      });
    }
  });
});
