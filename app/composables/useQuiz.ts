// app/composables/useQuiz.ts
import type { DimensionId, ScaleQuestion, ScenarioQuestion } from '~/types'
import { scaleQuestions as allScaleQuestions } from '~/data/scaleQuestions'
import { scenarioQuestions as lolScenarios } from '~/data/scenarioQuestions'
import { scenarioQuestions as opScenarios } from '~/data/onepiece/scenarioQuestions'
import { DIMENSION_IDS } from '~/data/dimensions'

export type Scene = 'welcome' | 'scale' | 'scenario' | 'loading' | 'result'
export type Theme = 'lol' | 'onepiece'

const SCALE_PER_DIMENSION = 4
const SCENARIO_COUNT = 10

/** Shuffle array in-place (Fisher-Yates) and return it */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Pick random scale questions: SCALE_PER_DIMENSION per dimension */
function pickScaleQuestions(): ScaleQuestion[] {
  const picked: ScaleQuestion[] = []
  for (const dimId of DIMENSION_IDS) {
    const pool = allScaleQuestions.filter((q) => q.dimensionId === dimId)
    const shuffled = shuffle([...pool])
    picked.push(...shuffled.slice(0, SCALE_PER_DIMENSION))
  }
  return shuffle(picked) // shuffle final order so dimensions are mixed
}

/**
 * Pick scenario questions with balanced dimension coverage.
 * First ensures each dimension is covered by at least one question,
 * then fills remaining slots randomly.
 */
function pickScenarioQuestions(pool: ScenarioQuestion[]): ScenarioQuestion[] {
  const shuffledPool = shuffle([...pool])
  const picked: ScenarioQuestion[] = []
  const pickedIds = new Set<number>()
  const coveredDimensions = new Set<DimensionId>()

  // Phase 1: Cover each dimension with one question
  for (const dimId of DIMENSION_IDS) {
    if (coveredDimensions.has(dimId)) continue
    const candidate = shuffledPool.find(
      (q) => q.primaryDimension === dimId && !pickedIds.has(q.id),
    )
    if (candidate) {
      picked.push(candidate)
      pickedIds.add(candidate.id)
      coveredDimensions.add(dimId)
    }
  }

  // Phase 2: Fill remaining slots from unused questions
  const remaining = SCENARIO_COUNT - picked.length
  if (remaining > 0) {
    const extras = shuffledPool
      .filter((q) => !pickedIds.has(q.id))
      .slice(0, remaining)
    picked.push(...extras)
  }

  return shuffle(picked)
}

const scene = ref<Scene>('welcome')
const theme = ref<Theme>('lol')
const activeScaleQuestions = ref<ScaleQuestion[]>([])
const activeScenarioQuestions = ref<ScenarioQuestion[]>([])
const scaleAnswers = ref<(number | null)[]>([])
const scenarioAnswers = ref<(number | null)[]>([])
const currentScaleIndex = ref(0)
const currentScenarioIndex = ref(0)

export function useQuiz() {
  const totalScaleQuestions = computed(() => activeScaleQuestions.value.length)
  const totalScenarioQuestions = computed(() => activeScenarioQuestions.value.length)

  const currentScaleQuestion = computed(() => activeScaleQuestions.value[currentScaleIndex.value])
  const currentScenarioQuestion = computed(() => activeScenarioQuestions.value[currentScenarioIndex.value])

  const scaleProgress = computed(() => {
    const total = totalScaleQuestions.value
    if (total === 0) return 0
    return scaleAnswers.value.filter((a) => a !== null).length / total
  })
  const scenarioProgress = computed(() => {
    const total = totalScenarioQuestions.value
    if (total === 0) return 0
    return scenarioAnswers.value.filter((a) => a !== null).length / total
  })

  function startQuiz(selectedTheme: Theme = 'lol') {
    theme.value = selectedTheme
    // Pick fresh random questions
    activeScaleQuestions.value = pickScaleQuestions()
    const scenarioPool = selectedTheme === 'lol' ? lolScenarios : opScenarios
    activeScenarioQuestions.value = pickScenarioQuestions(scenarioPool)
    scaleAnswers.value = new Array(activeScaleQuestions.value.length).fill(null)
    scenarioAnswers.value = new Array(activeScenarioQuestions.value.length).fill(null)
    currentScaleIndex.value = 0
    currentScenarioIndex.value = 0
    scene.value = 'scale'
  }

  function answerScale(questionIndex: number, value: number) {
    scaleAnswers.value[questionIndex] = value
    setTimeout(() => {
      if (questionIndex < totalScaleQuestions.value - 1) {
        currentScaleIndex.value = questionIndex + 1
      }
      else {
        const allAnswered = scaleAnswers.value.every((a) => a !== null)
        if (allAnswered) {
          scene.value = 'scenario'
        }
      }
    }, 500)
  }

  function answerScenario(questionIndex: number, optionIndex: number) {
    scenarioAnswers.value[questionIndex] = optionIndex
    setTimeout(() => {
      if (questionIndex < totalScenarioQuestions.value - 1) {
        currentScenarioIndex.value = questionIndex + 1
      }
      else {
        const allAnswered = scenarioAnswers.value.every((a) => a !== null)
        if (allAnswered) {
          scene.value = 'loading'
        }
      }
    }, 500)
  }

  function goToScaleQuestion(index: number) {
    if (index >= 0 && index < totalScaleQuestions.value) {
      currentScaleIndex.value = index
    }
  }

  function goToScenarioQuestion(index: number) {
    if (index >= 0 && index < totalScenarioQuestions.value) {
      currentScenarioIndex.value = index
    }
  }

  function showResult() {
    scene.value = 'result'
  }

  function restart() {
    scene.value = 'welcome'
  }

  return {
    scene: readonly(scene),
    theme: readonly(theme),
    activeScaleQuestions: readonly(activeScaleQuestions),
    activeScenarioQuestions: readonly(activeScenarioQuestions),
    scaleAnswers: readonly(scaleAnswers),
    scenarioAnswers: readonly(scenarioAnswers),
    currentScaleIndex: readonly(currentScaleIndex),
    currentScenarioIndex: readonly(currentScenarioIndex),
    currentScaleQuestion,
    currentScenarioQuestion,
    totalScaleQuestions,
    totalScenarioQuestions,
    scaleProgress,
    scenarioProgress,
    startQuiz,
    answerScale,
    answerScenario,
    goToScaleQuestion,
    goToScenarioQuestion,
    showResult,
    restart,
  }
}
