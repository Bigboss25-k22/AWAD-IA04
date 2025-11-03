import { useForm } from "react-hook-form";
// Use a type-only alias to avoid emitting a runtime import for SubmitHandler
type SubmitHandler<T> = import("react-hook-form").SubmitHandler<T>;
import { useRegister } from "../hooks/useRegister";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../providers/ToastProvider";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";

interface RegisterFormInputs {
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const mutation = useRegister();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        showToast("Registration successful!", "success");
        navigate("/login");
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : "Registration failed";
        showToast(message, "error");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <Card className="rounded-lg p-8">
        {/* Header */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to an existing account
          </Link>
        </p>

        {/* Form */}
         <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
           {/* Email */}
           <FormInput
             id="reg_email"
             label="Email"
             type="email"
             placeholder="Enter your email address"
             aria-invalid={errors.email ? "true" : "false"}
             {...register("email", { 
               required: "Email is required",
               pattern: {
                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                 message: "Please enter a valid email address",
               },
             })}
             error={errors.email?.message ?? null}
           />

          {/* Password */}
           <FormInput
             id="reg_password"
             label="Password"
             type="password"
             placeholder="Enter your password"
             aria-invalid={errors.password ? "true" : "false"}
             {...register("password", {
               required: "Password is required",
               minLength: { value: 6, message: "Password must be at least 6 characters" },
             })}
             error={errors.password?.message ?? null}
           />

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mutation.isPending ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Messages */}
        {mutation.isError && (
          <p className="mt-6 text-center text-sm text-red-600">
            {mutation.error instanceof Error ? mutation.error.message : "Registration failed"}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="mt-6 text-center text-sm text-green-600">✅ Registration successful!</p>
        )}
        </Card>
      </div>
    </div>
  );
}
