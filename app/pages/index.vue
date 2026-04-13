<!-- app/pages/index.vue -->
<script setup lang="ts">
import type { Theme } from '~/composables/useQuiz'

const {
  scene,
  currentScaleIndex,
  currentScenarioIndex,
  currentScaleQuestion,
  currentScenarioQuestion,
  totalScaleQuestions,
  totalScenarioQuestions,
  scaleAnswers,
  scenarioAnswers,
  scaleProgress,
  scenarioProgress,
  startQuiz,
  answerScale,
  answerScenario,
  goToScaleQuestion,
  goToScenarioQuestion,
  showResult,
  restart,
} = useQuiz()

function handleStart(selectedTheme: Theme) {
  startQuiz(selectedTheme)
}
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <WelcomePage v-if="scene === 'welcome'" key="welcome" @start="handleStart" />

      <div v-else-if="scene === 'scale'" key="scale" class="quiz-scene">
        <ProgressBar
          :current="currentScaleIndex + 1"
          :total="totalScaleQuestions"
          :progress="scaleProgress"
          label="量表题"
          :answers="scaleAnswers"
          @go-to="goToScaleQuestion"
        />
        <Transition name="slide" mode="out-in">
          <ScaleQuestion
            :key="currentScaleQuestion.id"
            :question="currentScaleQuestion"
            :answer="scaleAnswers[currentScaleIndex]"
            @answer="(val: number) => answerScale(currentScaleIndex, val)"
          />
        </Transition>
      </div>

      <div v-else-if="scene === 'scenario'" key="scenario" class="quiz-scene">
        <ProgressBar
          :current="currentScenarioIndex + 1"
          :total="totalScenarioQuestions"
          label="情景题"
          :progress="scenarioProgress"
          :answers="scenarioAnswers"
          @go-to="goToScenarioQuestion"
        />
        <Transition name="slide" mode="out-in">
          <ScenarioQuestion
            :key="currentScenarioQuestion.id"
            :question="currentScenarioQuestion"
            :answer="scenarioAnswers[currentScenarioIndex]"
            @answer="(idx: number) => answerScenario(currentScenarioIndex, idx)"
          />
        </Transition>
      </div>

      <LoadingTransition v-else-if="scene === 'loading'" key="loading" @complete="showResult" />

      <ResultPage v-else-if="scene === 'result'" key="result" @restart="restart" />
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quiz-scene {
  width: 100%;
  max-width: 800px;
  padding: var(--space-lg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
