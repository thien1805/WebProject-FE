import './Login.css';
import { useLogin } from './hooks/useLogin';
import AnimatedBackground from './components/AnimatedBackground';
import LoginHeader from './components/LoginHeader';
import LoginMessages from './components/LoginMessages';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import Logo from '../../components/Logo/Logo'

export default function LoginPage() {
  const {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleKeyPress,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10">
        <LoginHeader />

        {/* Form Card with Glass Effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up">
          <LoginMessages success={success} error={error} />

          <LoginForm
            formData={formData}
            loading={loading}
            onFormChange={handleChange}
            onKeyPress={handleKeyPress}
            onSubmit={handleSubmit}
          />
        </div>

        <LoginFooter />
      </div>
    </div>
  );
}