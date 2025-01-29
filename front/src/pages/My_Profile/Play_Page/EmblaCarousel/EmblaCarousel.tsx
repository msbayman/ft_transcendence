import React, { useCallback, useEffect, useRef } from 'react'
import './EmblaCarousel.css'
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaCarouselArrowButtons'


const TWEEN_FACTOR_BASE = 0.52

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

type PropType = {
  options?: EmblaOptionsType
  slidesmaps: {mapPath: string, id: number}[]
  setCurrentSlideIndex: (index: number) => void;
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slidesmaps, options, setCurrentSlideIndex } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])


  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__number') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === 'scroll'

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress)
                }
              }
            })
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
          const scale = numberWithinRange(tweenValue, 0, 1).toString()
          const tweenNode = tweenNodes.current[slideIndex]
          tweenNode.style.transform = `scale(${scale})`
        })
      })
    },
    []
  )

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

    useEffect(() => {
      if (!emblaApi) return;
  
      setTweenNodes(emblaApi);
      setTweenFactor(emblaApi);
      tweenScale(emblaApi);
  
      emblaApi
        .on('reInit', setTweenNodes)
        .on('reInit', setTweenFactor)
        .on('reInit', tweenScale)
        .on('scroll', tweenScale)
        .on('slideFocus', tweenScale)
        .on('select', () => {
          const selectedIndex = emblaApi.selectedScrollSnap();
          setCurrentSlideIndex(selectedIndex);
        });
    }, [emblaApi, tweenScale, setCurrentSlideIndex]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slidesmaps.map((slide) => (
            <div className="embla__slide" key={slide.id}>
              <img src={slide.mapPath} alt="here" onError={() => console.error(`Image not found: ${slide.mapPath}`)} />
              <div className="embla__slide__number"/>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
    </div>
  )
}

export default EmblaCarousel