import { Button } from "@/components/ui/button"
import { render, screen } from "@testing-library/react"
import { Search } from "lucide-react"
import { describe, it, expect } from "vitest"

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("h-10", "py-2", "px-4", "text-lg")
  })

  it("applies different variants correctly", () => {
    const { rerender } = render(<Button variant="orange">Orange Button</Button>)
    let button = screen.getByRole("button")
    expect(button).toHaveClass("bg-orangeDark", "text-white")

    rerender(<Button variant="secondary">Secondary Button</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveClass("bg-anakiwa-400")
  })

  it("applies different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>)
    let button = screen.getByRole("button")
    expect(button).toHaveClass("h-9", "px-3", "text-sm")

    rerender(<Button size="lg">Large Button</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveClass("h-11", "px-8", "text-lg")
  })

  it("renders with an icon", () => {
    render(<Button icon={Search}>Search</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()

    // Check that icon is rendered (Search icon creates an svg)
    const svg = button.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:pointer-events-none"
    )
  })

  it("accepts custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = { current: null }
    render(<Button ref={ref}>Button with ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
