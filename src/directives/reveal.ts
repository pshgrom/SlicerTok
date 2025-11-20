import type { DirectiveBinding, ObjectDirective } from 'vue'

interface RevealHTMLElement extends HTMLElement {
  __revealCleanup__?: () => void
}

const revealDirective: ObjectDirective = {
  mounted(el: RevealHTMLElement, binding: DirectiveBinding) {
    const offset = binding.value?.offset ?? 40
    const duration = binding.value?.duration ?? 700

    el.style.opacity = '0'
    el.style.transform = `translateY(${offset}px)`
    el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    el.__revealCleanup__ = () => observer.disconnect()
  },

  unmounted(el: RevealHTMLElement) {
    el.__revealCleanup__?.()
  }
}

export default revealDirective
