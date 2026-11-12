<template>
  <!-- Static hero art for low-end devices / before WebGL loads: gold line gem in orbit. -->
  <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-night" />
    <svg class="absolute left-1/2 top-[30%] h-[46vh] max-h-[460px] w-[46vh] max-w-[460px] -translate-x-1/2 -translate-y-1/2 lg:left-[68%] lg:top-1/2" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="hf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F1E2B8" />
          <stop offset="0.5" stop-color="#C9A24B" />
          <stop offset="1" stop-color="#9C7A2E" />
        </linearGradient>
        <radialGradient id="hf-glow">
          <stop offset="0" stop-color="#7A1F3D" stop-opacity="0.7" />
          <stop offset="1" stop-color="#7A1F3D" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#hf-glow)" />
      <ellipse cx="100" cy="104" rx="88" ry="26" fill="none" stroke="#C9A24B" stroke-opacity="0.5" stroke-width="0.6" transform="rotate(-12 100 104)" />
      <g fill="none" stroke="url(#hf-g)" stroke-width="1.2" stroke-linejoin="round">
        <path d="M70 62H130L148 80L100 140L52 80Z" />
        <path d="M52 80H148M70 62L80 80L100 62L120 80L130 62M80 80L100 140L120 80" />
      </g>
      <path d="M150 40C150.6 46.4 153.6 49.4 160 50C153.6 50.6 150.6 53.6 150 60C149.4 53.6 146.4 50.6 140 50C146.4 49.4 149.4 46.4 150 40Z" fill="#F1E2B8" class="animate-twinkle" style="transform-origin: 150px 50px" />
    </svg>
    <span v-for="i in 28" :key="i" class="absolute h-[2px] w-[2px] animate-twinkle rounded-full bg-gold-pale" :style="{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i % 7) * 0.45}s` }" />
  </div>
</template>
