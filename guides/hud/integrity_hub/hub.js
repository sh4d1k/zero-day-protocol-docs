/* Integrity hub guide — builds the mock hub and runs one page's loop.
 * window.HubDemo.run(container, { segments: ['plan','auto','auto','manual'], script }) */
(function () {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const MARK = { plan: 'PLAN', auto: '>', manual: 'II' };

  function build(container, segments) {
    const timeline = container.querySelector('.hub-timeline');
    timeline.innerHTML = '';
    const segs = [];
    const bulbs = [];
    segments.forEach((kind) => {
      const seg = document.createElement('div');
      seg.className = `hub-seg ${kind}`;
      seg.innerHTML = `<div class="fill"></div><span class="mark">${MARK[kind]}</span>`;
      timeline.appendChild(seg);
      segs.push(seg);
      if (kind !== 'plan') {
        const bulb = document.createElement('div');
        bulb.className = 'hub-bulb lit';
        timeline.appendChild(bulb);
        bulbs.push(bulb);
      }
    });
    return { segs, bulbs };
  }

  /** Animate a fill from `from` to `to` (0..1) over `ms`. */
  function fill(seg, from, to, ms) {
    const el = seg.querySelector('.fill');
    return new Promise((resolve) => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms);
        el.style.width = `${(from + (to - from) * t) * 100}%`;
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  function run(container, opts) {
    const status = container.querySelector('.hub-line.status');
    const caption = container.querySelector('.hub-caption');
    const say = (s, c) => { if (status) status.textContent = s; if (caption && c !== undefined) caption.textContent = c; };
    let alive = true;
    const loop = async () => {
      while (alive) {
        const hub = build(container, opts.segments);
        await opts.script({ ...hub, fill, wait, say, container });
        await wait(1400);
      }
    };
    window.addEventListener('load', () => setTimeout(loop, 250));
  }

  window.HubDemo = { run, fill, wait };
})();
