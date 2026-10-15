export const topic = 'account/addresses/details';
export const triggers = ['address', 'delivery address', 'shipping address', 'postal', 'zip', 'landmark', 'recipient'];

export default [
  {
    id: 'account_address_list',
    keywords: ['saved addresses', 'my addresses', 'address list', 'view addresses', 'delivery addresses'],
    answer:
      "Open the XMARKET address-management area to view the delivery addresses saved to your account.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_name',
    keywords: ['address recipient name', 'delivery recipient', 'name on address', 'change recipient name', 'shipping name'],
    answer:
      "When adding or editing an XMARKET delivery address, enter the recipient information requested by the address form and make sure it is accurate for delivery.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_phone',
    keywords: ['address phone number', 'delivery contact number', 'shipping phone', 'recipient phone', 'phone on address'],
    answer:
      "Use the phone-number field provided in the XMARKET address form when required, and make sure the delivery contact number is accurate.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_city',
    keywords: ['city address', 'delivery city', 'shipping city', 'city field address', 'wrong city'],
    answer:
      "Check the city or municipality information when entering an XMARKET delivery address. Correct any inaccurate location information before saving the address.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_province',
    keywords: ['province address', 'delivery province', 'shipping province', 'province field', 'wrong province'],
    answer:
      "Make sure the province or regional information in your XMARKET delivery address is correct before saving it.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_postal',
    keywords: ['postal code', 'zip code address', 'delivery postal code', 'wrong postal code', 'shipping zip code'],
    answer:
      "Enter the correct postal or ZIP code requested by the XMARKET address form. An incorrect postal code can affect address validation or delivery information.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_landmark',
    keywords: ['landmark address', 'delivery landmark', 'add landmark', 'shipping landmark', 'landmark information'],
    answer:
      "If XMARKET provides a landmark or additional-address field, enter useful location details that can help identify the delivery location.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_unit',
    keywords: ['unit number', 'house number', 'building number', 'apartment address', 'room number delivery'],
    answer:
      "Include the relevant house, unit, apartment, building, or room information in the address fields provided by XMARKET so the delivery location can be identified accurately.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_incomplete',
    keywords: ['incomplete address', 'missing address details', 'address incomplete', 'delivery address incomplete', 'partial address'],
    answer:
      "If your XMARKET delivery address is incomplete, edit the saved address and provide all required location and contact information before using it for an order.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_duplicate',
    keywords: ['duplicate address', 'same address twice', 'duplicate saved address', 'repeated address', 'two same addresses'],
    answer:
      "If the same address was saved more than once, open your saved addresses and remove the unnecessary duplicate if the delete option is available.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_no_addresses',
    keywords: ['no saved addresses', 'address list empty', 'no delivery address', 'addresses empty', 'no address saved'],
    answer:
      "If your XMARKET address list is empty, add a delivery address before placing an order that requires shipping.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_select_checkout',
    keywords: ['select address checkout', 'choose delivery address', 'checkout address', 'select shipping address', 'use saved address'],
    answer:
      "During XMARKET checkout, select the appropriate saved delivery address from the available address options before continuing with the order.",
    links: [{ label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'account_address_checkout_missing',
    keywords: ['address missing checkout', 'cannot select address', 'address not appearing checkout', 'saved address not showing', 'checkout cannot find address'],
    answer:
      "If a saved XMARKET address does not appear at checkout, check your address list and confirm that the address was saved correctly. Refresh the checkout page if necessary.",
    links: [{ label: 'Addresses', to: '/addresses' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'account_address_delivery_area',
    keywords: ['delivery area address', 'address delivery area', 'does xmarket deliver here', 'location delivery', 'delivery location'],
    answer:
      "Delivery availability depends on the shipping coverage supported by the specific XMARKET order and seller. Enter your delivery address during checkout to see the available options.",
    links: [{ label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'account_address_change_before_order',
    keywords: ['change address before ordering', 'update address before checkout', 'edit address before purchase', 'change delivery address before order'],
    answer:
      "Before placing an XMARKET order, update or add the correct delivery address in your saved addresses and select it during checkout.",
    links: [{ label: 'Addresses', to: '/addresses' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'account_address_multiple',
    keywords: ['multiple addresses', 'several delivery addresses', 'different shipping addresses', 'save multiple addresses', 'more than one address'],
    answer:
      "If XMARKET allows multiple saved addresses, you can manage them from your address area and select the appropriate delivery address when ordering.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_remove_default',
    keywords: ['delete default address', 'remove primary address', 'delete default shipping address', 'remove default delivery address'],
    answer:
      "If an address is currently set as your default, check the available address-management options before deleting it. You may need to select another address as the default first.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
  {
    id: 'account_address_save_after_edit',
    keywords: ['save edited address', 'address update save', 'save address changes', 'edited address not saved', 'address changes'],
    answer:
      "After editing an XMARKET delivery address, make sure you select the available Save or Update option before leaving the page.",
    links: [{ label: 'Addresses', to: '/addresses' }],
  },
];
