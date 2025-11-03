// ...existing code...
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../providers/ToastProvider";
import { useAuth } from "../providers/AuthProvider";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const valid = Boolean(email && password && password.length >= 6);
    if (!valid) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Login submit payload:", { email, password });
      // call login with correct payload shape
      await login({ email, password });
      console.log("Login successful");
      showToast("Signed in successfully", "success");
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      showToast(err?.message || "Login failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="rounded-lg p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create an account
            </Link>
          </p>

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email address"
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouchedEmail(true)}
              error={(submitted || touchedEmail) && !email ? "Email is required" : null}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouchedPassword(true)}
              error={
                (submitted || touchedPassword) && !password
                  ? "Password is required"
                  : (submitted || touchedPassword) && password.length < 6
                  ? "Password must be at least 6 characters"
                  : null
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Remember me</span>
              </label>

              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
              text-sm font-medium rounded-md text-white ${isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 
                rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  className="h-5 w-5"
                  src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                  alt="Facebook"
                />
              </a>
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 
                rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  className="h-5 w-5"
                  src="https://www.svgrepo.com/show/513008/twitter-154.svg"
                  alt="Twitter"
                />
              </a>
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 
                rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  className="h-6 w-6"
                  src="https://www.svgrepo.com/show/506498/google.svg"
                  alt="Google"
                />
              </a>
            </div>
          </div>

        </Card>
      </div>
    </div>
  );
}