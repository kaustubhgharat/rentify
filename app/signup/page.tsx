"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  User,
  Lock,
  Mail,
  Building,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"; // ✨ 1. Import useAuth

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Email syntax regex
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g., example@gmail.com).");
      return;
    }

    // ✅ Detect common domain typos
    const domain = email.split("@")[1]?.toLowerCase();
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "edu.in",
      "ac.in",
    ];
    const likelyTypos = [
      "gmial.com",
      "gamil.com",
      "gmal.com",
      "yaho.com",
      "hotmal.com",
    ];

    if (likelyTypos.includes(domain)) {
      setError(
        `Did you mean "${domain.replace(
          "gmial.com",
          "gmail.com"
        )}"? Please correct your email.`
      );
      return;
    }

    // Optional: Only allow realistic domain endings (no ".cmo" etc.)
    if (!/\.[a-z]{2,}$/i.test(domain)) {
      setError("Please enter a valid domain (e.g., .com, .in, .edu).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Account created successfully!");
        login(data.user);

        if (data.user.role === "owner") {
          router.push("/listings/add");
        } else {
          router.push("/listings");
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-200/80">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create an Account on <span className="text-teal-600">Rentify</span>
          </h1>
          <p className="mt-2 text-slate-500">
            Join our community to find your next home.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Custom Radio Button for Student */}
              <div>
                <input
                  type="radio"
                  id="student-role"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden peer"
                />
                <label
                  htmlFor="student-role"
                  className="flex flex-col items-center justify-center w-full p-4 border rounded-lg cursor-pointer transition peer-checked:border-teal-600 peer-checked:ring-2 peer-checked:ring-teal-200 peer-checked:text-teal-600 hover:bg-slate-50"
                >
                  <GraduationCap size={24} />
                  <span className="font-semibold mt-2">Student</span>
                </label>
              </div>
              {/* Custom Radio Button for Owner */}
              <div>
                <input
                  type="radio"
                  id="owner-role"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden peer"
                />
                <label
                  htmlFor="owner-role"
                  className="flex flex-col items-center justify-center w-full p-4 border rounded-lg cursor-pointer transition peer-checked:border-teal-600 peer-checked:ring-2 peer-checked:ring-teal-200 peer-checked:text-teal-600 hover:bg-slate-50"
                >
                  <Building size={24} />
                  <span className="font-semibold mt-2">Owner</span>
                </label>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-slate-400 transition-all duration-300 transform hover:scale-105"
          >
            <UserPlus size={18} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-center text-slate-500">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-teal-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
