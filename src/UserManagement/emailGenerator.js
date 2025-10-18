// utils/emailGenerator.js
//import { checkEmailExists } from '../api/crudApi'; // افترض أن لديك هذه الوظيفة

export const generateUniqueEmail = async (username = null, domain = "company.com") => {
  let email;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (!isUnique && attempts < maxAttempts) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    
    let baseName = username || "user";
    baseName = baseName
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    
    email = `${baseName}.${timestamp}${randomSuffix}@${domain}`;
    
    // التحقق إذا كان البريد موجود مسبقاً
    //const exists = await checkEmailExists(email);
    
//    if (!exists) {
      isUnique = true;
    }
    
    attempts++;
  }

  return email;
};


// في عمود البريد الإلكتروني
{ 
  accessorKey: 'email', 
  header: 'البريد الالكتروني', 
  size: 150,
  muiEditTextFieldProps: {
    error: !!validationErrors?.email,
    helperText: validationErrors?.email,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton 
            onClick={() => {
              const newEmail = generateUniqueEmail();
              // تعيين القيمة في الحقل
            }}
          >
            <RefreshIcon />
          </IconButton>
        </InputAdornment>
      ),
    },
  },
}