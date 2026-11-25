const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const cursor = document.querySelector("[data-custom-cursor]");

if (cursor) {
  const root = document.documentElement;
  const interactive =
    "a[href], button:not(:disabled), summary, input[type=checkbox]:not(:disabled), select:not(:disabled)";
  const native =
    "input:not([type=checkbox]), textarea, [contenteditable=true], [data-native-cursor]";
  let frame = 0;
  let point;

  const hide = () => {
    point = undefined;
    root.classList.remove("custom-cursor-active");
  };

  function update() {
    frame = 0;
    if (!point) return;
    const { clientX, clientY, target } = point;
    if (target.closest(native)) {
      hide();
      return;
    }
    const link = target.closest("a[href]");
    const control =
      target.closest(interactive) ||
      target
        .closest("label")
        ?.control?.matches("input[type=checkbox]:not(:disabled)");
    const project = link?.hasAttribute("data-project-card");
    const x = project
      ? Math.max(67, Math.min(window.innerWidth - 67, clientX))
      : clientX;
    const y = project
      ? Math.max(25, Math.min(window.innerHeight - 25, clientY))
      : clientY;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const state = project
      ? "project"
      : link
        ? "link"
        : control
          ? "control"
          : "default";
    if (cursor.dataset.state !== state) cursor.dataset.state = state;
    if (!root.classList.contains("custom-cursor-active"))
      root.classList.add("custom-cursor-active");
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      if (typeof event.target?.closest !== "function") return;
      point = event;
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );

  document.documentElement.addEventListener("pointerleave", hide);
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse") hide();
    },
    { passive: true },
  );
  window.addEventListener("blur", hide);
}

for (const clock of document.querySelectorAll("[data-clock]")) {
  const format = new Intl.DateTimeFormat("en-GB", {
    timeZone: clock.dataset.timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
  const tick = () => {
    const now = new Date();
    clock.textContent = format.format(now);
    clock.dateTime = now.toISOString();
  };
  tick();
  setInterval(tick, 15_000);
}

for (const image of document.querySelectorAll("[data-project-image]")) {
  const useCover = () => {
    image.hidden = true;
  };
  image.addEventListener("error", useCover, { once: true });
  if (image.complete && !image.naturalWidth) useCover();
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".cover")
    .forEach((cover) => observer.observe(cover));
}

for (const directory of document.querySelectorAll("[data-work]")) {
  const filters = [...directory.querySelectorAll("[data-filter]")];
  const views = [...directory.querySelectorAll("[data-view]")];
  const panels = [...directory.querySelectorAll("[data-work-panel]")];
  const count = directory.querySelector("[data-work-count]");
  const empty = directory.querySelector("[data-empty]");
  const read = () => new URL(location.href).searchParams;

  const render = () => {
    const params = read();
    const filter =
      filters.find((button) => button.dataset.filter === params.get("category"))
        ?.dataset.filter || "All Work";
    const view = params.get("view") === "index" ? "index" : "gallery";
    filters.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === filter),
      ),
    );
    views.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.view === view)),
    );
    let visible = 0;
    for (const panel of panels) {
      const active = panel.dataset.workPanel === view;
      panel.hidden = !active;
      for (const item of panel.querySelectorAll("[data-categories]")) {
        const matching =
          filter === "All Work" ||
          item.dataset.categories.split("|").includes(filter);
        item.hidden = !matching;
        if (matching && active) visible++;
      }
    }
    count.textContent = visible + (visible === 1 ? " project" : " projects");
    empty.hidden = visible > 0;
  };

  const select = (param, value, initial) => {
    const url = new URL(location.href);
    if (value === initial) url.searchParams.delete(param);
    else url.searchParams.set(param, value);
    history.replaceState(null, "", url);
    render();
  };
  filters.forEach((button) =>
    button.addEventListener("click", () =>
      select("category", button.dataset.filter, "All Work"),
    ),
  );
  views.forEach((button) =>
    button.addEventListener("click", () =>
      select("view", button.dataset.view, "gallery"),
    ),
  );
  window.addEventListener("popstate", render);
  render();
}

const inquiry = document.querySelector("[data-inquiry]");
if (inquiry) {
  const submit = inquiry.querySelector("button[type=submit]");
  const status = inquiry.querySelector("[data-form-status]");
  const errors = [...inquiry.querySelectorAll("[data-error]")];

  const show = (message, isError) => {
    status.textContent = message;
    status.toggleAttribute("data-error-state", isError);
  };

  const fieldErrors = (issues) => {
    for (const element of errors) {
      const key = element.dataset.error;
      element.textContent = issues[key] || "";
      inquiry.elements
        .namedItem(key)
        ?.setAttribute("aria-invalid", String(!!issues[key]));
    }
  };

  inquiry.addEventListener("input", (event) => {
    const target = event.target;
    const error = errors.find(
      (element) => element.dataset.error === target.name,
    );
    if (error) error.textContent = "";
    target.removeAttribute("aria-invalid");
  });

  inquiry.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const data = new URLSearchParams(new FormData(inquiry));
    const issues = {};
    if (data.get("name").trim().length < 2)
      issues.name = "Enter your full name.";
    if (data.get("message").trim().length < 20)
      issues.message =
        "Tell me a little more about your project (at least 20 characters).";
    fieldErrors(issues);
    if (Object.keys(issues).length) {
      show("Please check the highlighted fields and try again.", true);
      inquiry.querySelector("[aria-invalid=true]")?.focus();
      return;
    }

    submit.disabled = true;
    inquiry.setAttribute("aria-busy", "true");
    show("Sending your inquiry…", false);
    try {
      const response = await fetch(inquiry.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      fieldErrors(result.errors || {});
      if (response.ok) inquiry.reset();
      show(result.message, !response.ok);
      (inquiry.querySelector("[aria-invalid=true]") || status).focus();
    } catch {
      show(
        "Your inquiry couldn’t be confirmed. Check your connection and try again.",
        true,
      );
      status.focus();
    } finally {
      submit.disabled = false;
      inquiry.removeAttribute("aria-busy");
    }
  });
}

