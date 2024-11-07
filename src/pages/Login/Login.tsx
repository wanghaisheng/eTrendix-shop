import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import UserService from "../../services/UserService";
import { useUser } from "../../context/UserContext";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormData = z.infer<typeof schema>;

const Login = () => {
  const { setUserData, setSelectedLocation } = useUser();

  const navigate = useNavigate();
  const [logInError, setlogInError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const onLogin = (data: LoginFormData) => {
    UserService.login(data.email, data.password)
      .then((res) => {
        const data = res.data;
        const token = data.access_token;
        const userData = data.userData;
        localStorage.setItem("token", token); // Save token to localStorage
        localStorage.setItem("userData", JSON.stringify(userData)); // Save user details to localStorage
        localStorage.setItem(
          "selectedLocation",
          JSON.stringify(data.selectedLocation)
        ); // Save user details to localStorage
        setUserData(userData);
        setSelectedLocation(data.selectedLocation);
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);

        if (error.response) {
          // The request was made and the server responded with a non-success status code
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data.message);
          if (error.response.data.message) {
            setlogInError(error.response.data.message);
          }
        }
      });
  };

  return (
    <section className="form-section px-15 top-space section-b-space">
      <h1>
        Hey, <br />
        Login Now
      </h1>
      {logInError && <p className="text-danger">{logInError}</p>}
      <form
        onSubmit={handleSubmit((data) => {
          onLogin(data);
        })}
      >
        <div className="form-floating mb-4">
          <input
            {...register("email")}
            type="text"
            className="form-control"
            id="email"
            placeholder="Username or Email"
          />
          <label htmlFor="email">Username or Email</label>
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>
        <div className="form-floating mb-2">
          <input
            {...register("password")}
            type="password"
            className="form-control"
            id="password"
            placeholder="password"
          />
          <label htmlFor="password">Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <div className="text-end mb-4">
          <a href="forgot-password.html" className="theme-color">
            Forgot Password ?
          </a>
        </div>
        <button type="submit" className="btn btn-solid w-100">
          Sign in
        </button>
      </form>
      <div className="or-divider">
        <span>Or sign in with</span>
      </div>
      <div className="social-auth">
        <ul>
          <li>
            <a href="#">
              <img
                src="/src/assets/images/social/google.png"
                className="img-fluid"
                alt=""
              />
            </a>
          </li>
          <li>
            <a href="#">
              <img
                src="/src/assets/images/social/fb.png"
                className="img-fluid"
                alt=""
              />
            </a>
          </li>
          <li>
            <a href="#">
              <img
                src="/src/assets/images/social/apple.png"
                className="img-fluid"
                alt=""
              />
            </a>
          </li>
        </ul>
      </div>
      <div className="bottom-detail text-center mt-3">
        <h4 className="content-color">
          If you are new,{" "}
          <Link className="title-color text-decoration-underline" to="/signup">
            Create Now
          </Link>
        </h4>
      </div>
    </section>
  );
};

export default Login;
