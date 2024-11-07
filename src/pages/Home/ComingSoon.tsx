import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap";
import "../../assets/css/comingSoon.css";
import imgJPG from "../../assets/images/coming-soon/img.jpeg";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import HomeService from "../../services/HomeService";
import { toast } from "react-toastify";

const ComingSoon = () => {
  const [showModal, setShowModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (contactInfo.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const Toastid = toast.loading("Please wait...");

    try {
      const response = await HomeService.notify(contactInfo);
      if (response.status === 201) {
        setShowModal(false);
        toast.update(Toastid, {
          render: "You're on the list! We'll keep you posted on our launch.",
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
        setContactInfo({
          email: "",
          phone: "",
        });
      } else {
        toast.update(Toastid, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.update(Toastid, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    } finally {
      setShowModal(false);
    }
  };

  const messages = [
    "We’re connecting local sellers with local buyers to make shopping more personal and sustainable. Stay tuned for a better way to shop locally!",
    "Join us as we build a community where local sellers meet local shoppers, bringing a more personal and eco-friendly shopping experience to your doorstep. Stay tuned!",
    "We’re bridging the gap between local buyers and sellers, making shopping more convenient and community-focused. Get ready for a fresh way to shop locally!",
    "Discover the joy of supporting local businesses. We’re here to connect you with your community and bring a sustainable shopping experience right to your neighborhood.",
    "Experience the best of local shopping, where your choices support local businesses and build a more sustainable future. Coming soon!",
    "We’re empowering local sellers to reach you directly, making shopping local easier and more impactful. Stay tuned for an experience that’s rooted in your community.",
    "Together, we can make a difference by choosing local. Our platform connects you to nearby sellers, creating a greener and more personal shopping journey. Exciting changes are on the way!",
    "Shop local, support local. We’re reimagining the shopping experience by bringing you closer to your community and promoting sustainable choices. Stay tuned for more!",
  ];

  const [selectedMessage, setSelectedMessage] = useState("");

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSelectedMessage(randomMessage);
  }, []);

  return (
    <div
      className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-gradient p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, var(--accent), var(--background))",
        color: "var(--foreground)",
      }}
    >
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="display-4 font-weight-bold mb-4">
              Exciting Things Are Coming Soon!
            </h1>
            <p
              className="lead text-muted mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              {selectedMessage}
            </p>
            <img
              src={imgJPG}
              alt="Illustration of a community market shop launch"
              className="img-fluid rounded-lg shadow mb-4"
              style={{ transition: "transform 0.3s ease-in-out" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <Button
              variant="primary"
              className="py-2 px-4 rounded-pill"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => setShowModal(true)}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Notify Me
            </Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Link
              to="/seller-onboarding"
              className="text-secondary"
              style={{ color: "var(--secondary)", textDecoration: "underline" }}
            >
              Interested in Selling? Join Us!
            </Link>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="d-flex align-items-center">
            <FaEnvelope className="me-2" />
            Stay in the Loop!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            padding: "2rem",
          }}
        >
          <p className="mb-3">
            Enter your details and be the first to know when we launch!
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                style={{ borderRadius: "30px" }}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                maxLength={10}
                style={{ borderRadius: "30px" }}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-4 py-2 px-4 rounded-pill"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              Stay Updated
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ComingSoon;
