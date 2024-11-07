import React, { useState } from "react";
import {
  Form,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import SellerService from "../../services/SellerService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string(),
  phone: z.number(),
  position: z.string(),
});

interface PersonFormData {
  name: string;
  phone: number;
  position: string;
}

const AddStorePerson = () => {
  const [disableName, setDisableName] = useState(false);
  const [personID, setPersonID] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset } = useForm<PersonFormData>({
    resolver: zodResolver(schema),
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (phone.length === 10) {
      fetchStoreUser(phone);
    } else {
      setDisableName(false);
    }
  };

  const fetchStoreUser = async (phone: string) => {
    try {
      const response = await SellerService.fetchStoreUser(phone);
      if (response.status === 200) {
        setValue("name", response.data.name);
        if (response.data.name) {
          setDisableName(true);
        }
        setPersonID(response.data._id);
      } else {
        setDisableName(false);
        setPersonID(null);
      }
    } catch (error) {
      setDisableName(false);
      setPersonID(null);
      console.error(error);
    }
  };

  const submitAddPerson = async (data: PersonFormData) => {
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.submitAddPerson({
        ...data,
        id: personID,
      });
      if (response.status === 200) {
        reset();
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error adding person";
      toast.update(ToastID, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="top-space px-15">
      <Form onSubmit={handleSubmit((data) => submitAddPerson(data))}>
        <FormGroup controlId="phone">
          <FormLabel>Phone Number</FormLabel>
          <FormControl
            type="tel"
            {...register("phone", {
              valueAsNumber: true,
              onChange: handlePhoneChange,
            })}
            required
          />
        </FormGroup>

        <FormGroup controlId="name">
          <FormLabel>Name</FormLabel>
          <FormControl
            type="text"
            {...register("name")}
            disabled={disableName}
            required
          />
        </FormGroup>

        <FormGroup controlId="position">
          <FormLabel>Position</FormLabel>
          <FormSelect {...register("position")} required>
            <option value="">Select position</option>
            <option value="sales">Salesperson</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
            <option value="stocker">Stocker</option>
            <option value="cleaner">Cleaner</option>
            <option value="security">Security</option>
            <option value="delivery">Delivery Driver</option>
            <option value="supervisor">Supervisor</option>
            <option value="customer_service">Customer Service</option>
            <option value="other">Other</option>
          </FormSelect>
        </FormGroup>

        <FormGroup className="py-3">
          <Button type="submit" variant="primary">
            Add Person
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
};

export default AddStorePerson;
