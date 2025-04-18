<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h2>Вход в систему</h2>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Логин</label>
          <input
            id="username"
            v-model="credentials.username"
            placeholder="Введите логин"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            placeholder="Введите пароль"
            required
            :disabled="authStore.loading"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="login-btn"
        >
          {{ authStore.loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div
        v-if="authStore.error"
        class="error-alert"
      >
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['guest-only'] // Перенаправление, если пользователь уже вошел
});

const authStore = useAuthStore();
const credentials = ref({
  username: '',
  password: '',
});

const handleLogin = async () => {
  await authStore.login(credentials.value);
  // Перенаправление обрабатывается в store
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f7fafc;
  font-family: Arial, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.card-header {
  margin-bottom: 24px;
  text-align: center;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #4a5568;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #9cc11c;
      box-shadow: 0 0 0 3px rgba(156, 193, 28, 0.2);
    }
    
    &:disabled {
      background-color: #edf2f7;
      cursor: not-allowed;
    }
  }
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #9cc11c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    background-color: #8aad19;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.error-alert {
  margin-top: 16px;
  padding: 12px;
  background-color: #fed7d7;
  color: #c53030;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}
</style> 