const acodeData = [
    {
        id: "termux",
        name: "Image 1",
        description: "قم في تثبيت التطبيق مباشرة من متجر ابلاي ",
        appName: "Acode", // اسم التطبيق
        language: "HTML"   // اسم اللغة
    },
    {
        id: 1,
        name: "Image 1",
        description: "بعد تثبيت التطبيق قم في الدخول الية ستجد هذه الواجهة انقر على تلك العلامات الثلاث المؤشر عليها بالسهم الاسود ثم انتقل االى الخطوة التالية",
        code: "pkg update && pkg upgrade pkg install git"
, 
        language: "HTML"   // اسم اللغة
    },
    {
        id: 1,
        name: "Image 1",
        description: "",
        h:'تثبيت GitHub CLI:',
        code: "pkg install gh", 
        language: "HTML"   // اسم اللغة
    },
    {
        id: 4,
        name: "Image 1",
        description: "",
        h:'OpenSSH:',
        code: "pkg install openssh", 
        language: "HTML"   // اسم اللغة
    },
    {
        id: 1,
        name: "Image 1",
        description: "",
        h:'تثبيت GitHub CLI:',
        code: "pkg install gh", 
        language: "HTML"   // اسم اللغة
    }, 
    {
        id: 1,
        name: "Image 1",
        description:'اختر طريقة المصادقة: HTTPS أو SSH اتبع الإرشادات لتسجيل الدخول باستخدام رمز المصادقة أو إضافة مفتاح SSH.',
        h:"إعداد GitHub CLI",
        code: "gh auth login", 
        language: "HTML"   // اسم اللغة
    },  

    {
        id: 1,
        name: "Image 1",
        description :'التاكد من  الحالة'
        ,
        h:'التأكد من تسجيل الدخول:',
        code: "gh auth status", 
        language: "HTML"   // اسم اللغة
    },  
    {
        id: 1,
        name: "Image 1",
        description :''
        ,
        h:'لدخول:',
        code: "gh repo create project-name --private",
        output:'Created repository abdullahaldys9003/project-name on GitHub https://github.com/abdullahaldys9003/project-name',
        language: "HTML"   // اسم اللغة
    }, 
   {
        id: 1,
        name: "Image 1",
        description :''
        ,
        h:'لدخول:',
        code: 
        `mkdir project-name
         cd roject-name 
         git init 
         echo "# My Private Project" > README.md
         git add .
         git commit -m "Initial commit"
         git remote --v 
         git remote add origin git@github.com:your-username/project-name.git
        git branch -M main
         git push -u origin main
        `,
        output:'Created repository abdullahaldys9003/project-name on GitHub https://github.com/abdullahaldys9003/project-name',
        language: "HTML"   // اسم اللغة
    },  
];


const jsData = [acodeData];
export default jsData;

//const mergedArray = [...acodeData, ...anotherArray];
