<template>
  <div class="d-flex flex-wrap align-items-center justify-content-center container">
    <img
      ref="img-circle"
      class="img-circle"
      height="200"
      :src="imgSrc"
    >
    <div>
      <p class="fs-1 py-1">
        {{ msg }}
      </p>
      <InformationBlock :title="title" />
    </div>
  </div>
</template>

<script>
import InformationBlock from './InformationBlock.vue'

export default {
  name: 'PageHeader',
  components: {
    InformationBlock,
  },
  props: {
    msg: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.img-circle{
  border-radius: 50%;
}
</style>