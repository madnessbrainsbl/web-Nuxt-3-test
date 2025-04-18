<template>
  <div class="login-container">
    <UCard class="login-card">
      <template #header>
        <h2 class="text-xl font-semibold">Login</h2>
      </template>

      <UForm :state="credentials" @submit="handleLogin">
        <UFormGroup label="Username (Email)" name="username" class="mb-4">
          <UInput
            v-model="credentials.username"
            placeholder="david.jones@creds.com"
            icon="i-heroicons-envelope"
            required
            :disabled="authStore.loading"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mb-6">
          <UInput
            v-model="credentials.password"
            type="password"
            placeholder="********"
            icon="i-heroicons-lock-closed"
            required
            :disabled="authStore.loading"
          />
        </UFormGroup>

        <UButton
          type="submit"
          label="Login"
          :loading="authStore.loading"
          block
          size="lg"
        />
      </UForm>

      <UAlert
        v-if="authStore.error"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        :title="authStore.error"
        class="mt-6"
        :closable="true"
        @close="authStore.error = null"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'auth', // Optional: Use a specific layout for auth pages
   middleware: ['guest-only'] // Redirect if already logged in
});

const authStore = useAuthStore();
const credentials = ref({
  username: '',
  password: '',
});

const handleLogin = async () => {
  await authStore.login(credentials.value);
  // Redirect handled within the store action
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; // Adjust as needed
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px; // Limit card width
}
</style>