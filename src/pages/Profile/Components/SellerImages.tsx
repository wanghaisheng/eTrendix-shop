import { Button, Modal, Table, Image } from "react-bootstrap";
import ImagesUpload from "../../../Components/ImagesUpload";
import { useState } from "react";
import { toast } from "react-toastify";
import SellerService from "../../../services/SellerService";

const SellerImages = ({
  user,
  showImagesModal,
  setShowImagesModal,
  fetchUser,
}: any) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoad, setUploadLoad] = useState(false);

  const uploadSellerImage = async () => {
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const imageIndex = i + 1;
        const image = selectedFiles[i];
        const uploadToastID = toast.loading(
          `Uploading image ${imageIndex} out of ${selectedFiles.length}...`
        );

        // Upload image
        const uploadImage = await SellerService.uploadImageSeller(image);

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
          setSelectedFiles([]);
        } else {
          toast.update(uploadToastID, {
            render: uploadImage.data.message,
            type: "error",
            isLoading: false,
            draggable: true,
            closeButton: true,
            autoClose: 5000,
          });
        }
      }
      fetchUser();
      setUploadLoad(false);
    } catch (error) {
      setUploadLoad(false);
      console.log(error);
    }
  };

  const removeImage = async (index: number) => {
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.removeSellerImage(index);

      if (response.status === 200) {
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });

        fetchUser();
      }
    } catch (error: any) {
      console.log(error);
      const message = error.response.data.message
        ? error.response.data.message
        : "Something went wrong";
      console.log(message);
      toast.update(ToastID, {
        render: message,
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    }
  };
  return (
    <Modal
      show={showImagesModal}
      onHide={() => {
        setShowImagesModal(false);
      }}
      fullscreen={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Shop Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ImagesUpload
          titleText={"Upload shop images"}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
        />

        {selectedFiles.length > 0 && (
          <div className="px-2 py-2">
            <Button
              variant="primary"
              onClick={() => {
                uploadSellerImage();
              }}
              disabled={uploadLoad}
            >
              {uploadLoad ? "Uploading" : "Upload"}
            </Button>
          </div>
        )}

        <Table responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.images.length > 0 &&
              user.images.map((image: string, index: number) => (
                <tr key={index}>
                  <td>
                    <Image src={image} thumbnail />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete the photo?")) {
                          removeImage(index);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowImagesModal(false);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SellerImages;
