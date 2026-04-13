// app/composables/useQuiz.ts
import { scaleQuestions } from '~/data/scaleQuestions'
import { scenarioQuestions } from '~/data/scenarioQuestions'

export type Scene = 'welcome' | 'scale' | 'scenario' | 'loading' | 'result'

const scene = ref<Scene>('welcome')
const scaleAnswers = ref<(number | null)[]>(new Array(scaleQuestions.length).fill(null))
const scenarioAnswers = ref<(number | null)[]>(new Array(scenarioQuestions.length).fill(null))
const currentScaleIndex = ref(0)
const currentScenarioIndex = ref(0)

export function useQuiz() {
  const totalScaleQuestions = scaleQuestions.length
  const totalScenarioQuestions = scenarioQuestions.length

  const currentScaleQuestion = computed(() => scaleQuestions[currentScaleIndex.value])
  const currentScenarioQuestion = computed(() => scenarioQuestions[currentScenarioIndex.value])

  const scaleProgress = computed(() =>
    scaleAnswers.value.filter((a) => a !== null).length / totalScaleQuestions,
  )
  const scenarioProgress = computed(() =>
    scenarioAnswers.value.filter((a) => a !== null).length / totalScenarioQuestions,
  )

  function startQuiz() {
    scaleAnswers.value = new Array(totalScaleQuestions).fill(null)
    scenarioAnswers.value = new Array(totalScenarioQuestions).fill(null)
    currentScaleIndex.value = 0
    currentScenarioIndex.value = 0
    scene.value = 'scale'
  }

  function answerScale(questionIndex: number, value: number) {
    scaleAnswers.value[questionIndex] = value
    setTimeout(() => {
      if (questionIndex < totalScaleQuestions - 1) {
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
      if (questionIndex < totalScenarioQuestions - 1) {
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
    if (index >= 0 && index < totalScaleQuestions) {
      currentScaleIndex.value = index
    }
  }

  function goToScenarioQuestion(index: number) {
    if (index >= 0 && index < totalScenarioQuestions) {
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
