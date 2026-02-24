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
import CtaSection from '@/widgets/landing/CtaSection.vue'
import DashboardSection from '@/widgets/landing/DashboardSection.vue'
import FooterMain from '@/widgets/landing/Footer.vue'
import HeaderMain from '@/widgets/landing/Header.vue'
import HeroSection from '@/widgets/landing/HeroSection.vue'
import HowWorksSection from '@/widgets/landing/HowWorksSection.vue'
import WhySection from '@/widgets/landing/WhySection.vue'
</script>

<style lang="scss">
@use '@/app/assets/sass/landing' as *;
</style>
