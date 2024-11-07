import { useEffect } from "react";
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
import SellerService from "../../services/SellerService"; // Use SellerService
import { toast } from "react-toastify";

const schema = z.object({
  minimumOrderPrice: z.number().min(0),
  deliveryCharge: z.number().min(0),
});

const FreeDeliveryForm = ({ userData, fetchUserData }: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    setValue("minimumOrderPrice", userData?.user?.minimumOrderPrice);
    setValue("deliveryCharge", userData?.user?.deliveryCharge);
  }, [userData]);

  const freeDelSubmit = async (data: any) => {
    const ToastID = toast.loading("Please wait...");
    try {
      const response = await SellerService.updateDeliveryData(data); // Using SellerService
      if (response.status === 200) {
        fetchUserData(); // Call fetchUserData after success
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
    <Form onSubmit={handleSubmit(freeDelSubmit)}>
      <FormGroup className="mb-3">
        <FormLabel htmlFor="minimumOrderPrice">
          Minimum Order Price (₹)
        </FormLabel>
        <FormControl
          type="number"
          id="minimumOrderPrice"
          {...register("minimumOrderPrice", { valueAsNumber: true })}
          placeholder="Set minimum order price"
          isInvalid={!!errors.minimumOrderPrice}
        />
        <FormText>
          Enter the minimum order price for which delivery is free.
        </FormText>
        <FormControl.Feedback type="invalid">
          {String(errors.minimumOrderPrice?.message)}
        </FormControl.Feedback>
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel htmlFor="deliveryCharge">Delivery Charge (₹)</FormLabel>
        <FormControl
          type="number"
          id="deliveryCharge"
          {...register("deliveryCharge", { valueAsNumber: true })}
          placeholder="Set delivery charge"
          isInvalid={!!errors.deliveryCharge}
        />
        <FormText>
          Enter the delivery charge for orders below the minimum price.
        </FormText>
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

export default FreeDeliveryForm;
