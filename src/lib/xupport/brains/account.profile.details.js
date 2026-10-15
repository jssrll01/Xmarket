export const topic = 'account/profile/details';
export const triggers = ['profile', 'avatar', 'photo', 'picture', 'name', 'username', 'edit profile'];

export default [
  {
    id: 'account_profile_load_error',
    keywords: ['profile loading error', 'profile will not load', 'profile not loading', 'profile page error', 'account profile loading'],
    answer:
      "If your XMARKET profile does not load correctly, refresh the page and check your internet connection. If the problem continues, try accessing the profile again later.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_access',
    keywords: ['open profile', 'view profile', 'my profile', 'profile page', 'account profile'],
    answer:
      "Open your XMARKET profile from your account controls to view the account information and profile options available to you.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_edit',
    keywords: ['edit profile information', 'modify profile', 'change profile details', 'profile editing', 'update profile details'],
    answer:
      "Open your XMARKET profile and use the available editing controls to update information that can be changed. Save the changes when finished.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_name_missing',
    keywords: ['name missing profile', 'profile name missing', 'name not showing', 'display name missing', 'account name not showing'],
    answer:
      "If your name is not appearing correctly on your XMARKET profile, open the profile settings and check the available name fields. If the information is correct but still does not appear, contact support.",
    links: [{ label: 'Profile', to: '/profile' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_profile_photo_missing',
    keywords: ['profile picture missing', 'avatar missing', 'profile image disappeared', 'profile photo not showing', 'avatar not showing'],
    answer:
      "If your XMARKET profile image is not displaying, refresh the profile page and check whether the image is still saved in your profile settings.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_photo_upload',
    keywords: ['upload avatar', 'upload profile picture', 'add profile photo', 'set profile picture', 'change avatar'],
    answer:
      "If XMARKET provides profile-image editing, open your profile and use the available image-upload control to select your preferred profile picture.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_photo_invalid',
    keywords: ['profile image rejected', 'profile photo error', 'avatar upload failed', 'profile picture upload error', 'invalid profile image'],
    answer:
      "If XMARKET rejects a profile image, check the image requirements shown by the system and try another supported image.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_photo_large',
    keywords: ['profile picture too large', 'avatar file too large', 'profile image size', 'photo upload too large', 'profile photo file size'],
    answer:
      "If your profile image is too large to upload, use a smaller supported image and retry the upload.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_save_success',
    keywords: ['profile saved', 'profile updated successfully', 'profile changes saved', 'profile update complete', 'profile saved successfully'],
    answer:
      "After successfully saving your XMARKET profile changes, return to your profile to confirm that the updated information appears correctly.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_settings',
    keywords: ['profile settings', 'profile options', 'manage profile', 'profile controls', 'profile preferences'],
    answer:
      "Use the XMARKET profile and account settings areas to manage the profile information and options available for your account.",
    links: [{ label: 'Profile', to: '/profile' }, { label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_profile_username_change',
    keywords: ['edit username profile', 'change profile username', 'username settings', 'username update', 'modify username'],
    answer:
      "If username changes are supported by XMARKET, use the username field in the appropriate profile or account settings area and save the change.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_invalid_update',
    keywords: ['invalid profile update', 'profile information rejected', 'profile update rejected', 'profile field invalid', 'cannot update profile'],
    answer:
      "If XMARKET rejects a profile update, check the affected field and correct the information according to the validation message displayed.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_profile_required_field',
    keywords: ['profile required field', 'missing profile field', 'profile field required', 'required profile information', 'profile form incomplete'],
    answer:
      "Complete any required profile fields indicated by XMARKET before saving your profile changes.",
    links: [{ label: 'Profile', to: '/profile' }],
  },
];
