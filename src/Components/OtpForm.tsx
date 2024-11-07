import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  digit1: z.number(),
  digit2: z.number(),
  digit3: z.number(),
  digit4: z.number(),
  digit5: z.number(),
  digit6: z.number(),
});
type otpForm = z.infer<typeof schema>;
const OtpForm = ({ otpSubmit }: any) => {
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

  return (
    <div className="form-section px-15 section-b-space">
      <div className="offcanvas-body">
        <h4>Code Verification:</h4>
        <h2 className="content-color fw-normal mb-2">
          Enter your verification code here:
        </h2>
        <h2 className="fw-normal me-2">
          {/* <a className="title-color" href="#">
          <i className="iconly-Edit icli"></i>
        </a> */}
        </h2>
        {(errors.digit1 ||
          errors.digit2 ||
          errors.digit3 ||
          errors.digit4 ||
          errors.digit5 ||
          errors.digit6) && (
          <p className="text-danger">Please enter valid OTP.</p>
        )}

        {/* {otpError && <p className="text-danger">{otpError}</p>} */}
        <form
          onSubmit={handleSubmit((data) => {
            otpSubmit(data);
          })}
        >
          <div className="input-otp-form my-3">
            <input
              {...register("digit1", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit2", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit3", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />
            <input
              {...register("digit4", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />

            <input
              {...register("digit5", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />

            <input
              {...register("digit6", { valueAsNumber: true })}
              className="form-control"
              maxLength={1}
              type="text"
              onInput={(e) => handleInput(e)}
            />
          </div>
          <button
            className="btn btn-solid w-100"
            data-bs-dismiss="offcanvas"
            type="submit"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
