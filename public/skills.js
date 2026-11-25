const field = document.querySelector("[data-skill-motion]");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const Matter = window.Matter;
if (field && Matter) mountSkills(field, Matter);

function mountSkills(
  field,
  { Bodies, Body, Composite, Constraint, Engine, Sleeping },
) {
  const labels = [...field.children];
  const engine = Engine.create({
    gravity: { x: 0, y: 0.36 },
    enableSleeping: true,
    positionIterations: 9,
    velocityIterations: 6,
  });
  const step = 1000 / 120;
  let chips = [];
  let frame = 0;
  let previous;
  let elapsed = 0;
  let drag;
  let visible = false;
  let initialized = false;

  function render() {
    for (const { label, body, origin } of chips) {
      const { x, y } = body.position;
      label.style.transform = `translate3d(${x - origin.x}px, ${y - origin.y}px, 0) rotate(${body.angle}rad)`;
    }
  }

  function start() {
    if (!frame && visible && initialized) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    if (!visible || !initialized) {
      previous = undefined;
      elapsed = 0;
      return;
    }
    elapsed += previous === undefined ? step : Math.min(now - previous, 34);
    previous = now;
    while (elapsed >= step) {
      if (drag) {
        const point = drag.joint.pointA;
        const dx = drag.target.x - point.x;
        const dy = drag.target.y - point.y;
        const ratio = Math.min(1, 11 / (Math.hypot(dx, dy) || 1));
        point.x += dx * ratio;
        point.y += dy * ratio;
      }
      Engine.update(engine, step);
      elapsed -= step;
    }
    render();
    if (drag || chips.some(({ body }) => !body.isSleeping)) start();
    else {
      previous = undefined;
      elapsed = 0;
    }
  }

  function release() {
    if (!drag) return;
    const { joint, label } = drag;
    drag = undefined;
    Composite.remove(engine.world, joint);
    delete label.dataset.dragging;
    start();
  }

  function build() {
    release();
    initialized = false;
    field.removeAttribute("data-physics-active");
    for (const label of labels) {
      label.style.removeProperty("transform");
      label.tabIndex = -1;
    }
    Composite.clear(engine.world);
    Engine.clear(engine);
    chips = [];
    if (motion.matches) return;

    const width = field.clientWidth;
    const height = field.clientHeight;
    const edge = 70;
    const wall = (x, y, w, h) =>
      Bodies.rectangle(x, y, w, h, { isStatic: true, friction: 0.83 });
    Composite.add(engine.world, [
      wall(width / 2, height + edge / 2 - 3, width + 2 * edge, edge),
      wall(-edge / 2, height / 2, edge, height + 2 * edge),
      wall(width + edge / 2, height / 2, edge, height + 2 * edge),
      wall(width / 2, -edge / 2, width + 2 * edge, edge),
    ]);

    chips = labels.map((label, i) => {
      const w = label.offsetWidth;
      const h = label.offsetHeight;
      const origin = {
        x: label.offsetLeft + w / 2,
        y: label.offsetTop + h / 2,
      };
      const body = Bodies.rectangle(
        origin.x,
        Math.max(h, origin.y - 44 - (i % 3) * 9),
        w,
        h,
        {
          chamfer: { radius: h * 0.44 },
          friction: 0.46,
          frictionStatic: 0.65,
          frictionAir: 0.034,
          restitution: 0.15,
          sleepThreshold: 40,
        },
      );
      Body.setAngle(body, (i % 2 ? 1 : -1) * 0.075);
      label.tabIndex = 0;
      return { label, body, origin };
    });
    Composite.add(
      engine.world,
      chips.map((chip) => chip.body),
    );
    field.setAttribute("data-physics-active", "");
    initialized = true;
    previous = undefined;
    elapsed = 0;
    render();
    start();
  }

  function locate(event) {
    const rect = field.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
    };
  }

  field.addEventListener("pointerdown", (event) => {
    if (!initialized || drag || event.button !== 0) return;
    const chip = chips.find(
      ({ label }) => label === event.target.closest("li"),
    );
    if (!chip) return;
    const target = locate(event);
    Sleeping.set(chip.body, false);
    Body.setVelocity(chip.body, { x: 0, y: 0 });
    const joint = Constraint.create({
      pointA: { ...target },
      bodyB: chip.body,
      pointB: {
        x: target.x - chip.body.position.x,
        y: target.y - chip.body.position.y,
      },
      length: 0,
      stiffness: 0.12,
      damping: 0.16,
    });
    drag = { ...chip, joint, target, id: event.pointerId };
    chip.label.setPointerCapture(event.pointerId);
    chip.label.setAttribute("data-dragging", "");
    Composite.add(engine.world, joint);
    start();
  });

  field.addEventListener(
    "pointermove",
    (event) => {
      if (drag?.id === event.pointerId) drag.target = locate(event);
    },
    { passive: true },
  );
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    field.addEventListener(type, (event) => {
      if (drag?.id === event.pointerId) release();
    });
  }

  field.addEventListener("keydown", (event) => {
    if (!initialized) return;
    const chip = chips.find(({ label }) => label === event.target);
    if (!chip || !["ArrowLeft", "ArrowRight", "Escape"].includes(event.key))
      return;
    event.preventDefault();
    if (event.key === "Escape") {
      build();
      return;
    }
    Sleeping.set(chip.body, false);
    Body.setVelocity(chip.body, {
      x: event.key === "ArrowLeft" ? -3.5 : 3.5,
      y: -1.8,
    });
    start();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !initialized) build();
        start();
      },
      { threshold: 0.25 },
    ).observe(field);
  } else {
    visible = true;
    build();
  }
  window.addEventListener("resize", () => {
    if (visible || initialized) build();
  });
  motion.addEventListener("change", () => {
    if (visible || initialized) build();
  });
  document.fonts?.ready.then(() => {
    if (initialized) build();
  });
}
