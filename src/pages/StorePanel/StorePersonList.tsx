import { useEffect, useState } from "react";
import SellerService from "../../services/SellerService";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  Form,
  FormControl,
  Modal,
  FormGroup,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const schema = z.object({
  position: z.string(),
});

interface PersonFormData {
  position: string;
}

const StorePersonList = () => {
  const [SPData, setSPData] = useState<any[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState({
    page: 1,
    search: "",
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const response = await SellerService.getStorePerson(filter);
      if (response.status === 200) {
        if (filter.page === 1) {
          setSPData(response.data.storePersons);
        } else {
          setSPData((prevData) => [...prevData, ...response.data.storePersons]);
        }
        setHasMore(response.data.storePersons.length > 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore) {
      setFilter((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      setLoadingMore(true);
    }
  };

  const { register, handleSubmit, setValue } = useForm<PersonFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedPerson?.position) setValue("position", selectedPerson.position);
  }, [selectedPerson, setValue]);

  const submitEditPerson = async (person: PersonFormData) => {
    const ToastID = toast.loading("Please wait...");

    const submitData = {
      id: selectedPerson._id,
      position: person.position,
    };

    try {
      const response = await SellerService.updateStorePerson(submitData);
      if (response.status === 200) {
        fetchData();
        setVisibleModal(false);
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.update(ToastID, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="top-space px-15">
      <Row>
        <Col xs={12}>
          <Card className="mb-4">
            <Card.Header>
              <strong>Filters</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12}>
                  <FormLabel htmlFor="search">Search</FormLabel>
                  <FormControl
                    id="search"
                    value={filter.search}
                    onChange={(e) =>
                      setFilter({ ...filter, page: 1, search: e.target.value })
                    }
                    required
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {SPData?.map((storePerson: any, index: number) => (
              <tr key={index}>
                <td>
                  {storePerson.user_id?.name}
                  <h4>{storePerson.user_id?.phone}</h4>
                </td>
                <td>{storePerson.position}</td>
                <td>{storePerson.status}</td>
                <td>{new Date(storePerson.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setVisibleModal(true);
                      setSelectedPerson(storePerson);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {hasMore && (
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" disabled={loadingMore} onClick={loadMore}>
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      <Modal show={visibleModal} onHide={() => setVisibleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={handleSubmit((data) => {
            submitEditPerson(data);
          })}
        >
          <Modal.Body>
            <FormGroup>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <FormControl disabled value={selectedPerson?.user_id?.phone} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl
                type="text"
                value={selectedPerson?.user_id?.name}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="position">Position</FormLabel>
              <FormSelect id="position" {...register("position")} required>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisibleModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StorePersonList;
