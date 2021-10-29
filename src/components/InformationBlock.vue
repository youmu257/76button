<template>
    <div class="info-block background">
        <p class="fs-3">祈菈的資訊</p>
        <div class="container">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-2 col-4">
                    <a
                        href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about"
                        target="_blank"
                        rel="noopener">
                        <i class="bi bi-youtube">
                        </i>
                    </a>
                </div>
                <div class="col-md-2 col-4">
                    <a
                        href="https://twitter.com/Chilla_Storia"
                        target="_blank"
                        rel="noopener">
                        <i class="bi bi-twitter">
                        </i>
                    </a>
                </div>
                <div class="col-md-2 col-4">
                    <a
                        href="https://discord.gg/Y4fp3k2"
                        target="_blank"
                        rel="noopener">
                        <i class="bi bi-discord">
                        </i>
                    </a>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'InformationBlock'
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
</style>