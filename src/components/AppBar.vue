<script setup lang="ts">

</script>

<template>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-plus" aria-label="Add" />
    </template>
    <template #end>
      <div class="gap-2 flex flex-row items-center">
        <span>Welcome back, user</span>
        <img class="image"  alt="" src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg">
      </div>
    </template>
  </Toolbar>
</template>

<style scoped>
.image {
  width: 40px;
  border-radius: 100%;
}
</style>
