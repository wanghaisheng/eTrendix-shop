import React, { useState } from "react";
import shortid from "shortid";
import "../assets/css/ImageUpload.css";

interface ImagesUploadProps {
  titleText: string;
  setSelectedFiles: any;
  selectedFiles: any;
}

const ImagesUpload: React.FC<ImagesUploadProps> = ({
  titleText,
  setSelectedFiles,
  selectedFiles,
}) => {
  const [Files, SetFiles] = useState<any>([]);

  const filesizes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let images: File[] = [];
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        images.push(e.target.files[i]);
        let reader = new FileReader();
        let file = e.target.files[i];
        reader.onloadend = () => {
          setSelectedFiles((preValue: any) => [
            ...preValue,
            {
              id: shortid.generate(),
              filename: file.name,
              filetype: file.type,
              fileimage: reader.result,
              datetime: file.lastModified.toLocaleString("en-IN"),
              filesize: filesizes(file.size),
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const DeleteSelectFile = (id: string) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = selectedFiles.filter((data: any) => data.id !== id);
      setSelectedFiles(result);
    }
  };

  const DeleteFile = (id: string) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = Files.filter((data: any) => data.id !== id);
      SetFiles(result);
    }
  };

  //   const resetFiles = () => {
  //     setSelectedFiles([]);
  //   };

  return (
    <div className="fileupload-view">
      <div className="row justify-content-center m-0">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title">
                    <h6>{titleText}</h6>
                  </div>
                </div>

                <div className="kb-file-upload">
                  <div className="file-upload-box">
                    <input
                      type="file"
                      id="fileupload"
                      className="file-upload-input"
                      onChange={InputChange}
                      accept="image/png, image/gif, image/jpeg"
                      multiple
                    />
                    <span>
                      Drag and drop or{" "}
                      <span className="file-link">Choose your files</span>
                    </span>
                  </div>
                </div>

                <div className="kb-attach-box mb-3">
                  {selectedFiles &&
                    selectedFiles.map((data: any) => {
                      const { id, filename, fileimage, filesize } = data;
                      return (
                        <div className="file-atc-box" key={id}>
                          {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                            <div className="file-image">
                              <img src={fileimage as string} alt="" />
                            </div>
                          ) : (
                            <div className="file-image">
                              <i className="far fa-file-alt"></i>
                            </div>
                          )}
                          <div className="file-detail">
                            <h6>{filename}</h6>
                            <p></p>
                            <p>
                              <span>Size : {filesize}</span>
                            </p>
                            <div className="file-actions">
                              <button
                                type="button"
                                className="file-action-btn"
                                onClick={() => DeleteSelectFile(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {Files.length > 0 && (
                  <div className="kb-attach-box">
                    <hr />
                    {Files.map((data: any) => {
                      const { id, filename, fileimage, datetime, filesize } =
                        data;
                      return (
                        <div className="file-atc-box" key={id}>
                          {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                            <div className="file-image">
                              <img src={fileimage as string} alt="" />
                            </div>
                          ) : (
                            <div className="file-image">
                              <i className="far fa-file-alt"></i>
                            </div>
                          )}
                          <div className="file-detail">
                            <h6>{filename}</h6>
                            <p>
                              <span>Size : {filesize}</span>
                              <span className="ml-3">
                                Modified Time : {datetime}
                              </span>
                            </p>
                            <div className="file-actions">
                              <button
                                className="file-action-btn"
                                onClick={() => DeleteFile(id)}
                              >
                                Delete
                              </button>
                              <a
                                href={fileimage as string}
                                className="file-action-btn"
                                download={filename}
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesUpload;
