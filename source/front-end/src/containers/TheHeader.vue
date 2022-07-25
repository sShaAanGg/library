<template>
  <CHeader class="header border-0" fixed with-subheader light>
    <CToggler in-header class="ml-1 d-lg-none" v-c-emit-root-event:toggle-sidebar-mobile />
    <CToggler in-header class="ml-1 d-md-down-none" v-c-emit-root-event:toggle-sidebar />
    <!-- <CHeaderBrand class="mx-auto d-lg-none" src="img/brand/silensys-logo.png" width="200" height="38" alt="CoreUI Logo" /> -->
    <CHeaderNav class="d-md-down-none mr-auto ">
    </CHeaderNav>

    <CHeaderNav class="mr-1">
        <TheHeaderDropdownAccnt />
    </CHeaderNav>


  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'

export default {
    name: 'TheHeader',
    components: {
        TheHeaderDropdownAccnt
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style>
.blink_me {
  animation: blinker 3s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.4;
  }
}
.px-0 {
  background-color: #3F7CAC;
}
.header {
  background-color: #3F7CAC;
}
.bread_crumb {
  background-color: #c2a0a0;
}
.border-0 {
  color: #000000;
}

</style>
