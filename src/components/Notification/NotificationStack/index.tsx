import React from 'react';
import PropTypes from 'prop-types';
import { Notification } from 'reducers/notification';
import StackedNotification from './StackedNotification';

const getNotificationStyle = (index: number) => ({
  top: `${2 + index * 8}rem`
});
const DEFAULT_DISMISS_TIME = 5000;

type Props = {
  notifications: Notification[];
  onDismiss: (notification: Notification) => void;
  onRequestClose?: (notification: Notification) => void;
};

const NotificationStack = (props: Props) => {
  const { notifications, onDismiss } = props;
  const numberOfNotifications = notifications.length - 1;

  return (
    <div className="notification-list">
      {notifications.map((notification, index) => {
        const isLast = numberOfNotifications === index;
        const notificationStyle = getNotificationStyle(index);

        let dismissAfter = notification.dismissAfter ?? DEFAULT_DISMISS_TIME;

        if (!isLast) {
          dismissAfter += index * 1000;
        }

        return (
          <StackedNotification
            {...notification}
            key={notification.key}
            dismissAfter={dismissAfter}
            onDismiss={() => onDismiss(notification)}
            notificationStyle={notificationStyle}
          />
        );
      })}
    </div>
  );
};

NotificationStack.propTypes = {
  notifications: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func,
  action: PropTypes.string,
  dismissAfter: PropTypes.number
};

export default NotificationStack;
