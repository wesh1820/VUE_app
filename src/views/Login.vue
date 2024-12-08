<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input id="username" v-model="username" type="text" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import './style.css';

  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: null,
      };
    },
    methods: {
      async login() {
  try {
    const response = await axios.post('https://api-f9me.onrender.com/users/login', {
      username: this.username,
      password: this.password,
    });
    localStorage.setItem('token', response.data.token); // Opslaan van JWT-token
    this.$router.push('/orders'); // Navigeer naar de orders-pagina
  } catch (err) {
    this.error = 'Invalid username or password.';
  }
}

    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  