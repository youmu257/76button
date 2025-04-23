<template>
  <div class="feedback-container">
    <PageHeader
      ref="pageHeader"
      :msg="msg"
      :img-src="headerImgSrc"
      :title="infoBlockTitle"
    />
    <div class="form-wrapper">
      <iframe
        src="https://forms.gle/ZtSFH3jLDnd1ocAH8"
        width="100%"
        height="700px"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      />
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

export default {
  name: 'FeedbackForm',
  components: {
    PageHeader,
  },
  props: {
    msg:  {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      headerImgSrc: 'https://pbs.twimg.com/media/FBl1nswVEAIDNyw?format=jpg&name=4096x4096',
      infoBlockTitle: '意見回饋表單',
    }
  },
}
</script>

<style scoped>
.feedback-container {
  max-width: 960px;
  margin: 0 auto;
}

.form-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 700px;
}

iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>