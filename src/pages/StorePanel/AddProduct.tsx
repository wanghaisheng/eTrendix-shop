import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner, Form, Button, Row, Col, Table } from "react-bootstrap";
import ReactQuill from "react-quill"; // For rich text editor
import "react-quill/dist/quill.snow.css"; // For ReactQuill styles
import CategoryService from "../../services/CategoryService";
import ImagesUpload from "../../Components/ImagesUpload";
import SellerService from "../../services/SellerService";
import { toast } from "react-toastify";
import axios from "axios";
import shortid from "shortid";

// Define interfaces for customDetails, suggestions, and other data structures
interface CustomDetail {
  label: string;
  value: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface ProductSuggestion {
  thumbnail: string;
  title: string;
  extensions?: string[];
}

const schema = z.object({
  category: z.string().nonempty({ message: "Category is required" }),
  subCategory: z.string().nonempty({ message: "Subcategory is required" }),
  name: z.string().nonempty({ message: "Product name is required" }),
  company: z.string().nonempty({ message: "Company is required" }),
  intobox: z.string().nonempty({ message: "Into the Box is required" }),
});

const AddProduct = () => {
  const [processing, setProcessing] = useState(false);
  const [fogBtn, setFogBtn] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [productSuggestions, setProductSuggestions] = useState<
    ProductSuggestion[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [description, setDescription] = useState<string>("");
  const [highlightFeatures, setHighlightFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customDetails, setCustomDetails] = useState<CustomDetail[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories("all");
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const callSubCat = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catSlug = e.target.value;
    setSubCategories([]);

    try {
      const response = await CategoryService.getCategories(catSlug);
      if (response.status === 200) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setProcessing(true);

    const ToastID = toast.loading("Please wait...");

    const submissionData = {
      ...data,
      tags: selectedTags,
      customDetails: customDetails,
      highlightFeatures: highlightFeatures,
      description: description,
    };

    try {
      // Submit product information
      const productResponse = await SellerService.addProduct(submissionData);

      if (productResponse.data.status == "success") {
        // Update final success toast
        toast.update(ToastID, {
          render: "Product added successfully!",
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });

        const productId = productResponse.data.product._id; // Assuming the API returns the product ID
        // console.log(productResponse);
        // Upload images
        for (let i = 0; i < selectedFiles.length; i++) {
          const imageIndex = i + 1;
          const image = selectedFiles[i];
          const uploadToastID = toast.loading(
            `Uploading image ${imageIndex} out of ${selectedFiles.length}...`
          );

          // Upload image
          const uploadImage = await SellerService.uploadImage(productId, image); // Assuming uploadImage API takes productId and image

          if (uploadImage.data.status == "success") {
            // Update toast message
            toast.update(uploadToastID, {
              render: `Image ${imageIndex} out of ${selectedFiles.length} uploaded successfully.`,
              type: "success",
              isLoading: false,
              draggable: true,
              closeButton: true,
              autoClose: 5000,
            });
          }
        }
      }
      // Reset form and set processing state to false
      setProcessing(false);
      reset(); // Reset form fields
      setSelectedFiles([]); // Clear selected files
      setSelectedTags([]); // Clear selected tags
      setDescription(""); // Clear description
      setSubCategories([]); // Clear subcategories
      setCustomDetails([{ label: "", value: "" }]); // Reset custom details
      setHighlightFeatures([""]); // Reset highlight features
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.update(ToastID, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      } else {
        toast.update(ToastID, {
          render: "An error occurred while adding the product.",
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      }
      setProcessing(false);
    }
  };

  const addFeatureField = () => {
    setHighlightFeatures([...highlightFeatures, ""]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...highlightFeatures];
    newFeatures[index] = value;
    setHighlightFeatures(newFeatures);
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = [...highlightFeatures];
    newFeatures.splice(index, 1);
    setHighlightFeatures(newFeatures);
  };

  const addDetailField = () => {
    setCustomDetails([...customDetails, { label: "", value: "" }]);
  };

  const handleDetailChange = (
    index: number,
    key: keyof CustomDetail,
    value: string
  ) => {
    const newDetails = [...customDetails];
    newDetails[index][key] = value;
    setCustomDetails(newDetails);
  };

  const removeDetailField = (index: number) => {
    const newDetails = [...customDetails];
    newDetails.splice(index, 1);
    setCustomDetails(newDetails);
  };

  const findOnDB = async () => {
    // console.log('Product Name:', productName);
    setFogBtn(true);

    try {
      if (productName == "") {
        throw "Please enter product name";
      }
      const response = await SellerService.fetchGProducts({
        title: productName,
      });

      if (response.status === 200) {
        setProductSuggestions(response.data.products);
      }
      setFogBtn(false);
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      } else if (error != "") {
        toast.error(error, {
          position: "bottom-center",
        });
      }
      setFogBtn(false);
    }
  };

  const CORS_PROXY = "https://api.allorigins.win/get?url=";

  const fetchImageAsBase64 = async (imageUrl: string) => {
    try {
      const response = await axios.get(CORS_PROXY + imageUrl);

      return response.data.contents;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const selectProduct = async (product: any) => {
    setProductName(product.title);
    setValue("name", product.title);
    setSelectedTags(product.extensions || []);
    setHighlightFeatures(product.extensions || []);
    setProductSuggestions([]);
    if (product.thumbnail) {
      const base64Image = await fetchImageAsBase64(product.thumbnail);

      if (base64Image) {
        const fileDetails = {
          id: shortid.generate(),
          filename: "image.jpeg", // You can set any default name here
          filetype: "image/jpeg", // Assuming JPEG format
          fileimage: base64Image,
          datetime: new Date().toLocaleString("en-IN"), // Assuming current time as last modified date
          filesize: base64Image.length, // Length of base64 string can be used as an approximate size
        };

        setSelectedFiles([fileDetails]);
      } else {
        console.error("Failed to fetch image or convert to base64.");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="top-space px-15">
      <Row>
        <Col md={6}>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              {...register("category")}
              onChange={callSubCat}
              isInvalid={!!errors.category}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            {errors.category && (
              <Form.Text className="text-danger">
                {String(errors.category.message)}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="subCategory">
            <Form.Label>Sub Category</Form.Label>
            <Form.Select
              {...register("subCategory")}
              isInvalid={!!errors.subCategory}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory.slug}>
                  {subCategory.name}
                </option>
              ))}
            </Form.Select>
            {errors.subCategory && (
              <Form.Text className="text-danger">
                {String(errors.subCategory.message)}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="company" className="my-3">
        <Form.Label>Product Company</Form.Label>
        <Form.Control
          {...register("company")}
          type="text"
          placeholder="Enter product company"
          isInvalid={!!errors.company}
        />
        {errors.company && (
          <Form.Text className="text-danger">
            {String(errors.company.message)}
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group controlId="name" className="my-3">
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          {...register("name")}
          type="text"
          placeholder="Enter product name"
          isInvalid={!!errors.name}
          onChange={(e) => setProductName(e.target.value)}
        />
        {errors.name && (
          <Form.Text className="text-danger">
            {String(errors.name.message)}
          </Form.Text>
        )}
      </Form.Group>

      <Button variant="secondary" onClick={() => findOnDB()} disabled={fogBtn}>
        {fogBtn ? <Spinner animation="border" size="sm" /> : "Find in database"}
      </Button>

      {productSuggestions.length > 0 && (
        <Table className="mt-3">
          <tbody>
            {productSuggestions.map((suggestion, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={suggestion.thumbnail}
                    alt=""
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </td>
                <td>
                  <p>{suggestion.title}</p>
                  {suggestion?.extensions?.map((ext, key) => (
                    <p key={key}>{ext}</p>
                  ))}
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      selectProduct(suggestion);
                    }}
                  >
                    Add
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Form.Group className="my-3">
        <ImagesUpload
          titleText="Product Images"
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
        />
      </Form.Group>

      <Form.Group className="my-3">
        <Form.Label>Tags</Form.Label>
        {/* Tags input component here */}
      </Form.Group>

      <Form.Group controlId="intobox" className="my-3">
        <Form.Label>Into the Box</Form.Label>
        <Form.Control
          {...register("intobox")}
          as="textarea"
          rows={3}
          placeholder="Enter what comes in the box"
          isInvalid={!!errors.intobox}
        />
        {errors.intobox && (
          <Form.Text className="text-danger">
            {String(errors.intobox.message)}
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group controlId="description" className="my-3">
        <Form.Label>Description</Form.Label>
        <ReactQuill value={description} onChange={setDescription} />
      </Form.Group>

      <Form.Group className="my-3">
        <Form.Label>Highlight Features</Form.Label>
        {highlightFeatures.map((feature, index) => (
          <Row key={index} className="mb-2">
            <Col xs={9}>
              <Form.Control
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="Enter Product Feature"
              />
            </Col>
            <Col xs={3}>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFeatureField(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="success" onClick={addFeatureField}>
          Add Feature
        </Button>
      </Form.Group>

      <Form.Group className="my-3">
        <Form.Label>Custom Product Details</Form.Label>
        {customDetails.map((detail, index) => (
          <Row key={index} className="mb-2">
            <Col xs={3}>
              <Form.Control
                type="text"
                value={detail.label}
                onChange={(e) =>
                  handleDetailChange(index, "label", e.target.value)
                }
                placeholder="Detail Name"
              />
            </Col>
            <Col xs={6}>
              <Form.Control
                type="text"
                value={detail.value}
                onChange={(e) =>
                  handleDetailChange(index, "value", e.target.value)
                }
                placeholder="Detail Value"
              />
            </Col>
            <Col xs={3}>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeDetailField(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="success" onClick={addDetailField}>
          Add Detail
        </Button>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={processing}>
        {processing ? "Processing..." : "Submit"}
      </Button>
    </Form>
  );
};

export default AddProduct;
