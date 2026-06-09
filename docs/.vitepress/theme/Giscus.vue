<script setup>
import { onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { isDark } = useData()
const route = useRoute()
const container = ref(null)

function loadGiscus() {
  if (!container.value) return

  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'cdutetc-tieba/CDUTETC-Guide')
  script.setAttribute('data-repo-id', 'R_kgDOSySkiQ')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOSySkic4C-126')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.crossOrigin = 'anonymous'
  script.async = true

  container.value.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

watch(isDark, () => {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }
})

watch(() => route.path, () => {
  setTimeout(loadGiscus, 100)
})
</script>

<template>
  <div ref="container" class="giscus-container" />
</template>

<style>
.giscus-container {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
