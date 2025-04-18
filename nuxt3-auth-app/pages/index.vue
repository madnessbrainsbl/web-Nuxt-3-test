<template>
  <div>
    <p>Redirecting to login...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

onMounted(() => {
  // If already authenticated, redirect to account page, otherwise to login
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    navigateTo('/account');
  } else {
    navigateTo('/login');
  }
});
</script>

<style scoped lang="scss">
div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  
  p {
    font-size: 18px;
    color: #666;
  }
}
</style> 