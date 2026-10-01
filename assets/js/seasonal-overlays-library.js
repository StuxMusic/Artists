/**
 * SeasonalOverlaysLibrary — brief, full-viewport particle overlays (snow,
 * snowflakes, falling leaves, confetti, fireworks, hearts, pumpkins,
 * pride-month rainbows, a flying cat with a rainbow trail, or your own
 * custom icon), triggered by a click — or automatically, based on today's
 * date via a configurable seasonal calendar.
 *
 * Same technique as the Butlins.com Spooktober/Christmas homepage tiles: each
 * particle is a fixed-position div with its own randomly-generated CSS
 * @keyframes animation (a negative animation-delay desyncs particles so they
 * don't all move in lockstep) and the whole batch is torn down after a short
 * duration (unless run in infinite mode).
 *
 * No dependencies, no external assets required — the built-in presets render
 * with plain CSS shapes/emoji, not images, so they work out of the box.
 *
 * A note on "nyancat": the actual Nyan Cat sprite/GIF is a specific
 * copyrighted character, not something this library bundles. The
 * `nyancat` preset gives you the *mechanic* — a sprite flying across the
 * screen trailing a rainbow — defaulting to a 🐱 emoji. Pass your own
 * licensed art via `imageUrl` if you have one.
 *
 * ── Two ways to wire it up, and both work at once ──────────────────────────
 *
 * 1) Automatic, via data-attributes — tag ANY clickable element (an <img>,
 *    a <button>, a <div>, whatever) and it triggers on click with zero JS.
 *    Click delegation means it also picks up elements added to the page
 *    later (e.g. by a framework), no re-init needed.
 *
 *      <button data-overlay-preset="fireworks">Celebrate</button>
 *      <button data-overlay-preset="snow" data-overlay-infinite>Let it snow</button>
 *      <button data-overlay-preset="auto">Surprise me</button>
 *      <img src="/assets/spooktober-tile.png" data-overlay="/assets/pumpkin.png" alt="Spooktober">
 *
 *      <script src="seasonal-overlays-library.js"></script>
 *
 *    Optional per-element overrides (read from that element's dataset):
 *      data-overlay-preset      - a preset name below, or 'auto' to resolve
 *                                  today's date against the seasonal calendar
 *      data-overlay             - a custom image URL (works alone, or layered onto a preset
 *                                  to reskin its motion with your own art)
 *      data-overlay-count       - how many particles (preset has its own default)
 *      data-overlay-colors      - comma-separated CSS colors, e.g. "#ff0000,#00ff00" (fireworks,
 *                                  confetti, rainbows, snow, or any shape/non-emoji-glyph preset)
 *      data-overlay-random-colors - presence alone means every particle gets its own random hue,
 *                                  instead of picking from data-overlay-colors/the preset's colors
 *      data-overlay-seasons     - comma-separated seasons for `leaves`, e.g. "spring,winter"
 *      data-overlay-include     - comma-separated elements for `halloween`/`christmas`, e.g.
 *                                  "pumpkins,skulls" or "snowflakes,trees"
 *      data-overlay-duration-ms - how long the effect runs, ms (default 2200)
 *      data-overlay-infinite    - presence alone means "run forever" (until
 *                                  SeasonalOverlaysLibrary.stop() is called, or the
 *                                  trigger is clicked again). Overrides duration-ms.
 *
 * 2) Manual, from your own JS — call it directly, e.g. from a click handler
 *    you already have, a timer, on page load, etc:
 *
 *      SeasonalOverlaysLibrary.start({ preset: 'leaves' });
 *      SeasonalOverlaysLibrary.start({ preset: 'snow', durationMs: null }); // infinite
 *      SeasonalOverlaysLibrary.start({ imageUrl: '/assets/pumpkin.png' });  // fully custom, no preset
 *      SeasonalOverlaysLibrary.auto();                                     // today's calendar preset, right now
 *      SeasonalOverlaysLibrary.stop();                                     // stop an infinite run
 *
 * ── Presets ──────────────────────────────────────────────────────────────
 *   snow        - small white circles, drifting straight down, no rotation
 *   snowflakes  - ❄ glyphs, slow fall with gentle rotation
 *   leaves      - 🍁🍂🍃 glyphs (autumn), wide drift and tumbling rotation.
 *                 Takes a `seasons` array to pick/combine spring 🌱🍃, summer
 *                 🌿🍃, autumn 🍁🍂🍃, or winter 🍂🌾🪵 — e.g. `seasons: ['spring']`.
 *                 leavesSpring / leavesSummer / leavesAutumn / leavesWinter
 *                 are the same preset pre-set to a single season each.
 *   confetti    - small coloured squares, fast fall, heavy rotation
 *   fireworks   - repeating radial bursts of coloured sparks (an explode-and-fade,
 *                 not a fall). Takes `colors` to use your own palette, or
 *                 `randomColors: true` for every spark to get its own random hue
 *                 instead of picking from a fixed set
 *   pumpkins    - 🎃 glyphs, gentle fall (Halloween)
 *   skullsghosts - 💀👻 glyphs, gentle fall with tumbling rotation (Halloween)
 *   halloween   - combines pumpkins/skulls/ghosts, picked via an `include`
 *                 array (default: all three) — e.g. `include: ['pumpkins']`
 *                 for just pumpkins, or `['pumpkins', 'skulls']` to skip ghosts
 *   christmas   - candy canes 🍬, snowballs ⚪ and snowflakes ❄ by default,
 *                 picked via the same `include` array; 'trees' 🎄 and 'gifts'
 *                 🎁 are also available but not included by default
 *   hearts      - heart emoji, gentle fall (Valentine's)
 *   eastereggs  - 🥚🐣🐰 glyphs, gentle fall with tumbling rotation (Easter, April)
 *   stpatricks  - 🍀 glyphs, gentle fall with tumbling rotation (St. Patrick's Day, March 17)
 *   thanksgiving - 🦃🥧 glyphs, gentle fall (US Thanksgiving week, late November)
 *   nyeve       - 🎉🥂🍾 glyphs, gentle fall with tumbling rotation (New Year's Eve, Dec 31)
 *   rainbows    - squares in the six classic Pride-flag colours, fast fall
 *                 (Pride month)
 *   sunny       - ☀️🌞🌻 glyphs, gentle fall with tumbling rotation (August).
 *                 Combines sun/sunFace/sunflower via `include`, same as halloween/christmas.
 *   nyancat     - a sprite (🐱 by default) flying across the screen trailing
 *                 a rainbow — see the copyright note above
 *   codebug     - easter egg: the actual mojibake text produced during this
 *                 library's development by a missing charset header, plus a
 *                 few classic bug values, falling in red monospace
 *   random      - preset: 'random' picks a random preset (never codebug) and
 *                 jitters its count/size/duration, occasionally swapping in
 *                 randomColors too — a different surprise most times you use it.
 *                 Anything you pass alongside it (e.g. count) is left alone.
 *


 * ── Seasonal calendar / auto mode ───────────────────────────────────────
 * `SeasonalOverlaysLibrary.calendar` is a plain array of date ranges mapped
 * to a preset name, checked in order, first match wins. An entry is either
 * a whole month (the common case) or an explicit day range for anything
 * narrower than a full month:
 *
 *   [{ month: 6, preset: 'rainbows' },                                     // all of June
 *    { startMonth: 2, startDay: 1, endMonth: 2, endDay: 14, preset: 'hearts' }, // Feb 1-14 only
 *    ...]
 *
 * Replace or edit this array to define your own site's seasonal theme.
 * `SeasonalOverlaysLibrary.auto(options)` resolves today's date against it and
 * starts that preset immediately (options are merged in, same as start()).
 * `data-overlay-preset="auto"` does the same thing, resolved at click time.
 * If nothing in the calendar matches today, it's a no-op (nothing plays).
 *
 * ── Full start() options ────────────────────────────────────────────────
 *   preset       - name of a built-in preset above, or 'auto' (optional)
 *   imageUrl     - single custom icon image URL (shorthand for icons: [imageUrl])
 *   icons        - array of image URLs; each particle picks one at random
 *   content      - array of text glyphs (e.g. emoji); each particle picks one at random.
 *                  Always wins over `seasons`/`include` below if you pass it explicitly.
 *   seasons      - leaves only: which season(s) to combine into `content` — any of
 *                  'spring', 'summer', 'autumn', 'winter'. Default depends on the preset.
 *   include      - halloween/christmas/sunny only: which element(s) to combine into `content`.
 *                  halloween: 'pumpkins' | 'skulls' | 'ghosts'. christmas: 'candyCanes' |
 *                  'snowballs' | 'snowflakes' | 'trees' | 'gifts'. sunny: 'sun' | 'sunFace' |
 *                  'sunflower'. Default depends on the preset.
 *   colors       - array of CSS colors for plain-shape particles (and as the
 *                  text colour for non-emoji glyphs, e.g. ❄)
 *   randomColors - true = every particle gets its own random hue instead of
 *                  picking from `colors`. Overrides `colors` when both are set.
 *   shape        - 'circle' | 'square' (used when no icons/content given)
 *   behavior     - 'fall' (top-to-bottom drift, default) | 'burst' (radial
 *                  explosion, repeats) | 'fly' (flies across the screen,
 *                  optionally trailing particles)
 *   count        - particles per fall batch, per firework burst, or flying sprites
 *   minSize/maxSize - particle size in px
 *   minDuration/maxDuration - seconds per particle (fall/fly), or per burst (burst)
 *   drift        - max horizontal drift in vw over the fall (fall behavior only)
 *   rotate       - whether particles spin as they fall (fall behavior only)
 *   burstIntervalMs - gap between fireworks ticks (burst behavior only, default 900ms)
 *   burstsPerTick - simultaneous burst origins spawned per tick (burst behavior only, default 1)
 *   trail        - whether a fly particle leaves a fading trail (fly behavior only)
 *   trailColors  - CSS colors cycled through for the trail (fly behavior only)
 *   zIndex       - stacking order (default 9999)
 *   durationMs   - how long the whole effect runs before auto-cleanup (default 2200ms).
 *                  Pass null (or use data-overlay-infinite) to run until
 *                  SeasonalOverlaysLibrary.stop() is called.
 */
