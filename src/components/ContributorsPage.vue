<template>
  <div class="contributors-container">
    <h2 class="contributors-title">
      感謝名單
    </h2>

    <div class="contributors-grid">
      <div
        v-for="(contributor, index) in contributorsList"
        :key="index"
        class="contributor-card"
      >
        <div class="contributor-info">
          <h3>{{ contributor.name }}</h3>
          <p>{{ contributor.contribution }}</p>
          <a
            v-if="contributor.link"
            :href="contributor.link"
            target="_blank"
            class="contributor-link"
          >
            {{ contributor.linkText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import contributorsList from '@/assets/contributors-list.json'

export default {
  name: 'ContributorsPage',
  data() {
    return {
      contributorsList,
    }
  }
}
</script>

<style scoped src="../css/ContributorsPage.css"></style>