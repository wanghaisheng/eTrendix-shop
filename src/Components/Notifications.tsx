import { Modal, Button } from "react-bootstrap";
import UserService from "../services/UserService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Notifications = ({
  showNotifications,
  setShowNotifications,
  setShowNotificationCount,
}: {
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  setShowNotificationCount: (value: number) => void;
}) => {
  const [notifications, setNotifications] = useState<any>();

  useEffect(() => {
    if (showNotifications) fetchNotifications();
  }, [showNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await UserService.fetchNotifications();
    if (response.status === 200) {
      setNotifications(response.data);

      var unread = 0;

      response.data.data.forEach((notification: any) => {
        if (!notification.read) {
          unread++;
        }
      });

      setShowNotificationCount(unread);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await UserService.markNotificationAsRead(id);
      setShowNotifications(false);
      fetchNotifications();
    } catch (error) {
      setShowNotifications(false);
      console.log(error);
    }
  };
  return (
    <Modal
      show={showNotifications}
      onHide={() => setShowNotifications(false)}
      fullscreen={true}
    >
      <Modal.Header>
        <a onClick={() => setShowNotifications(false)} className="back-btn">
          <i className="iconly-Arrow-Left icli"></i>
        </a>
        <div className="mx-2">
          <h2>Notification</h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="px-15">
          <div id="ourHolder" className="filter-content">
            {notifications &&
              notifications?.data.map((notification: any, index: number) => {
                const link = notification.link.startsWith("/")
                  ? notification.link
                  : `/notifications/${notification.link}`;

                return (
                  <div
                    className={`item order ${
                      !notification.read && "border border-info "
                    } position-relative`}
                    key={index}
                  >
                    {!notification.read && (
                      <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    )}
                    <Link
                      to={link}
                      onClick={() => markNotificationAsRead(notification._id)}
                      className="media"
                    >
                      <div className="media-body">
                        <h4>{notification.message}</h4>
                        <h6 className="content-color">
                          {notification.createdAt}
                        </h6>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowNotifications(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Notifications;
