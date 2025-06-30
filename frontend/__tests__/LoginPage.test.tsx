import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/login";
import { useAuth } from "@/context/authContext";

// Mock toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
}));

// Mock router
const pushMock = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock useAuth
jest.mock("@/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("LoginPage", () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock,
      isLoggedIn: false,
    });
  });

  it("shows validation errors for invalid inputs", () => {
    render(<LoginPage />);

    // Use querySelector to get inputs
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (emailInput && passwordInput) {
      fireEvent.change(emailInput, { target: { value: "invalidemail" } });
      fireEvent.change(passwordInput, { target: { value: "123" } });
    }

    fireEvent.click(screen.getByText("Sign In"));

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Password must be at least 8 characters long and include/
      )
    ).toBeInTheDocument();
  });

  it("calls login and redirects on success", () => {
    loginMock.mockReturnValue(true);

    render(<LoginPage />);

    // Use querySelector to get inputs
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (emailInput && passwordInput) {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
    }

    fireEvent.click(screen.getByText("Sign In"));

    expect(loginMock).toHaveBeenCalledWith("test@example.com", "StrongPass1!");
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("shows error on failed login", () => {
    loginMock.mockReturnValue(false);

    render(<LoginPage />);

    // Use querySelector to get inputs
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (emailInput && passwordInput) {
      fireEvent.change(emailInput, { target: { value: "john123@gmail.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password456!" } });
    }

    fireEvent.click(screen.getByText("Sign In"));

    // Update the selector based on the actual structure of the error message
    const errorMessage = screen.queryByText(/Invalid email or password/);
    expect(errorMessage).toBeInTheDocument();
  });

})