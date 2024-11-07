import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
} from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SellerService from "../../services/SellerService"; // Replacing UserService with SellerService
import { toast } from "react-toastify";
import { useEffect } from "react";

const schema = z.object({
  deliveryCharge: z.number().min(0),
});

const PaidDeliveryForm = ({ userData, fetchUserData }: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    setValue("deliveryCharge", userData?.user?.deliveryCharge);
  }, [userData]);

  const paidDelSubmit = async (data: any) => {
    const ToastID = toast.loading("Please wait...");
    try {
      const response = await SellerService.updateDeliveryData(data); // Using SellerService
      if (response.data.status === "success") {
        fetchUserData(); // Fetch user data after successful update
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          closeButton: true,
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.update(ToastID, {
        render: error.response?.data?.message || "An error occurred",
        type: "error",
        isLoading: false,
        closeButton: true,
        autoClose: 3000,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(paidDelSubmit)}>
      <FormGroup className="mb-3">
        <FormLabel htmlFor="deliveryCharge">Delivery Charge (₹)</FormLabel>
        <FormControl
          type="number"
          id="deliveryCharge"
          {...register("deliveryCharge", { valueAsNumber: true })}
          placeholder="Set delivery charge"
          isInvalid={!!errors.deliveryCharge}
        />
        <FormText>Enter the delivery charge for orders.</FormText>
        <FormControl.Feedback type="invalid">
          {String(errors.deliveryCharge?.message)}
        </FormControl.Feedback>
      </FormGroup>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
};

export default PaidDeliveryForm;
