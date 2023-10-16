<template>
    <CSidebar class="sidebar" fixed :minimize="minimize" :show.sync="show">
<!--         <h5 class="systemName">EnMS</h5> -->
        <CSidebarBrand to="/">
            <!-- <img
                src="img/books/ato.jpg"
                alt="Logo"
                width="170"
                height="46"
                class="c-sidebar-brand-full"
            /> -->
        </CSidebarBrand>
        <CRenderFunction class="navFuction" flat :content-to-render="nav" />
        <CSidebarMinimizer
            class="minimizer"
            @click.native="minimize = !minimize"
        />
    </CSidebar>
</template>

<script>
import {admin, user, guest} from './_nav'

export default {
  name: 'TheSidebar',
  data () {
    return {
      minimize: true,
      nav:[],
      show: 'responsive'
    }
  },
  created () {
    switch (sessionStorage.getItem('ROLE')) {

        case 'admin':
            this.nav = admin;
            break;

        case 'user':
            this.nav = user;
            break;

        case 'guest':
            this.nav = guest;
            break;

        default:
            this.nav = guest;
            break;
    }
    // this.nav = admin
  },
  mounted () {
    this.$root.$on('toggle-sidebar', () => {
      const sidebarOpened = this.show === true || this.show === 'responsive'
      this.show = sidebarOpened ? false : 'responsive'
    })
    this.$root.$on('toggle-sidebar-mobile', () => {
      const sidebarClosed = this.show === 'responsive' || this.show === false
      this.show = sidebarClosed ? true : 'responsive'
    })
  },
}
</script>

<style scoped>
.minimizer {
    background-color: #000000;
}
.systemName {
    background-color: #000000;
    color: gainsboro;
    padding-top: 20px;
    padding-left: 20px;
    padding-bottom: 20px;
}
.navFunction {
    color: green;
    background-color: white;
}
</style>
