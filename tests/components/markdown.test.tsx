import { Markdown } from "@/components/ui/markdown"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("Markdown", () => {
  it("preserves inline code in footnotes that also contain math", async () => {
    const { container } = render(
      <Markdown>
        {
          "See the schedule score.[^score]\n\n[^score]: For a schedule $s$, the scorer computes `score(s)`."
        }
      </Markdown>
    )

    await waitFor(() => {
      expect(container).toHaveTextContent("For a schedule")
    })

    expect(container.textContent).not.toContain("[object Object]")

    const code = screen.getByText("score(s)")
    expect(code.tagName.toLowerCase()).toBe("code")
  })
})
