import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Contact } from "./Contact";

describe("Contact", () => {
  it("shows validation errors and no success message when submitted empty", () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: "Submit demo form" }));

    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a message.")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Form interaction completed locally. No message was sent.",
      ),
    ).not.toBeInTheDocument();
  });

  it("clears a field's error as soon as the user edits it", () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: "Submit demo form" }));
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sara" },
    });
    expect(screen.queryByText("Enter your name.")).not.toBeInTheDocument();
  });

  it("shows the success message once all fields are valid", () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sara" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "sara@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello there" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit demo form" }));

    expect(
      screen.getByText(
        "Form interaction completed locally. No message was sent.",
      ),
    ).toBeInTheDocument();
  });
});
