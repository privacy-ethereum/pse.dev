import { Input } from "@/components/ui/input"
import { render, screen, fireEvent } from "@testing-library/react"
import { Search, X } from "lucide-react"
import { describe, it, expect, vi } from "vitest"

describe("Input", () => {
  it("renders a basic input without icon", () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText("Enter text")
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass("text-sm", "py-2", "px-4")
  })

  it("applies different sizes correctly", () => {
    const { rerender } = render(<Input size="sm" placeholder="Small input" />)
    let input = screen.getByPlaceholderText("Small input")
    expect(input).toHaveClass("text-xs", "py-2", "px-4")

    rerender(<Input size="lg" placeholder="Large input" />)
    input = screen.getByPlaceholderText("Large input")
    expect(input).toHaveClass("text-lg", "py-3", "px-6")
  })

  it("renders with icon on the left by default", () => {
    render(<Input icon={Search} placeholder="Search" />)
    const input = screen.getByPlaceholderText("Search")
    const container = input.parentElement

    expect(container).toHaveClass("relative")
    expect(input).toHaveClass("pl-10")

    const icon = container?.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("renders with icon on the right when specified", () => {
    render(<Input icon={X} iconPosition="right" placeholder="Clear" />)
    const input = screen.getByPlaceholderText("Clear")

    expect(input).toHaveClass("pr-10")
  })

  it("handles icon click when onIconClick is provided", () => {
    const mockClick = vi.fn()
    render(
      <Input
        icon={Search}
        onIconClick={mockClick}
        placeholder="Clickable icon"
      />
    )

    const iconButton = screen.getByRole("button")
    expect(iconButton).toBeInTheDocument()

    fireEvent.click(iconButton)
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it("renders icon as non-clickable when onIconClick is not provided", () => {
    render(<Input icon={Search} placeholder="Non-clickable icon" />)

    // Should not find a button when no onClick handler
    const iconButton = screen.queryByRole("button")
    expect(iconButton).not.toBeInTheDocument()

    // But should find the icon as an svg
    const icon = screen
      .getByPlaceholderText("Non-clickable icon")
      .parentElement?.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("forwards ref correctly", () => {
    const ref = { current: null }
    render(<Input ref={ref} placeholder="Input with ref" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("accepts custom className", () => {
    render(<Input className="custom-class" placeholder="Custom input" />)
    const input = screen.getByPlaceholderText("Custom input")
    expect(input).toHaveClass("custom-class")
  })

  it("handles input value changes", () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement

    fireEvent.change(input, { target: { value: "Hello World" } })
    expect(input.value).toBe("Hello World")
  })
})
