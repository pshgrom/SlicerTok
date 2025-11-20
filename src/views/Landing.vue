<template>
  <div class="landing">
    <HeaderMain />

    <HeroSection />
    <HowWorksSection />
    <WhySection />
    <DashboardSection />
    <CtaSection />

    <FooterMain />
  </div>
</template>

<script setup>
import CtaSection from '@/components/landing/CtaSection.vue'
import DashboardSection from '@/components/landing/DashboardSection.vue'
import FooterMain from '@/components/landing/Footer.vue'
import HeaderMain from '@/components/landing/Header.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import HowWorksSection from '@/components/landing/HowWorksSection.vue'
import WhySection from '@/components/landing/WhySection.vue'
</script>

<style lang="scss">
@use '@/assets/sass/landing' as *;
</style>
