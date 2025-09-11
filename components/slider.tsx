"use client"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"

interface SliderProps {
  children: React.ReactNode[]
  className?: string
  showNavigation?: boolean
  autoSlide?: boolean
  autoSlideInterval?: number
  onSlideChange?: (index: number) => void
  slidesToShow?: number
  gap?: string
  withDivider?: boolean
  controlsPosition?: "top" | "bottom"
  showControls?: boolean
}

export const Slider = ({
  children,
  className,
  showNavigation = true,
  autoSlide = false,
  autoSlideInterval = 3000,
  onSlideChange,
  slidesToShow = 1,
  gap = "0px",
  withDivider = false,
  controlsPosition = "bottom",
  showControls = true,
}: SliderProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before running client-side logic
  useEffect(() => {
    setIsMounted(true)

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const totalSlides = children.length
  const effectiveSlidesToShow = isMobile ? 1 : slidesToShow
  const maxSlideIndex = Math.max(
    0,
    totalSlides - Math.floor(effectiveSlidesToShow)
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!isMounted || !autoSlide || isHovered || currentSlide >= maxSlideIndex)
      return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= maxSlideIndex) {
          return prev // Stop at the last slide
        }
        return prev + 1
      })
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [
    isMounted,
    autoSlide,
    autoSlideInterval,
    maxSlideIndex,
    isHovered,
    currentSlide,
  ])

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide)
    }
  }, [currentSlide, onSlideChange])

  const goToNext = () => {
    if (!isMounted) return
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlideIndex))
  }

  const goToPrev = () => {
    if (!isMounted) return
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const slideWidth = 100 / effectiveSlidesToShow
  const translateX = currentSlide * slideWidth

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className={twMerge("flex flex-col gap-5", className)}>
        <div className="flex overflow-hidden">
          <div
            className="flex-shrink-0 h-full"
            style={{ width: `${slideWidth}%` }}
          >
            {children[0]}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={twMerge(
        "flex flex-col gap-5",
        controlsPosition === "top" && "flex-col-reverse"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={twMerge(
          "flex flex-col gap-5 relative overflow-hidden",
          isMobile ? "" : "px-1",
          className
        )}
      >
        <div
          ref={sliderRef}
          className={twMerge(
            "flex ease-in-out transition-transform duration-300",
            withDivider && "divide-x divide-app-color-border"
          )}
          style={{
            transform: `translateX(-${translateX}%)`,
            gap: isMobile ? "0px" : gap,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full"
              style={{
                width: `${slideWidth}%`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {showNavigation && maxSlideIndex > 0 && showControls && (
        <div className="flex gap-[10px] ml-auto justify-end lg:mr-4">
          <Button
            onClick={goToPrev}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
            className="!mx-0 !focus:outline-none !focus:ring-0 !focus:ring-offset-0 w-10 h-10"
          >
            <Icons.SliderArrowPrev />
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentSlide >= maxSlideIndex}
            aria-label="Next slide"
            className="!mx-0 !focus:outline-none !focus:ring-0 !focus:ring-offset-0 w-10 h-10"
          >
            <Icons.SliderArrowNext />
          </Button>
        </div>
      )}
    </div>
  )
}
