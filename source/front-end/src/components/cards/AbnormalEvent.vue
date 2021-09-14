<template>
    <div class="card-ae">
        <h6 class="card-ae-title">廠區狀態</h6>
        <h4 :class="[isAbnormal ? 'status-abnormal' : 'status-normal']"> {{status}}</h4>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isAbnormal: false,
            status: '無異常'
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.card-ae {
    background-color: #0e2e2b;
}

.card-ae-title {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
.status-normal {
    color: rgb(3, 100, 3);
    font-size: 1.5vw;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
}
.status-abnormal {
    color: red;
}
</style>
