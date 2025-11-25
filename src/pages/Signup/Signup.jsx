import "./signup.css";
import { useSignup } from "./hooks/useSignup";
import SignupLeft from "./components/SignupLeft";
import SignupHeader from "./components/SignupHeader";
import SignupMessages from "./components/SignupMessages";
import SignupForm from "./components/SignupForm";
import SignupFooter from "./components/SignupFooter";
import SignupSuccess from "./components/SignupSuccess";

export default function Signup() {
  const {
    formData,
    loading,
    errors,
    submitted,
    setSubmitted,
    handleChange,
    handleSubmit,
  } = useSignup();

  if (submitted) {
    return <SignupSuccess onBack={() => setSubmitted(false)} />;
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <SignupLeft />

        <div className="signup-right">
          <SignupHeader />

          <h2>Create Account</h2>
          <p>Join us to start your healthcare journey</p>

          <SignupMessages errors={errors} />

          <SignupForm
            formData={formData}
            errors={errors}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <SignupFooter />
        </div>
      </div>
    </div>
  );
}
