import '../styles/index.sass'
import BARBA_ENGINE from './pagesTransitions'

BARBA_ENGINE.start()
document.ondragstart = e => e.preventDefault()
