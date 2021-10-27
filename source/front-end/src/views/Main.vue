<template>
    <div>
        <CCard>
            <CCardBody>
                <h4 style="color:#8c5c7d"><CIcon name="cil-home" size="lg"/> 首頁</h4>
                <hr class="mt-0 mb-2">
            </CCardBody>
        </CCard>
    </div>
</template>


<script>
export default {
    inject: ['reload'],

    data() {
      return {

      };
    },

    created() {
      console.log(sessionStorage.getItem('WORKSTATION'))
    },

    methods: {

    }
};
</script>

<style lang="scss" scoped>
</style>