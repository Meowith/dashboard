<script setup lang="ts">
import App from "@/App.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <App />
    </template>
    <template #fallback>
      <div class="w-screen h-screen flex justify-center items-center border-box">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                         animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      </div>
    </template>
  </Suspense>
</template>
