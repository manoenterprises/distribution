import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "./Utils/Alert";

function Login() {
  const [distributionCode, setDistributionCode] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (token) {
    //   history.push("/dashboard");
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`/api/authentication`, {
        distributionCode: distributionCode,
        password: password,
      })
      .then((response) => {
        // Store the token in localStorage
        localStorage.setItem("token", response?.data?.token);

        // Redirect to the dashboard
        // history.push("/dashboard");
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setResponse({
          type: "error",
          message:
            error?.response?.data?.message || "Oops! Something went wrong.",
        });
      });
  };
  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {response && <Alert type={response.type} message={response.message} />}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="distributionCode" className="sr-only">
                Distribution Code
              </label>
              <input
                id="distributionCode"
                name="distributionCode"
                type="text"
                autoComplete="text"
                required
                value={distributionCode}
                onChange={(e) => setDistributionCode(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Distribution Code"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-b-md md:text-md w-full"
            >
              Submit
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>

            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
