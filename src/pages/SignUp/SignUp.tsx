import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import UserService from "../../services/UserService";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  phone: z.string().regex(/^\d{10}$/),
});

type SignUpFormData = z.infer<typeof schema>;

const SignUp = () => {
  const [logInError, setlogInError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: zodResolver(schema) });

  const onSignUp = (data: SignUpFormData) => {
    UserService.register(data)
      .then((res) => {
        const resData = res.data;
        if (resData.status == "success") {
          navigate(`/verifyOtp?phone=${data.phone}`);
        }
        console.log(resData);
      })
      .catch((error) => {
        // The request was made and the server responded with a non-success status code
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data.message);
        if (error.response.data.message) {
          setlogInError(error.response.data.message);
        }
      });
  };

  return (
    <section className="form-section px-15 top-space section-b-space">
      <h1>
        Hey, <br />
        Sign Up
      </h1>
      {logInError && <p className="text-danger">{logInError}</p>}
      <form
        onSubmit={handleSubmit((data) => {
          onSignUp(data);
        })}
      >
        <div className="form-floating mb-4">
          <input
            {...register("name")}
            type="text"
            className="form-control"
            id="one"
            placeholder="Name"
          />
          <label htmlFor="one">Name</label>
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>
        <div className="form-floating mb-4">
          <input
            {...register("phone")}
            type="number"
            className="form-control"
            id="two"
            placeholder="Phone"
          />
          <label htmlFor="two">Phone</label>
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
        </div>
        <div className="form-floating mb-4">
          <input
            {...register("email")}
            type="email"
            className="form-control"
            id="two"
            placeholder="Email/phone"
          />
          <label htmlFor="two">Email</label>
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>
        <div className="form-floating mb-4">
          <input
            {...register("password")}
            type="password"
            id="txtPassword"
            className="form-control"
            placeholder="password"
          />
          <label>Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
          <div id="btnToggle" className="password-hs">
            <i id="eyeIcon" className="iconly-Hide icli hide"></i>
          </div>
        </div>
        <button type="submit" className="btn btn-solid w-100">
          Sign UP
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
          Already have an Account?{" "}
          <Link className="title-color text-decoration-underline" to="/login">
            Sign In
          </Link>
        </h4>
      </div>
    </section>
  );
};

export default SignUp;
