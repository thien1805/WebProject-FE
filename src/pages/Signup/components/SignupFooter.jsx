import { Link } from "react-router-dom";

export default function SignupFooter() {
  return (
    <p className="signin-text">
      Already have an account? <Link to="/login">Sign In</Link>
    </p>
  );
}

