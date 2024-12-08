<template>
    <div id="app">
      <router-view></router-view> <!-- Dit toont de actieve route -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
  </script>
  
  <style>
  /* Algemene stijlen voor de app */
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style>
  