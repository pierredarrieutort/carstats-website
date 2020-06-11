import barba from '@barba/core'
import prefetch from '@barba/prefetch'
import { gsap } from 'gsap'


export default class BARBA_ENGINE {
    static start() {
        return new BARBA_ENGINE()
    }

    constructor() {
        Promise
            .all([BARBA_ENGINE.domReady()])
            .then(this.init.bind(this))
    }

    static domReady() {
        return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
    }

    static showPage() {
        document.documentElement.classList.add('ready')
    }

    init() {
        try {

            barba.use(prefetch)

            barba.init({
                preventRunning: true,
                transitions: [
                    {
                        enter: ({ next }) => transition(next.container),
                        leave: ({ current }) => transition(current.container, true),
                        once: ({ next }) => transition(next.container)
                    }
                ]
            })
        } catch (err) {
            console.error(err)
        }

        BARBA_ENGINE.showPage()
    }
}


function transition(container, isReversed) {
    return isReversed
        ? gsap.to(container, .5, { alpha: 0, ease: 'expo.out' })
        : gsap.from(container, .5, { alpha: 0 })
}
