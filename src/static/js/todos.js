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

function autoRedirect(res) {
  if (res.redirected) {
    window.location.href = res.url;
  }
}

function handleError(msg) {
  return (err) => console.error(msg, err);
}

docReady(function () {
  document.body.addEventListener("click", (event) => {
    let target = event.target;
    while (target.dataset.action == null && target.parentNode) {
      target = target.parentNode;
    }
    const action = target.dataset.action;
    const task = target.dataset.task;
    if (action != null) {
      fetch(task, { method: action })
        .then(autoRedirect)
        .catch(handleError(`Could not "${action}" to "${task}"`));
    }
  });
});
