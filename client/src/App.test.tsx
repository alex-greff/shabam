import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("App renders", () => {
  const app = render(<App />);
  expect(app.baseElement).toBeInTheDocument();
});
