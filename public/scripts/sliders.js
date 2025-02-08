window.pageReady = false
window.scriptDone = false
document.addEventListener('mousemove', function () {
    if (document.querySelector('#arrow-next') != null && !window.scriptDone) {
        window.pageReady = true
    }
    if (window.pageReady && !window.scriptDone) {
        // burger slider
        const burgerMenu = document.querySelector('#burger-menu')
        const burgerMenuOpen = document.querySelector('#burger-menu-open')
        const burgerMenuClose = document.querySelector('#burger-menu-close')
        burgerMenuOpen.addEventListener('click', function () {
            burgerMenu?.classList.remove('hidden')
            burgerMenu?.classList.add('block')
        })
        burgerMenuClose.addEventListener('click', function () {
            burgerMenu?.classList.remove('block')
            burgerMenu?.classList.add('hidden')
        })
        // projects slider
        const arrowNext = document.querySelector('#arrow-next')
        const arrowNextColor = document.querySelector('#arrow-next-color')
        const arrowBack = document.querySelector('#arrow-back')
        const arrowBackColor = document.querySelector('#arrow-back-color')
        const projectsSlider = document.querySelector('#projects-slider')
        const sliderState = { slideWidth: 0, activeSlide: 0, slideCount: 9 }
        arrowNext.addEventListener('click', function () {
            if (sliderState.activeSlide < sliderState.slideCount - 1) {
                sliderState.activeSlide += 1
                sliderState.slideWidth += document.querySelector('#project' + sliderState.activeSlide).offsetWidth
                if (sliderState.activeSlide === sliderState.slideCount - 1) {
                    arrowNextColor.setAttribute('stroke', '#3F3F46')
                    arrowBackColor.setAttribute('stroke', 'white')
                } else {
                    arrowNextColor.setAttribute('stroke', 'white')
                    if (sliderState.activeSlide === 0) arrowBackColor.setAttribute('stroke', '#3F3F46')
                    else arrowBackColor.setAttribute('stroke', 'white')
                }
            } else {
                arrowNextColor.setAttribute('stroke', '#3F3F46')
                arrowBackColor.setAttribute('stroke', 'white')
                sliderState.activeSlide = sliderState.slideCount - 1
            }
            projectsSlider.style.transform = 'translateX(-' + sliderState.slideWidth + 'px)'
        })
        arrowBack.addEventListener('click', function () {
            if (sliderState.activeSlide > 0) {
                sliderState.activeSlide -= 1
                sliderState.slideWidth -= document.querySelector('#project' + (sliderState.activeSlide + 1)).offsetWidth
                if (sliderState.activeSlide === 0) {
                    arrowBackColor.setAttribute('stroke', '#3F3F46')
                    arrowNextColor.setAttribute('stroke', 'white')
                } else {
                    arrowBackColor.setAttribute('stroke', 'white')
                    if (sliderState.activeSlide === sliderState.slideCount - 1)
                        arrowNextColor.setAttribute('stroke', '#3F3F46')
                    else arrowNextColor.setAttribute('stroke', 'white')
                }
            } else {
                arrowBackColor.setAttribute('stroke', '#3F3F46')
                arrowNextColor.setAttribute('stroke', 'white')
                sliderState.activeSlide = 0
            }
            projectsSlider.style.transform = 'translateX(-' + sliderState.slideWidth + 'px)'
        })
        window.scriptDone = true
    }
})
