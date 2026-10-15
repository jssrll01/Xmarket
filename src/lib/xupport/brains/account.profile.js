export const topic = 'account/profile';
export const triggers = ['profile', 'username', 'display name', 'photo', 'avatar', 'preferences', 'notifications', 'settings'];

export default [
  {
    id: 'account_update_profile',
    keywords: ['edit profile', 'update profile', 'change profile', 'profile information', 'edit account information', 'change name'],
    answer:
      "Open your XMARKET profile or account settings to review the information that can be edited. Save your changes after updating the available fields.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_username',
    keywords: ['username', 'change username', 'edit username', 'update username', 'account username'],
    answer:
      "Open your XMARKET account settings and check the profile fields available for editing. If username changes are supported, follow the instructions shown there.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_display_name',
    keywords: ['display name', 'change display name', 'edit display name', 'profile name', 'change profile name'],
    answer:
      "If XMARKET allows your display name to be changed, open your profile settings, update the available name field, and save your changes.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_photo',
    keywords: ['profile photo', 'profile picture', 'change profile picture', 'upload profile photo', 'edit avatar'],
    answer:
      "If profile-picture editing is available, open your XMARKET profile and use the profile-image control to select a new image.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_missing',
    keywords: ['profile missing', 'profile not showing', 'account information missing', 'my profile disappeared', 'profile error'],
    answer:
      "If information is missing from your XMARKET profile, refresh the page and check that you are signed in to the correct account. If the information still does not appear, contact XMARKET Support.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_save',
    keywords: ['profile changes not saving', 'cannot save profile', 'profile save error', 'update profile failed', 'profile update error'],
    answer:
      "If your XMARKET profile changes are not saving, check that the information is valid and that all required fields are complete. Retry the update and check for any error message.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_settings',
    keywords: ['account settings', 'settings', 'manage account', 'account preferences', 'account options'],
    answer:
      "Use your XMARKET account settings to manage the account options and information made available to you.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_settings_save',
    keywords: ['settings not saving', 'cannot save settings', 'settings save error', 'update settings failed', 'settings error'],
    answer:
      "If an XMARKET account-setting change does not save, verify the information entered and retry. If an error remains, refresh the page and try again.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_change_preferences',
    keywords: ['change preferences', 'account preferences', 'update preferences', 'personal preferences', 'account options'],
    answer:
      "Open your XMARKET account settings to review the preferences and account options available to you.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_notifications',
    keywords: ['account notifications', 'notification settings', 'change notifications', 'notifications', 'notification preferences'],
    answer:
      "If notification preferences are available in XMARKET, manage them from the account settings or notification controls provided by the system.",
    links: [{ label: 'Notifications', to: '/notifications' }],
  },
  {
    id: 'account_notification_missing',
    keywords: ['notification missing', 'did not get notification', 'no notification', 'notification not received', 'missing alert'],
    answer:
      "If you expected an XMARKET notification but did not receive one, check the relevant order or account page directly. Notification delivery can depend on the type of notification and your device or browser settings.",
    links: [{ label: 'Notifications', to: '/notifications' }],
  },
  {
    id: 'account_notification_wrong',
    keywords: ['wrong notification', 'unexpected notification', 'notification error', 'incorrect alert', 'notification I did not expect'],
    answer:
      "If an XMARKET notification appears incorrect or unexpected, open the related order or account area to verify the current information. Contact support if the notification does not match your account activity.",
    links: [{ label: 'Notifications', to: '/notifications' }],
  },
];
