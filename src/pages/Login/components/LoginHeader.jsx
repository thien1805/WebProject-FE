import { Heart } from 'lucide-react';
import Logo from '../../../components/Logo/Logo'
export default function LoginHeader() {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <Logo />
      <p className="text-gray-600 font-medium">Sign in to continue your care journey</p>
    </div>
  );
}

