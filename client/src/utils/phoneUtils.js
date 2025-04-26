// client/src/utils/phoneUtils.js
export const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, '');
    const match = phoneNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return '';
    
    return !match[2]
      ? `(${match[1]}`
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  };
  
  export const validatePhoneNumber = (value) => {
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(value);
  };