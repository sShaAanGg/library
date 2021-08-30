<template>
  <CSidebar class="sidebar" fixed :show.sync="show">
    <h5 class="systemName">EnMS 能源管理系統</h5>
    <CRenderFunction class="navFuction" flat :content-to-render="nav" />
    <CSidebarMinimizer class="minimizer" @click.native="minimize = !minimize" />
  </CSidebar>
</template>

<script>
import {admin ,user ,guest} from './_nav'

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
    // switch (sessionStorage.getItem('ROLE')) {

    //   case 'admin':
    //     this.nav = admin
    //     break

    //   case 'user':
    //     this.nav = user
    //     break

    //   case 'guest':
    //     this.nav = guest
    //     break

    //   default:
    //     break
    // }
    this.nav = admin
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
/* .sidebar {
  background-color: #b1e7b1;
  color:green;
} */
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
