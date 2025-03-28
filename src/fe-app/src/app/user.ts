export interface User {
  readonly id: string;
}

// this interface will be added to as new user info is required across the project
// for now it will only have contact info
export interface UserInfo {
  readonly id: string;
  name: Name;
  username: string;
  contact: ContactInfo;
  settings: NotificationSettings;
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
  id: string;
  content: string;
}

// will need appearance settings for rc1
