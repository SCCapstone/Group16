export interface User {
  id: string;
}

// this interface will be added to as new user info is required across the project
// for now it will only have contact info
export interface UserInfo {
  id: string;
  name: string;
  username: string;
  contact: ContactInfo;
  settings: NotificationSettings;
}

export interface ContactInfo {
  mobilePhone: number;
  email: string;
  institutionEmail: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  institutionEmailNotifications: boolean;
  smsNotifications: boolean;
}

// will need appearance settings for rc1
