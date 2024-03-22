// src/__ tests __/App.test.tsx

import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { App } from "../App"

test("The App renders correctly", () => {
    render(<App />);
})