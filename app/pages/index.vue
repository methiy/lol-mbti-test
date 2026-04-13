<script setup lang="ts">
const scene = ref<'welcome' | 'scale' | 'scenario' | 'loading' | 'result'>('welcome')

function startQuiz() {
  scene.value = 'scale'
}

function onScaleComplete() {
  scene.value = 'scenario'
}

function onScenarioComplete() {
  scene.value = 'loading'
}

function onLoadingComplete() {
  scene.value = 'result'
}

function restart() {
  scene.value = 'welcome'
}
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <WelcomePage v-if="scene === 'welcome'" @start="startQuiz" />
      <div v-else-if="scene === 'scale'" key="scale">
        <p>量表题阶段（待实现）</p>
        <button @click="onScaleComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'scenario'" key="scenario">
        <p>情景题阶段（待实现）</p>
        <button @click="onScenarioComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'loading'" key="loading">
        <p>加载中...（待实现）</p>
        <button @click="onLoadingComplete">跳过</button>
      </div>
      <div v-else-if="scene === 'result'" key="result">
        <p>结果页（待实现）</p>
        <button @click="restart">重新测试</button>
      </div>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
