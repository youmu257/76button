<template>
  <div class="timeline-container">
    <!-- 滑動開關 -->
    <div class="toggle-switch">
      <label>
        <input type="checkbox" v-model="isAlternate" @change="toggleTimeline" />
        <span class="slider"></span>
      </label>
    </div>

    <h1 class="timeline-title">{{ title }}</h1>
    <div class="timeline">
      <div
        v-for="(item, index) in timelineItems"
        :key="index"
        class="timeline-item"
        :class="{ 'timeline-item-odd': index % 2 === 1 }"
      >
        <div class="timeline-dot" />
        <div class="timeline-date-center">
          <div class="date-label">
            {{ item.date }}
          </div>
        </div>
        <div class="timeline-content">
          <h3>{{ item.title }}</h3>
          <div class="content-body">
            <p>{{ item.description }}</p>
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="timeline-image"
              @click="openLightbox(item.image)"
            />
            <div v-if="item.video" class="video-container">
              <iframe
                :src="item.video"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <a
              v-if="item.link"
              :href="item.link.url"
              target="_blank"
              class="timeline-link"
            >
              {{ item.link.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="lightboxImage" class="lightbox" @click="closeLightbox">
      <img :src="lightboxImage" alt="放大圖片" />
    </div>
  </div>
</template>

<script>
import timelineData from '../assets/timeline-chilla-data.json'
import alternateTimelineData from '../assets/timeline-duck-data.json'

export default {
  name: 'Timeline',
  data() {
    return {
      lightboxImage: null,
      timelineItems: timelineData.items,
      title: timelineData.title, 
      isAlternate: false, // 控制是否切換到另一組 JSON
    }
  },
  methods: {
    openLightbox(image) {
      this.lightboxImage = image
    },
    closeLightbox() {
      this.lightboxImage = null
    },
    toggleTimeline() {
      // 切換 JSON 資料
      if (this.isAlternate) {
        this.timelineItems = alternateTimelineData.items
        this.title = alternateTimelineData.title
      } else {
        this.timelineItems = timelineData.items
        this.title = timelineData.title
      }
    },
  },
}
</script>

<style scoped src="../css/Timeline.css"></style>
<style scoped>
/* 滑動開關樣式 */
.toggle-switch {
  position: absolute;
  top: 20px;
  right: 20px;
}

.toggle-switch label {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0077b6;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>