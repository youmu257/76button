<template>
  <div class="info-block background">
    <p class="fs-3">
      {{ title }}
    </p>
    <div class="container">
      <div class="d-flex flex-wrap justify-content-center">
        <div class="col">
          <a
            href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-youtube" />
          </a>
        </div>
        <div class="col">
          <a
            href="https://twitter.com/Chilla_Storia"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-twitter" />
          </a>
        </div>
        <div class="col">
          <a
            href="https://discord.gg/Y4fp3k2"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-discord" />
          </a>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-center">
        <div class="col">
          <a
            href="https://www.facebook.com/Chilla76?locale=zh_TW"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-facebook" />
          </a>
        </div>
        <div class="col">
          <a
            href="https://www.plurk.com/Chilla76"
            target="_blank"
            rel="noopener"
          >
            <img
              width="48"
              height="48"
              style="margin-top: 9px;"
              :src="require('@/assets/plurk.png')"
            >
          </a>
        </div>
        <div class="col">
          <a
            href="https://bsky.app/profile/chillastoria.bsky.social"
            target="_blank"
            rel="noopener"
          >
            <img
              width="48"
              height="42"
              style="margin-top: 14px;"
              src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bluesky_Logo.svg"
            >
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'InformationBlock',
  props: {
    title:  {
      type: String,
      default: ''
    },
  },
}
</script>
<style>
.info-block .bi-twitter{
  font-size: 3rem;
  color: #0d6efd;
}
.info-block .bi-youtube{
  font-size: 3rem;
  color: #f40;
}
.info-block .bi-discord{
  font-size: 3rem;
  color: #7289d9;
}
.info-block .bi-facebook{
  font-size: 3rem;
  color: #1877F2;
}
</style>