for (const menu of document.querySelectorAll("[data-site-menu]")) {
  const trigger = menu.parentElement.querySelector("[data-menu-open]");
  if (typeof menu.showModal !== "function") continue;
  trigger.hidden = false;
  let closeTimer = 0;
  let closing = false;
  const panel = menu.querySelector(".menu-panel");

  function alignToggle() {
    const rect = trigger.getBoundingClientRect();
    menu.style.setProperty("--menu-toggle-x", `${rect.left}px`);
    menu.style.setProperty("--menu-toggle-y", `${rect.top}px`);
  }

  function dismiss() {
    if (!menu.open || closing) return;
    closing = true;
    menu.removeAttribute("data-visible");
    if (reducedMotion.matches) menu.close();
    else closeTimer = window.setTimeout(() => menu.close(), 360);
  }

  trigger.addEventListener("click", () => {
    if (menu.open) return;
    alignToggle();
    document.documentElement.classList.remove("custom-cursor-active");
    if (cursor) menu.append(cursor);
    menu.showModal();
    trigger.setAttribute("aria-expanded", "true");
    if (reducedMotion.matches) menu.setAttribute("data-visible", "");
    else
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (menu.open && !closing) menu.setAttribute("data-visible", "");
        }),
      );
  });
  menu.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismiss();
  });
  for (const closer of menu.querySelectorAll("[data-menu-dismiss]")) {
    closer.addEventListener("click", dismiss);
  }
  panel.addEventListener("transitionend", (event) => {
    if (closing && event.target === panel && event.propertyName === "transform")
      menu.close();
  });
  window.addEventListener("resize", () => {
    if (menu.open) alignToggle();
  });
  menu.addEventListener("close", () => {
    window.clearTimeout(closeTimer);
    closing = false;
    menu.removeAttribute("data-visible");
    document.documentElement.classList.remove("custom-cursor-active");
    if (cursor) document.body.append(cursor);
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus({ preventScroll: true });
  });
}

for (const directory of document.querySelectorAll("[data-home-directory]")) {
  const stage = directory.querySelector("[data-directory-stage]");
  const track = directory.querySelector("[data-directory-track]");
  const header = document.querySelector(".portfolio-header");
  let frame = 0;
  let distance = 0;
  let inset = 0;
  let pinned = false;

  function progress() {
    return Math.max(
      0,
      Math.min(distance, inset - directory.getBoundingClientRect().top),
    );
  }

  function sync() {
    frame = 0;
    if (pinned) track.scrollLeft = progress();
  }

  function measure() {
    inset = header.offsetHeight;
    distance = track.scrollWidth - track.clientWidth;
    pinned =
      !reducedMotion.matches &&
      distance > 1;
    directory.classList.toggle("directory-pinned", pinned);
    directory.style.setProperty("--directory-offset", `${inset}px`);
    directory.style.setProperty(
      "--directory-travel",
      pinned ? `${distance}px` : "0px",
    );
    sync();
  }

  function goTo(offset, behavior) {
    const distanceY = directory.getBoundingClientRect().top - inset;
    const left = Math.max(0, Math.min(distance, offset));
    window.scrollTo({ top: window.scrollY + distanceY + left, behavior });
  }

  track.addEventListener("keydown", (event) => {
    if (
      !pinned ||
      event.target !== track ||
      !["ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    const stride = track.children[1].offsetLeft - track.children[0].offsetLeft;
    goTo(
      progress() + (event.key === "ArrowRight" ? stride : -stride),
      "smooth",
    );
  });

  track.addEventListener("focusin", (event) => {
    const card = event.target.closest("[data-project-card]");
    if (!pinned || !card) return;
    const rect = card.getBoundingClientRect();
    const left =
      track.scrollLeft + rect.left - track.getBoundingClientRect().left;
    const offset = progress();
    if (left < offset || left + rect.width > offset + track.clientWidth)
      goTo(left, "instant");
  });

  window.addEventListener(
    "scroll",
    () => {
      if (pinned && !frame) frame = requestAnimationFrame(sync);
    },
    { passive: true },
  );
  window.addEventListener("resize", measure);
  reducedMotion.addEventListener("change", measure);
  if ("ResizeObserver" in window)
    new window.ResizeObserver(measure).observe(stage);
  measure();
}
