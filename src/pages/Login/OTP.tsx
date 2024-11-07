import { useState } from "react";
import { useForm } from "react-hook-form";
import UserService from "../../services/UserService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const schema = z.object({
  digit1: z.number(),
  digit2: z.number(),
  digit3: z.number(),
  digit4: z.number(),
});

type otpForm = z.infer<typeof schema>;

const OTP = ({ phoneNumber }: any) => {
  const { setUserData, setSelectedLocation } = useUser();

  const [otpError, setotpError] = useState("");

  // useEffect(() => {
  //   // add code to check the user
  //   const { req, cancel } = UserService.checkUser({ phone: phoneNumber });

  //   req.catch(() => {
  //     navigate("/login");
  //   });
  //   if (phoneNumber == null) {
  //     navigate("/login");
  //   }
  //   return () => cancel();
  // }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<otpForm>({ resolver: zodResolver(schema) });

  const handleInput = (e: any) => {
    const input = e.target;
    const maxLength = parseInt(input.getAttribute("maxlength"), 10);
    const currentLength = input.value.length;

    if (currentLength >= maxLength) {
      const nextInput = input.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const otpVerify = (data: any) => {
    UserService.otpVerify(data)
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
      })
      .catch((error) => {
        if (error.response.data.error) {
          setotpError(error.response.data.error);
        }
      });
  };

  const handleFormSubmit = () => {
    // Submit the form
    handleSubmit((data) => {
      const dataWithNumber = {
        otp: `${data.digit1}${data.digit2}${data.digit3}${data.digit4}`,
        phone: phoneNumber,
      };

      otpVerify(dataWithNumber); // Perform form submission logic here
    })();
  };

  return (
    <>
      <div className="form-section px-15 top-space section-b-space">
        <div className="offcanvas-body">
          <h4>Code Verification:</h4>
          <h2 className="content-color fw-normal mb-2">
            Enter your verification code here:
          </h2>
          <h2 className="fw-normal me-2">
            +91 {phoneNumber}{" "}
            {/* <a className="title-color" href="#">
              <i className="iconly-Edit icli"></i>
            </a> */}
          </h2>
          {(errors.digit1 ||
            errors.digit2 ||
            errors.digit3 ||
            errors.digit4) && (
            <p className="text-danger">Please enter valid OTP.</p>
          )}

          {otpError && <p className="text-danger">{otpError}</p>}
          <form
            className="input-otp-form my-3"
            onSubmit={handleSubmit((data) => {
              otpVerify(data);
            })}
          >
            <input
              {...register("digit1", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="number"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit2", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="number"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit3", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="number"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit4", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="number"
              onInput={(e) => handleInput(e)}
            />
          </form>
          <h4 className="content-color mb-3">
            Don’t get code?{" "}
            <Link className="title-color text-decoration-underline" to="/login">
              Sign In
            </Link>
          </h4>
          <button
            className="btn btn-solid w-100"
            data-bs-dismiss="offcanvas"
            onClick={handleFormSubmit}
          >
            DONE
          </button>
        </div>
      </div>
    </>
  );
};

export default OTP;
