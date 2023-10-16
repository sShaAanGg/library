<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <!-- <div class="c-avatar">
          <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
          />
        </div> -->
        <font-awesome-icon icon="user"/>
      </CHeaderNavLink>
    </template>
    <CDropdownItem v-if="auth === 'true'">
        <strong>Hi! {{account}}</strong>
        <!-- <CBadge color="warning" class="ml-auto">{{ itemsCount }}</CBadge> -->
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem v-if="auth === 'true'" @click="logout()">
      <CIcon name="cil-lock-locked" /> 登出
    </CDropdownItem>

    <CDropdownHeader v-if="auth != 'true'" tag="div" class="text-center" color="light">
      <strong>尚未登入</strong>
    </CDropdownHeader>
    <CDropdownDivider/>
    <CDropdownItem v-if="auth != 'true'" @click="login()">
      <CIcon name="cil-lock-locked" /> 登入
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return {
      itemsCount: 42,
      account: '',
      auth: ''
    }
  },
  mounted() {
    this.account = sessionStorage.getItem('USER_NAME');
    this.auth = sessionStorage.getItem('AUTH');
  },
  methods: {
    logout() {
        sessionStorage.setItem('ACCOUNT', '');
        sessionStorage.setItem('USER_NAME', '');
        sessionStorage.setItem('AUTH', false);
        sessionStorage.setItem('ROLE', 'guest');
        location.replace('/');
    },
    login() {
        this.$router.push('/dashboard');
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }

</style>
