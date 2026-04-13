<!-- app/components/ShareCard.vue -->
<script setup lang="ts">
import type { MatchResult } from '~/types'
import { dimensions } from '~/data/dimensions'

const props = defineProps<{ result: MatchResult }>()

const shareCardRef = ref<HTMLDivElement | null>(null)
const isGenerating = ref(false)

async function downloadImage() {
  if (!shareCardRef.value || isGenerating.value) return

  isGenerating.value = true
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(shareCardRef.value, {
      width: 750,
      height: 1334,
      scale: 1,
      backgroundColor: '#1a1410',
      useCORS: true,
    })

    const link = document.createElement('a')
    const { theme } = useQuiz()
    link.download = `${theme.value}-personality-${props.result.region.nameEn.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  catch (err) {
    console.error('Failed to generate share image:', err)
  }
  finally {
    isGenerating.value = false
  }
}

// Mini radar chart drawing on a canvas inside the share card
const miniCanvasRef = ref<HTMLCanvasElement | null>(null)

function drawMiniRadar() {
  const canvas = miniCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = 280
  const center = size / 2
  const radius = size * 0.38

  canvas.width = size
  canvas.height = size

  // Rings
  for (const ring of [0.333, 0.666, 1.0]) {
    ctx.beginPath()
    for (let i = 0; i <= 8; i++) {
      const angle = (Math.PI * 2 * (i % 8)) / 8 - Math.PI / 2
      const r = ring * radius
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(168, 152, 128, 0.25)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Data polygon
  ctx.beginPath()
  dimensions.forEach((dim, i) => {
    const score = props.result.dimensionScores[dim.id]
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2
    const r = (score / 10) * radius
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(201, 168, 76, 0.2)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.8)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Labels
  ctx.font = '12px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  dimensions.forEach((dim, i) => {
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2
    const labelR = radius + 20
    const x = center + labelR * Math.cos(angle)
    const y = center + labelR * Math.sin(angle)
    ctx.fillStyle = '#a89880'
    ctx.fillText(dim.highLabel, x, y)
  })
}

onMounted(() => {
  nextTick(() => drawMiniRadar())
})

const heroName = computed(() => props.result.topHeroes[0]?.hero.name ?? '')
const heroTitle = computed(() => props.result.topHeroes[0]?.hero.title ?? '')
const matchPercent = computed(() =>
  props.result.topHeroes[0]
    ? `${Math.round(props.result.topHeroes[0].similarity * 100)}%`
    : '',
)
</script>

<template>
  <div>
    <button class="download-btn" :disabled="isGenerating" @click="downloadImage">
      {{ isGenerating ? '生成中...' : '保存结果图片' }}
    </button>

    <!-- Hidden share card for html2canvas capture -->
    <div class="share-card-wrapper">
      <div ref="shareCardRef" class="share-card">
        <div class="share-header">
          <p class="share-site-title">你属于哪片土地？</p>
          <div class="share-divider" />
        </div>

        <div class="share-region">
          <p class="share-region-name">{{ result.region.name }}</p>
          <p class="share-region-en">{{ result.region.nameEn }}</p>
        </div>

        <div class="share-radar">
          <canvas ref="miniCanvasRef" class="mini-radar-canvas" />
        </div>

        <div class="share-hero">
          <p class="share-hero-name">{{ heroName }} · {{ heroTitle }}</p>
          <p class="share-hero-match">匹配度 {{ matchPercent }}</p>
        </div>

        <div class="share-summary">
          <p>{{ result.region.description }}</p>
        </div>

        <div class="share-footer">
          <div class="share-divider" />
          <p class="share-cta">来测测你属于哪片土地</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-btn {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold));
  color: var(--color-bg);
  font-size: 1rem;
  font-weight: 600;
  padding: var(--space-md) var(--space-xl);
  border-radius: 4px;
  transition: all var(--transition-fast);
  letter-spacing: 2px;
}

.download-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hidden share card — positioned off-screen for html2canvas */
.share-card-wrapper {
  position: fixed;
  left: -9999px;
  top: 0;
}

.share-card {
  width: 750px;
  height: 1334px;
  background: #1a1410;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 60px 50px;
  font-family: 'Noto Serif SC', serif;
  color: #e8dcc8;
}

.share-header {
  text-align: center;
}

.share-site-title {
  font-size: 28px;
  color: #c9a84c;
  letter-spacing: 6px;
}

.share-divider {
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  margin: 20px auto;
}

.share-region {
  text-align: center;
}

.share-region-name {
  font-size: 42px;
  color: #c9a84c;
  margin-bottom: 8px;
}

.share-region-en {
  font-size: 16px;
  color: #a89880;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.share-radar {
  display: flex;
  justify-content: center;
}

.mini-radar-canvas {
  width: 280px;
  height: 280px;
}

.share-hero {
  text-align: center;
}

.share-hero-name {
  font-size: 24px;
  color: #e8dcc8;
  margin-bottom: 8px;
}

.share-hero-match {
  font-size: 16px;
  color: #c9a84c;
}

.share-summary {
  text-align: center;
  padding: 0 30px;
  font-size: 18px;
  line-height: 1.8;
  color: #a89880;
}

.share-footer {
  text-align: center;
}

.share-cta {
  font-size: 16px;
  color: #a89880;
  letter-spacing: 2px;
}
</style>
