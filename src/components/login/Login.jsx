import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../lib/Toast";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    if (form.username === "" || form.password === "") {
      showToast("warning", "Username dan password harus diisi");
      return;
    }
    if (form.username !== "cindhi" || form.password !== "woxyinaja") {
      showToast("error", "Username atau password salah");
      return;
    }
    setTimeout(() => {
      navigate("/");
      showToast("success", "Berhasil masuk");
  }, 500);
  };

  return (
    <div className="flex items-center justify-center mt-64">
      <div className="w-[27rem] border border-primary p-10 rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-10">Masuk Admin</h1>
        <div className="flex flex-col gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <input
              name="username"
              type="text"
              className="grow"
              placeholder="Username"
              value={form.username}
              onChange={handleFormChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              name="password"
              type="password"
              className="grow"
              placeholder="Password"
              value={form.password}
              onChange={handleFormChange}
            />
          </label>
          <button className="btn btn-primary w-full" onClick={handleLogin}>
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
