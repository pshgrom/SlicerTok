import type { DirectiveBinding, ObjectDirective } from 'vue'

interface RevealHTMLElement extends HTMLElement {
  __revealOpts__?: {
    offset: number
    duration: number
    once: boolean
    direction: 'up' | 'down' | 'left' | 'right'
  }
}

// --- 1 глобальный observer на всё приложение ---
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const el = entry.target as RevealHTMLElement
      const opts = el.__revealOpts__

      if (!opts) return

      if (entry.isIntersecting) {
        // Запуск анимации
        el.style.opacity = '1'
        el.style.transform = 'translate3d(0,0,0)'
        el.style.transition = `opacity ${opts.duration}ms ease, transform ${opts.duration}ms ease`

        // Если анимировать только один раз — убираем слежение
        if (opts.once) io.unobserve(el)
      } else {
        // Если блок должен анимироваться КАЖДЫЙ раз (once: false)
        if (!opts.once) resetElement(el, opts)
      }
    })
  },
  { threshold: 0.2 }
)

// --- функция сброса в начальное состояние ---
function resetElement(el: HTMLElement, opts: RevealHTMLElement['__revealOpts__']) {
  const { offset, direction } = opts!

  const map = {
    up: `translateY(${offset}px)`,
    down: `translateY(-${offset}px)`,
    left: `translateX(${offset}px)`,
    right: `translateX(-${offset}px)`
  }

  el.style.opacity = '0'
  el.style.transform = map[direction]
  el.style.willChange = 'opacity, transform'
}

// --- сама директива ---
const revealDirective: ObjectDirective = {
  mounted(el: RevealHTMLElement, binding: DirectiveBinding) {
    const { offset = 40, duration = 700, once = true, direction = 'up' } = binding.value || {}

    el.__revealOpts__ = { offset, duration, once, direction }

    resetElement(el, el.__revealOpts__)

    io.observe(el)
  },

  unmounted(el: RevealHTMLElement) {
    io.unobserve(el)
  }
}

export default revealDirective
