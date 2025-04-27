export interface User {
  readonly id: string;
}

export interface UserInfo {
  readonly id: string;
  name: Name;
  username: string;
  contact: ContactInfo;
  settings: NotificationSettings;
  notifications: Notifications[];
}

export interface ContactInfo {
  mobilePhone: string;
  email: string;
  readonly institutionEmail: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  institutionEmailNotifications: boolean;
  smsNotifications: boolean;
}

export interface Name {
  readonly given: string;
  readonly family: string;
  preferredDisplayName: string;
}

export interface Notifications {
  message: string;
  timestamp: string;
}