(function (window, document) {
  'use strict';

  const STYLE_ID = 'seasonal-overlays-style';
  let container = null;
  let styleEl = null;
  let stopTimer = null;
  let burstInterval = null;
  let flyTrailTimers = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function injectRule(cssText) {
    styleEl.sheet.insertRule(cssText, styleEl.sheet.cssRules.length);
  }

  function randomColor() {
    return 'hsl(' + Math.floor(rand(0, 360)) + ', 85%, 60%)';
  }

  // Picks a colour for a particle: a random hue if opts.randomColors is on
  // (overrides opts.colors when both are set), otherwise a random pick from
  // opts.colors, otherwise the given fallback.
  function pickColor(opts, fallback) {
    if (opts.randomColors) return randomColor();
    return opts.colors && opts.colors.length ? pick(opts.colors) : fallback;
  }

  // Fills in a particle's visual appearance: a custom image, a text glyph
  // (emoji etc), or a plain coloured shape — whichever the options provide.
  // Text glyphs get an explicit colour too: full-colour emoji ignore it, but
  // monochrome symbol glyphs (e.g. ❄) would otherwise inherit the page's
  // default text colour and can end up invisible against a dark background.
  function applyVisual(el, opts, size) {
    if (opts.icons && opts.icons.length) {
      el.style.backgroundImage = 'url("' + pick(opts.icons) + '")';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
    } else if (opts.content && opts.content.length) {
      el.textContent = pick(opts.content);
      el.style.fontSize = size + 'px';
      el.style.lineHeight = '1';
      el.style.textAlign = 'center';
      el.style.color = pickColor(opts, '#ffffff');
      if (opts.fontFamily) el.style.fontFamily = opts.fontFamily;
    } else {
      el.style.backgroundColor = pickColor(opts, '#ffffff');
      el.style.borderRadius = opts.shape === 'square' ? '2px' : '50%';
    }
  }

  // "fall" behavior: particles drift from above the viewport to below it,
  // each on its own randomly-generated keyframes with a negative delay so
  // the whole batch looks continuous instead of synchronized.
  function createFallParticle(opts) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const startX = rand(0, 100);
    const endX = startX + rand(-opts.drift, opts.drift);
    const scale = rand(0.7, 1.15);
    const duration = rand(opts.minDuration, opts.maxDuration);
    const delay = -rand(0, duration);
    const rot = opts.rotate ? rand(180, 720) * (Math.random() < 0.5 ? -1 : 1) : 0;
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(' + startX + 'vw, -10vh) scale(' + scale + ') rotate(0deg); }' +
      '100% { transform: translate(' + endX + 'vw, 110vh) scale(' + scale + ') rotate(' + rot + 'deg); }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: size + 'px',
      height: size + 'px',
      opacity: String(rand(0.5, 1)),
      pointerEvents: 'none',
      willChange: 'transform',
      animation: name + ' ' + duration + 's linear ' + delay + 's infinite'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  // "burst" behavior: particles explode outward from a point and fade —
  // used for fireworks. Each particle removes itself when its (finite)
  // animation ends, since bursts repeat and would otherwise accumulate in
  // the DOM during a long or infinite show.
  function createBurstParticle(opts, originX, originY) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const angle = rand(0, Math.PI * 2);
    const distance = rand(opts.minDistance, opts.maxDistance);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + opts.gravity;
    const duration = rand(opts.minDuration, opts.maxDuration);
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }' +
      '75% { opacity: 1; }' +
      '100% { transform: translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px) scale(0.3); opacity: 0; }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: originY + 'px',
      left: originX + 'px',
      width: size + 'px',
      height: size + 'px',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
      animation: name + ' ' + duration + 's ease-out forwards'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('animationend', function () { el.remove(); });
    return el;
  }

  function spawnFireworkBurst(opts) {
    if (!container) return;
    const bursts = opts.burstsPerTick || 1;
    for (let b = 0; b < bursts; b++) {
      const originX = rand(window.innerWidth * 0.1, window.innerWidth * 0.9);
      const originY = rand(window.innerHeight * 0.12, window.innerHeight * 0.55);
      for (let i = 0; i < opts.count; i++) {
        container.appendChild(createBurstParticle(opts, originX, originY));
      }
    }
  }

  // A single trail dot, used by "fly" behavior: fades and shrinks in place.
  function spawnTrailDot(opts, x, y) {
    if (!container) return;
    const dot = document.createElement('div');
    const size = rand(8, 16);
    const color = opts.trailColors && opts.trailColors.length ? pick(opts.trailColors) : '#ffffff';
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }' +
      '100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }' +
      '}'
    );

    Object.assign(dot.style, {
      position: 'fixed',
      top: y + 'px',
      left: x + 'px',
      width: size + 'px',
      height: size + 'px',
      background: color,
      borderRadius: '2px',
      pointerEvents: 'none',
      zIndex: '1',
      animation: name + ' 0.6s ease-out forwards'
    });
    dot.setAttribute('aria-hidden', 'true');
    container.appendChild(dot);
    dot.addEventListener('animationend', function () { dot.remove(); });
  }

  // "fly" behavior: a sprite flies straight across the viewport (either
  // direction, chosen at random) at a random height, optionally dropping a
  // fading trail behind it as it goes.
  function createFlyParticle(opts) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const y = rand(10, 80);
    const duration = rand(opts.minDuration, opts.maxDuration);
    const delay = -rand(0, duration);
    const reverse = Math.random() < 0.5;
    const fromX = reverse ? 110 : -10;
    const toX = reverse ? -10 : 110;
    const flip = reverse ? -1 : 1;
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(' + fromX + 'vw, ' + y + 'vh) scaleX(' + flip + '); }' +
      '100% { transform: translate(' + toX + 'vw, ' + y + 'vh) scaleX(' + flip + '); }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: size + 'px',
      height: size + 'px',
      pointerEvents: 'none',
      willChange: 'transform',
      zIndex: '2',
      animation: name + ' ' + duration + 's linear ' + delay + 's infinite'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');

    if (opts.trail) {
      const timer = window.setInterval(function () {
        if (!el.isConnected) { clearInterval(timer); return; }
        const rect = el.getBoundingClientRect();
        spawnTrailDot(opts, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }, 60);
      flyTrailTimers.push(timer);
    }

    return el;
  }

  // Named glyph groups that a preset can pick and combine via an option
  // (leaves: `seasons`, halloween/christmas: `include`) instead of a fixed
  // `content` array. resolveGroupedContent() turns the selected group names
  // into the actual glyph list at start() time.
  const LEAF_CONTENT_BY_SEASON = {
    spring: ['🌱', '🍃'],
    summer: ['🌿', '🍃'],
    autumn: ['🍁', '🍂', '🍃'],
    winter: ['🍂', '🌾', '🪵'] // no dedicated "bare branch" emoji exists, so: fallen leaf, dry stalk, wood
  };
  const HALLOWEEN_CONTENT_BY_ELEMENT = {
    pumpkins: ['🎃'],
    skulls: ['💀'],
    ghosts: ['👻']
  };
  const CHRISTMAS_CONTENT_BY_ELEMENT = {
    candyCanes: ['🍬'],
    snowballs: ['⚪'],
    snowflakes: ['❄', '✳', '✴'],
    trees: ['🎄'],
    gifts: ['🎁']
  };
  const SUNNY_CONTENT_BY_ELEMENT = {
    sun: ['☀️'],
    sunFace: ['🌞'],
    sunflower: ['🌻']
  };

  function resolveGroupedContent(groups, selected, fallback) {
    const keys = (selected && selected.length) ? selected : fallback;
    let out = [];
    keys.forEach(function (k) {
      if (groups[k]) out = out.concat(groups[k]);
    });
    return out;
  }

  const PRESETS = {
    snow: {
      behavior: 'fall',
      colors: ['#ffffff'],
      shape: 'circle',
      count: 60,
      minSize: 6, maxSize: 14,
      minDuration: 8, maxDuration: 16,
      drift: 8,
      rotate: false
    },
    snowflakes: {
      behavior: 'fall',
      content: ['❄', '✳', '✴'], // snowflake / asterisk glyphs, widely supported, unlike U+2745/2746
      colors: ['#ffffff'],
      count: 40,
      minSize: 14, maxSize: 26,
      minDuration: 7, maxDuration: 14,
      drift: 10,
      rotate: true
    },
    leaves: {
      // Which seasons' leaves to fall, e.g. seasons: ['spring', 'winter'] to
      // combine two. Defaults to autumn (the original preset). See
      // LEAF_CONTENT_BY_SEASON below for each season's glyphs.
      behavior: 'fall',
      seasons: ['autumn'], _contentGroup: 'leaf',
      count: 35,
      minSize: 20, maxSize: 34,
      minDuration: 6, maxDuration: 12,
      drift: 22,
      rotate: true
    },
    leavesSpring: {
      behavior: 'fall',
      seasons: ['spring'], _contentGroup: 'leaf',
      count: 35,
      minSize: 18, maxSize: 30,
      minDuration: 6, maxDuration: 12,
      drift: 20,
      rotate: true
    },
    leavesSummer: {
      behavior: 'fall',
      seasons: ['summer'], _contentGroup: 'leaf',
      count: 35,
      minSize: 20, maxSize: 32,
      minDuration: 6, maxDuration: 12,
      drift: 20,
      rotate: true
    },
    leavesAutumn: {
      behavior: 'fall',
      seasons: ['autumn'], _contentGroup: 'leaf',
      count: 35,
      minSize: 20, maxSize: 34,
      minDuration: 6, maxDuration: 12,
      drift: 22,
      rotate: true
    },
    leavesWinter: {
      // Fewer, smaller, slower — the last brown leaves and bare twigs still coming down.
      behavior: 'fall',
      seasons: ['winter'], _contentGroup: 'leaf',
      count: 22,
      minSize: 16, maxSize: 26,
      minDuration: 7, maxDuration: 13,
      drift: 14,
      rotate: true
    },
    confetti: {
      behavior: 'fall',
      colors: ['#ff4d4f', '#ffd400', '#36c5f0', '#2ecc71', '#a349ff', '#ff8a00'],
      shape: 'square',
      count: 80,
      minSize: 8, maxSize: 14,
      minDuration: 4, maxDuration: 8,
      drift: 15,
      rotate: true
    },
    fireworks: {
      behavior: 'burst',
      colors: ['#ff4d4f', '#ffd400', '#36c5f0', '#2ecc71', '#ff8a00', '#ff4dd2'],
      shape: 'circle',
      count: 48,
      minSize: 4, maxSize: 9,
      minDuration: 1, maxDuration: 1.8,
      minDistance: 90, maxDistance: 280,
      gravity: 60,
      burstsPerTick: 3,
      burstIntervalMs: 450
    },
    pumpkins: {
      behavior: 'fall',
      content: ['🎃'], // 🎃
      count: 40,
      minSize: 24, maxSize: 40,
      minDuration: 6, maxDuration: 11,
      drift: 12,
      rotate: false
    },
    skullsghosts: {
      behavior: 'fall',
      content: ['💀', '👻'], // 💀 👻
      count: 36,
      minSize: 22, maxSize: 38,
      minDuration: 6, maxDuration: 12,
      drift: 16,
      rotate: true
    },
    halloween: {
      // Pick any combination via include, e.g. include: ['pumpkins'] for
      // just pumpkins, or include: ['pumpkins', 'skulls'] to leave out
      // ghosts. Defaults to all three. See HALLOWEEN_CONTENT_BY_ELEMENT
      // below for each element's glyphs.
      behavior: 'fall',
      include: ['pumpkins', 'skulls', 'ghosts'], _contentGroup: 'halloween',
      count: 40,
      minSize: 22, maxSize: 38,
      minDuration: 6, maxDuration: 12,
      drift: 14,
      rotate: true
    },
    christmas: {
      // Same idea as halloween: pick any combination via include, e.g.
      // include: ['snowflakes'] alone, or the full default set. See
      // CHRISTMAS_CONTENT_BY_ELEMENT below for each element's glyphs —
      // 'trees' and 'gifts' are available too, just not included by default.
      behavior: 'fall',
      include: ['candyCanes', 'snowballs', 'snowflakes'], _contentGroup: 'christmas',
      count: 45,
      minSize: 18, maxSize: 32,
      minDuration: 7, maxDuration: 14,
      drift: 12,
      rotate: false
    },
    hearts: {
      behavior: 'fall',
      content: ['❤️', '💕', '💖'], // ❤️ 💕 💖
      count: 30,
      minSize: 22, maxSize: 36,
      minDuration: 6, maxDuration: 11,
      drift: 14,
      rotate: false
    },
    eastereggs: {
      behavior: 'fall',
      content: ['🥚', '🐣', '🐰'], // 🥚 🐣 🐰
      count: 32,
      minSize: 22, maxSize: 34,
      minDuration: 6, maxDuration: 11,
      drift: 14,
      rotate: true
    },
    stpatricks: {
      behavior: 'fall',
      content: ['🍀'], // 🍀
      count: 40,
      minSize: 20, maxSize: 34,
      minDuration: 6, maxDuration: 11,
      drift: 12,
      rotate: true
    },
    thanksgiving: {
      behavior: 'fall',
      content: ['🦃', '🥧'], // 🦃 🥧
      count: 32,
      minSize: 22, maxSize: 36,
      minDuration: 6, maxDuration: 12,
      drift: 14,
      rotate: false
    },
    nyeve: {
      behavior: 'fall',
      content: ['🎉', '🥂', '🍾'], // 🎉 🥂 🍾
      count: 45,
      minSize: 20, maxSize: 32,
      minDuration: 5, maxDuration: 10,
      drift: 16,
      rotate: true
    },
    rainbows: {
      // Classic six-stripe Pride flag palette.
      behavior: 'fall',
      colors: ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'],
      shape: 'square',
      count: 60,
      minSize: 10, maxSize: 18,
      minDuration: 5, maxDuration: 10,
      drift: 18,
      rotate: true
    },
    sunny: {
      // Pick any combination via include, e.g. include: ['sun'] alone. See
      // SUNNY_CONTENT_BY_ELEMENT below for each element's glyph.
      behavior: 'fall',
      include: ['sun', 'sunFace', 'sunflower'], _contentGroup: 'sunny',
      count: 35,
      minSize: 22, maxSize: 36,
      minDuration: 6, maxDuration: 12,
      drift: 14,
      rotate: true
    },
    nyancat: {
      // See the copyright note in the file header — this is the flying +
      // rainbow-trail mechanic, defaulting to a plain cat emoji. Pass your
      // own `imageUrl` for real Nyan Cat art you have the rights to use.
      behavior: 'fly',
      content: ['🐱'], // 🐱
      count: 1,
      minSize: 56, maxSize: 56,
      minDuration: 4, maxDuration: 4,
      trail: true,
      trailColors: ['#ff0018', '#ffa52c', '#ffff41', '#008018', '#0000f9', '#86007d']
    },
    codebug: {
      // An easter egg: this is the actual mojibake that showed up during
      // development when a UTF-8 snowflake glyph got served without a
      // charset header and was decoded as Latin-1 by the browser, plus a
      // couple of classic bug values for good measure. Deliberately
      // hardcoded, not a real encoding bug — kept as a preset by request.
      behavior: 'fall',
      content: ['âœ\u0083', 'âœ', 'NaN', 'undefined', '�', '0x00', 'SEGFAULT'],
      colors: ['#ff4d4f', '#ff8a8a'],
      fontFamily: 'monospace',
      count: 35,
      minSize: 13, maxSize: 20,
      minDuration: 6, maxDuration: 12,
      drift: 10,
      rotate: false
    }
  };

  // Presets eligible for preset: 'random' — everything except codebug
  // (an easter egg, not meant to surface unannounced) and random itself.
  const RANDOM_PRESET_POOL = Object.keys(PRESETS).filter(function (name) {
    return name !== 'codebug';
  });

  // Jitters a numeric option by a random factor so a random preset doesn't
  // always come out looking identical to its own fixed defaults.
  function jitter(value, min) {
    return Math.max(min, Math.round(value * rand(0.6, 1.7)));
  }

  // Jitters opts in place, but never overrides a value the caller explicitly
  // passed in `overrides` (SeasonalOverlaysLibrary.start()'s own options
  // argument) — random only fills in what wasn't asked for specifically.
  function randomizeValues(opts, overrides) {
    if (overrides.count === undefined) opts.count = jitter(opts.count, 4);
    if (overrides.minSize === undefined) opts.minSize = jitter(opts.minSize, 4);
    if (overrides.maxSize === undefined) opts.maxSize = Math.max(opts.minSize + 2, jitter(opts.maxSize, opts.minSize + 2));
    if (overrides.minDuration === undefined) opts.minDuration = Math.max(0.5, opts.minDuration * rand(0.7, 1.5));
    if (overrides.maxDuration === undefined) opts.maxDuration = Math.max(opts.minDuration + 0.3, opts.maxDuration * rand(0.7, 1.5));
    // About a third of the time, and only for presets that use plain-colour
    // shapes/glyphs (not images or fixed emoji), go full random-hue instead
    // of the preset's own palette.
    if (overrides.randomColors === undefined && opts.colors && opts.colors.length && Math.random() < 0.35) {
      opts.randomColors = true;
    }
    return opts;
  }

  // A "classic" seasonal calendar. First matching range wins. Replace this
  // array (or edit it in place) to define your own site's seasonal theme —
  // see the header comment for the shape of each entry.
  // Every month resolves to *something* — narrower entries for a specific
  // occasion are listed before the whole-month fallback for the rest of
  // that month, so first-match-wins gives them priority.
  const SEASONAL_CALENDAR = [
    { startMonth: 1, startDay: 1, endMonth: 1, endDay: 2, preset: 'fireworks' },      // New Year
    { startMonth: 1, startDay: 3, endMonth: 1, endDay: 31, preset: 'leavesWinter' },  // Rest of January
    { startMonth: 2, startDay: 1, endMonth: 2, endDay: 14, preset: 'hearts' },        // Valentine's season
    { startMonth: 2, startDay: 15, endMonth: 2, endDay: 28, preset: 'leavesWinter' }, // Rest of February
    { startMonth: 3, startDay: 1, endMonth: 3, endDay: 16, preset: 'leavesSpring' },   // March, before St. Patrick's Day
    { startMonth: 3, startDay: 17, endMonth: 3, endDay: 17, preset: 'stpatricks' },   // St. Patrick's Day
    { startMonth: 3, startDay: 18, endMonth: 3, endDay: 31, preset: 'leavesSpring' },  // Rest of March
    { month: 4, preset: 'eastereggs' },                                              // Easter (April)
    { month: 5, preset: 'leavesSpring' },                                            // May
    { month: 6, preset: 'rainbows' },                                                // Pride month
    { startMonth: 7, startDay: 1, endMonth: 7, endDay: 5, preset: 'fireworks' },      // Independence Day window
    { startMonth: 7, startDay: 6, endMonth: 7, endDay: 31, preset: 'leavesSummer' },  // Rest of July
    { month: 8, preset: 'sunny' },                                                   // August
    { month: 9, preset: 'leavesAutumn' },                                            // Early autumn
    { startMonth: 10, startDay: 1, endMonth: 10, endDay: 24, preset: 'pumpkins' },    // Halloween run-up
    { startMonth: 10, startDay: 25, endMonth: 10, endDay: 31, preset: 'skullsghosts' }, // Halloween week
    { startMonth: 11, startDay: 1, endMonth: 11, endDay: 7, preset: 'fireworks' },    // Bonfire Night week
    { startMonth: 11, startDay: 8, endMonth: 11, endDay: 21, preset: 'leavesAutumn' }, // November, before Thanksgiving
    { startMonth: 11, startDay: 22, endMonth: 11, endDay: 28, preset: 'thanksgiving' }, // Thanksgiving week (approximate — the 4th Thursday moves, this is a fixed best-fit range)
    { startMonth: 11, startDay: 29, endMonth: 11, endDay: 30, preset: 'leavesAutumn' }, // Rest of November
    { startMonth: 12, startDay: 1, endMonth: 12, endDay: 23, preset: 'snow' },        // December, before Christmas week
    { startMonth: 12, startDay: 24, endMonth: 12, endDay: 30, preset: 'christmas' },  // Christmas week
    { startMonth: 12, startDay: 31, endMonth: 12, endDay: 31, preset: 'nyeve' }       // New Year's Eve
  ];

  // A calendar entry is either a whole month (`{ month: 4, preset: ... }`) or
  // an explicit day range within/across months (`{ startMonth, startDay,
  // endMonth, endDay, preset }`) for anything narrower than a full month.
  function resolveAutoPreset(date, calendar) {
    date = date || new Date();
    const list = calendar || SEASONAL_CALENDAR;
    const year = date.getFullYear();
    const t = date.getTime();
    for (let i = 0; i < list.length; i++) {
      const entry = list[i];
      const startMonth = entry.month || entry.startMonth;
      const endMonth = entry.month || entry.endMonth;
      const startDay = entry.month ? 1 : entry.startDay;
      const endDay = entry.month ? new Date(year, endMonth, 0).getDate() : entry.endDay;
      const start = new Date(year, startMonth - 1, startDay, 0, 0, 0, 0).getTime();
      const end = new Date(year, endMonth - 1, endDay, 23, 59, 59, 999).getTime();
      if (t >= start && t <= end) return entry.preset;
    }
    return null;
  }

  const DEFAULTS = {
    preset: null,
    imageUrl: '',
    icons: [],
    content: [],
    seasons: [],
    include: [],
    colors: [],
    randomColors: false,
    fontFamily: '',
    shape: 'circle',
    behavior: 'fall',
    count: 40,
    minSize: 20, maxSize: 45,
    minDuration: 6, maxDuration: 12,
    drift: 12,
    rotate: false,
    minDistance: 80, maxDistance: 240,
    gravity: 60,
    burstsPerTick: 1,
    burstIntervalMs: 900,
    trail: false,
    trailColors: [],
    zIndex: 9999,
    durationMs: 2200
  };

  const SeasonalOverlaysLibrary = {
    presets: PRESETS,
    calendar: SEASONAL_CALENDAR,
    resolveAutoPreset: function (date) { return resolveAutoPreset(date, this.calendar); },

    start: function (options) {
      this.stop(); // clear any run already in progress

      options = Object.assign({}, options);
      let presetName = options.preset;
      const wasRandom = presetName === 'random';

      if (presetName === 'auto') {
        presetName = this.resolveAutoPreset(new Date());
        if (!presetName) {
          console.info('SeasonalOverlaysLibrary.start: no seasonal preset configured for today');
          return;
        }
      } else if (wasRandom) {
        presetName = pick(RANDOM_PRESET_POOL);
      }

      const preset = presetName ? PRESETS[presetName] : null;
      if (presetName && !preset) {
        console.warn('SeasonalOverlaysLibrary.start: unknown preset "' + presetName + '"');
      }

      const opts = Object.assign({}, DEFAULTS, preset || {}, options);
      if (wasRandom) {
        opts.preset = presetName; // reflect the preset actually picked, not the literal 'random'
        randomizeValues(opts, options);
      }

      // Shorthand: a single imageUrl becomes a one-item icons array, and
      // layers on top of (reskins) whatever preset motion was requested.
      if (opts.imageUrl && !options.icons) {
        opts.icons = [opts.imageUrl];
      }

      // leaves' `seasons` and halloween/christmas's `include` resolve to an
      // actual `content` glyph array here, unless the caller already passed
      // one explicitly (which always wins).
      if (!options.content) {
        if (opts._contentGroup === 'leaf') {
          opts.content = resolveGroupedContent(LEAF_CONTENT_BY_SEASON, opts.seasons, ['autumn']);
        } else if (opts._contentGroup === 'halloween') {
          opts.content = resolveGroupedContent(HALLOWEEN_CONTENT_BY_ELEMENT, opts.include, ['pumpkins', 'skulls', 'ghosts']);
        } else if (opts._contentGroup === 'christmas') {
          opts.content = resolveGroupedContent(CHRISTMAS_CONTENT_BY_ELEMENT, opts.include, ['candyCanes', 'snowballs', 'snowflakes']);
        } else if (opts._contentGroup === 'sunny') {
          opts.content = resolveGroupedContent(SUNNY_CONTENT_BY_ELEMENT, opts.include, ['sun', 'sunFace', 'sunflower']);
        }
      }

      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);

      container = document.createElement('div');
      container.id = 'seasonal-overlays-container';
      Object.assign(container.style, {
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: String(opts.zIndex)
      });
      document.body.appendChild(container);

      if (opts.behavior === 'burst') {
        spawnFireworkBurst(opts);
        burstInterval = window.setInterval(function () { spawnFireworkBurst(opts); }, opts.burstIntervalMs);
      } else if (opts.behavior === 'fly') {
        for (let i = 0; i < opts.count; i++) {
          container.appendChild(createFlyParticle(opts));
        }
      } else {
        for (let i = 0; i < opts.count; i++) {
          container.appendChild(createFallParticle(opts));
        }
      }

      if (opts.durationMs) {
        stopTimer = window.setTimeout(function () { SeasonalOverlaysLibrary.stop(); }, opts.durationMs);
      }
    },

    auto: function (options) {
      this.start(Object.assign({ preset: 'auto' }, options));
    },

    stop: function () {
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      if (burstInterval) { clearInterval(burstInterval); burstInterval = null; }
      flyTrailTimers.forEach(function (t) { clearInterval(t); });
      flyTrailTimers = [];
      if (container) { container.remove(); container = null; }
      if (styleEl) { styleEl.remove(); styleEl = null; }
    }
  };

  // Click delegation: any element tagged with data-overlay or
  // data-overlay-preset triggers the effect on click — img, button, div,
  // doesn't matter. Delegated on document so it also works for elements
  // added to the page after this script runs. Runs alongside manual
  // SeasonalOverlaysLibrary.start() calls; neither disables the other.
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-overlay], [data-overlay-preset]');
    if (!trigger) return;

    const imageUrl = trigger.getAttribute('data-overlay');
    const preset = trigger.getAttribute('data-overlay-preset');
    if (!imageUrl && !preset) return;

    const overrides = {};
    if (preset) overrides.preset = preset;
    if (imageUrl) overrides.imageUrl = imageUrl;
    if (trigger.dataset.overlayCount) {
      overrides.count = Number(trigger.dataset.overlayCount);
    }
    if (trigger.dataset.overlayColors) {
      overrides.colors = trigger.dataset.overlayColors.split(',').map(function (s) { return s.trim(); });
    }
    if (trigger.hasAttribute('data-overlay-random-colors')) {
      overrides.randomColors = true;
    }
    if (trigger.dataset.overlaySeasons) {
      overrides.seasons = trigger.dataset.overlaySeasons.split(',').map(function (s) { return s.trim(); });
    }
    if (trigger.dataset.overlayInclude) {
      overrides.include = trigger.dataset.overlayInclude.split(',').map(function (s) { return s.trim(); });
    }
    if (trigger.hasAttribute('data-overlay-infinite')) {
      overrides.durationMs = null;
    } else if (trigger.dataset.overlayDurationMs) {
      overrides.durationMs = Number(trigger.dataset.overlayDurationMs);
    }

    SeasonalOverlaysLibrary.start(overrides);
  });

  window.SeasonalOverlaysLibrary = SeasonalOverlaysLibrary;
})(window, document);
