import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./Authentication/auth";
import { loginApi } from "../api/authApi"
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

    const validate = () => {
        let newErrors: { email?: string; password?: string } = {};

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Password regex: min 8 chars, 1 letter, 1 number, 1 special char
        const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
        }

        if (!passwordRegex.test(password)) {
        newErrors.password =
            "Password must be 8+ chars, include letter, number & special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();
//     const handleSubmit = () => {
//         if (validate()) {
//             // console.log("Form is valid 🚀");
//             //  navigate("/dashboard");
//              if (validate()) {
//     // 🔐 Dummy auth (replace with API later)
//     const dummyEmail = "test@example.com";
//     const dummyPassword = "Test@1234";

//     if (email === dummyEmail && password === dummyPassword) {
//       const fakeToken = "dummy_jwt_token_12345";

//       setToken(fakeToken); // store in session
//       navigate("/dashboard"); // redirect
//     } else {
//       setErrors({
//         password: "Invalid email or password",
//       });
//     }
//   }
//         }
//     };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const response: any = await loginApi(email, password);

            setToken(response.token);
            navigate("/timesheet");

        } catch (error: any) {
            setErrors({
            password: error.message || "Login failed",
            });
        }
    }
  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SIDE */}

       <div className="w-1/2 bg-gray-100 flex items-center justify-center px-10">
      <div className="w-full px-[4.5rem]">
        <h2 className="text-[20px] font-bold font-sans mb-[1.25rem] text-gray-800 text-left">
          Welcome back
        </h2>

        <div className="space-y-4">
          {/* EMAIL */}
          <div>
           <label className="block text-[14px] font-medium font-sans text-gray-600 text-left">
                    Email
                </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[14px] font-medium font-sans text-gray-600 text-left">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.password}
              </p>
            )}
          </div>

          {/* REMEMBER */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <input type="checkbox" />
            <span>Remember me</span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#1A56DB] text-white py-2 rounded-lg transition"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-[#1A56DB] flex items-center justify-center">
        <div className="text-white px-[4.5rem]">
          <h1 className="text-[40px] font-semibold mb-4 text-left font-sans">ticktock</h1>
          <p className="text-[16px] leading-relaxed text-indigo-100 text-left font-sans">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </div>
    </div>
  );
}