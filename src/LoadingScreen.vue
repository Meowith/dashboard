<script lang="ts" setup>
import App from "@/App.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <App class="min-h-screen"/>
    </template>
    <template #fallback>
      <div class="w-screen h-screen flex justify-center items-center border-box">
        <ProgressSpinner animationDuration=".5s" aria-label="Custom ProgressSpinner" fill="transparent"
                         strokeWidth="8" style="width: 50px; height: 50px"/>
      </div>
    </template>
  </Suspense>
</template>
