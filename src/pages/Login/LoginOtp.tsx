import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import UserService from "../../services/UserService";
import OTP from "./OTP"; // Make sure to create and import OTPVerification component
import { Link } from "react-router-dom";

const schema = z.object({
  phoneNumber: z.number(),
  // .min(10, "Phone number must be at least 10 digits")
  // .max(15, "Phone number must be at most 15 digits"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginOtp = ({ showLoginForm, setShowLoginForm }: any) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [logInError, setLogInError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const onLogin = async (data: LoginFormData) => {
    try {
      const res = await UserService.loginWithPhone(data.phoneNumber);
      if (res.status === 200) {
        setIsOtpSent(true);
        setPhoneNumber(data.phoneNumber);
      } else {
        setLogInError("Invalid phone number");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data.message);
        if (error.response.data.message) {
          setLogInError(error.response.data.message);
        }
      }
    }
  };

  return (
    <>
      <div
        className={"overlay-sidebar" + (showLoginForm ? " show" : "")}
        onClick={() => {
          setShowLoginForm(false);
        }}
      ></div>

      <div
        className={`offcanvas offcanvas-bottom h-auto ${
          showLoginForm && "show"
        } `}
        id="removecart"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowLoginForm(false);
            }}
          ></button>
        </div>

        <div className="offcanvas-body small">
          {!isOtpSent ? (
            <section className="form-section px-15   section-b-space">
              <h1>
                Hey, <br />
                Log in or Sign up Now
              </h1>
              {logInError && <p className="text-danger">{logInError}</p>}
              <form
                onSubmit={handleSubmit((data) => {
                  onLogin(data);
                })}
              >
                <div className="form-floating mb-4">
                  <input
                    {...register("phoneNumber", { valueAsNumber: true })}
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone Number"
                  />
                  <label htmlFor="phoneNumber">Phone Number</label>
                  {errors.phoneNumber && (
                    <p className="text-danger">{errors.phoneNumber.message}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-outline w-100">
                  Continue
                </button>
              </form>

              <div className="bottom-detail text-center mt-3">
                <h4 className="content-color">
                  By continuing, you acknowledge that you have read and agree to
                  our{" "}
                  <Link
                    className="title-color text-decoration-underline"
                    to="/terms-condition"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="title-color text-decoration-underline"
                    to="/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </h4>
              </div>
              {/* <div className="or-divider">
            <span>Or sign in with</span>
          </div>
          <div className="social-auth">
            <ul>
              <li>
                <a href="#">
                  <img
                    src="/src/assets/images/social/google.png"
                    className="img-fluid"
                    alt="Google"
                  />
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="/src/assets/images/social/fb.png"
                    className="img-fluid"
                    alt="Facebook"
                  />
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="/src/assets/images/social/apple.png"
                    className="img-fluid"
                    alt="Apple"
                  />
                </a>
              </li>
            </ul>
          </div>
          <div className="bottom-detail text-center mt-3">
            <h4 className="content-color">
              If you are new,{" "}
              <Link
                className="title-color text-decoration-underline"
                to="/signup"
              >
                Create Now
              </Link>
            </h4>
          </div> */}
            </section>
          ) : (
            <OTP phoneNumber={phoneNumber} />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginOtp;
