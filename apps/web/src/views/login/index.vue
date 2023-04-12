<template>
  <page-container
    absolute
    layout="flex-center">
    <n-card class="form-container desktop:w-40%! mobile:w-90%!">
      <n-tabs
        class="card-tabs"
        default-value="login"
        justify-content="center"
        size="large"
        animated
        style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
        <n-tab-pane
          name="login"
          tab="登录">
          <login-form></login-form>
        </n-tab-pane>
        <n-tab-pane
          name="register"
          tab="注册">
          <register-form></register-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </page-container>
</template>

<script lang="ts" setup>
import LoginForm from './components/login-form.vue'
import RegisterForm from './components/register-form.vue'
</script>

<route lang="yaml">
name: login
meta:
  layout: default
  requireAuth: false
</route>
