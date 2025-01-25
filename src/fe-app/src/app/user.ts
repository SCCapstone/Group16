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
  mobilePhone: number;
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

// will need appearance settings for rc1
