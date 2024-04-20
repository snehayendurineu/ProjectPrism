// import React, { ChangeEvent, useEffect, useState } from "react";
// import FormAction from "./FormAction";
// import Input from "./Input";
// import { signupFields } from "../constants/FormFields";
// import * as authService from "../services/auth-service";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";

// type FieldType = {
//   id: string;
//   labelText: string;
//   labelFor: string;
//   name: string;
//   type: string;
//   isRequired: boolean;
//   placeholder: string;
// };

// type SignupState = {
//   email: string;
//   password: string;
//   "confirm-password": string;
//   firstName: string;
//   lastName: string;
//   role: string;
// };

// type ErrorState = {
//   [key in keyof SignupState]: string;
// };

// const initialSignupState: SignupState = {
//   email: "",
//   password: "",
//   "confirm-password": "",
//   firstName: "",
//   lastName: "",
//   role: ""
// };

// const Signup: React.FC = () => {
//   const { t } = useTranslation("common");
//   const navigate = useNavigate();
//   const [signupState, setSignupState] =
//     useState<SignupState>(initialSignupState);
//   const [errorState, setErrorState] = useState<ErrorState>({
//     email: "",
//     password: "",
//     "confirm-password": "",
//     firstName: "",
//     lastName: "",
//     role: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);

//   useEffect(() => {
//     // Initially, the button should be disabled
//     setIsButtonDisabled(true);
//   }, []);

//   const validateField = (fieldName: keyof SignupState, value: string) => {
//     if (fieldName === "password" || fieldName === "confirm-password") {
//       setErrorState((prevState) => ({
//         ...prevState,
//         [fieldName]:
//           value.length >= 6
//             ? ""
//             : "Password must be at least 6 characters long",
//       }));
//     } else {
//       setErrorState((prevState) => ({
//         ...prevState,
//         [fieldName]: value.trim() ? "" : "This field is required",
//       }));
//     }

//     // Check if all fields are filled and set the button state
//     const isAllFieldsFilled = Object.values(signupState).every(
//       (field) => field.trim() !== ""
//     );
//     console.log("isAllFieldsFilled", isAllFieldsFilled);
//     setIsButtonDisabled(!isAllFieldsFilled);
//   };

//   // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//   //   const fieldName = e.target.id as keyof SignupState;
//   //   const value = e.target.value;
//   //   setSignupState((prevState) => ({ ...prevState, [fieldName]: value }));
//   //   validateField(fieldName, value);
//   // };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
    
//     // Determine the key to update in the state based on the input type
//     const key = type === 'radio' ? name : e.target.id;
    
//     setSignupState((prevState) => ({ ...prevState, [key]: value }));
    
//     // Validate the field; if it's a radio button, the key will be 'role'
//     validateField(key as keyof SignupState, value);
//   };

//   const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
//     const fieldName = e.target.id as keyof SignupState;
//     const value = e.target.value;
//     validateField(fieldName, value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       // Show a toast notification if the form is not valid
//       alert("Please complete all fields.");
//       return; // Prevent form submission
//     }

//     if (signupState.password !== signupState["confirm-password"]) {
//       // Show an error message if passwords do not match
//       setErrorState((prevState) => ({
//         ...prevState,
//         "confirm-password": "Passwords do not match",
//       }));
//       return; // Prevent form submission
//     }

//     await createAccount();
//   };

//   const validateForm = () => {
//     let isValid = true;

//     Object.keys(signupState).forEach((fieldName) => {
//       const value = signupState[fieldName as keyof SignupState];
//       validateField(fieldName as keyof SignupState, value);
//       if (errorState[fieldName as keyof ErrorState]) {
//         isValid = false;
//       }
//     });

//     return isValid;
//   };

//   const createAccount = async () => {
//     try {
//       setLoading(true);
//       const response = await authService.signup(signupState);

//       if (response && typeof response === "object") {
//         const userResponse = response as { status?: string; message?: string };

//         if (userResponse.status === "userexists") {
//           setErrorState((prevState) => ({
//             ...prevState,
//             email: userResponse.message || "",
//           }));
//         } else if (userResponse.status === "success") {
//           toast.success("Signup successful", {
//             autoClose: 2000,
//             onClose: () => {
//               navigate("/login");
//             },
//           });
//         }
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Error during signup:", error);
//       setLoading(false);
//     }
//   };

//   const translate = (key: string) => t(key);

//   return (
//     <>
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div className="text-center">
//           {signupFields.map((field: FieldType) => (
//             <div key={field.id}>
//               <Input
//                 key={field.id}
//                 handleChange={handleChange}
//                 handleBlur={handleBlur}
//                 value={signupState[field.id as keyof SignupState]}
//                 labelText={translate(`signup.input.${field.id}.label`)}
//                 labelFor={field.labelFor}
//                 id={field.id}
//                 name={field.name}
//                 type={field.type}
//                 isRequired={field.isRequired}
//                 placeholder={translate(`signup.input.${field.id}.placeholder`)}
//               />
//               {errorState[field.id as keyof ErrorState] && (
//                 <span style={{ color: "red" }}>
//                   {errorState[field.id as keyof ErrorState]}
//                 </span>
//               )}
//             </div>
//           ))}
//           {/* Role Selection Section */}
//         {/* <div className="role-selection mt-4">
//           <p className="text-lg font-medium">{translate("signup.input.role.label")}</p>
//           {["Manager", "Developer", "QA"].map(role => (
//             <label key={role} className="inline-flex items-center mt-3">
//               <input
//                 type="radio"
//                 name="role"
//                 value={role}
//                 checked={signupState.role === role}
//                 onChange={handleChange}
//                 className="form-radio h-5 w-5 text-gray-600"
//               />
//               <span className="ml-2 text-gray-700">{role}</span>
//             </label>
//           ))}
//         </div> */}
        
//         <div className="mt-4">
//         <span className="text-gray-700 dark:text-gray-400">Role</span>
//         <div className="mt-2">
//           {["Manager", "Developer", "QA"].map((role) => (
//             <label key={role} className="inline-flex items-center mr-6">
//               <input
//                 type="radio"
//                 className="form-radio text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
//                 name="role"
//                 value={role}
//                 checked={signupState.role === role}
//                 onChange={handleChange}
//               />
//               <span className="ml-2 text-gray-700 dark:text-gray-300">{role}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//           <button
//   type="submit"
//   className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-white text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 uppercase ${
//     isButtonDisabled ? "bg-grey-500" : "bg-primary-700"
//   }`}
//   disabled={isButtonDisabled}
// >
//   {translate("signup.button.signup.label")}
// </button>
//         </div>
//       </form>
//       {loading && <div>Loading...</div>}
//     </>
//   );
// };

// export default Signup;


import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "./Input";
import { signupFields } from "../constants/FormFields";
import * as authService from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type FieldType = {
  id: string;
  labelText: string;
  labelFor: string;
  name: string;
  type: string;
  isRequired: boolean;
  placeholder: string;
};

type SignupState = {
  email: string;
  password: string;
  "confirm-password": string;
  firstName: string;
  lastName: string;
  role: string;
};

type ErrorState = {
  [key in keyof SignupState]: string;
};

const initialSignupState: SignupState = {
  email: "",
  password: "",
  "confirm-password": "",
  firstName: "",
  lastName: "",
  role: "",
};

const Signup: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState<SignupState>(initialSignupState);
  const [errorState, setErrorState] = useState<ErrorState>({
    email: "",
    password: "",
    "confirm-password": "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const isAllFieldsFilled = Object.values(signupState).every(
      (field) => field.trim() !== ""
    );
    const isAnyFieldError = Object.values(errorState).some(
      (error) => error !== ""
    );
    const isFormValid = isAllFieldsFilled && !isAnyFieldError && signupState.role;

    setIsButtonDisabled(!isFormValid);
  }, [signupState, errorState]);

  const validateField = (fieldName: keyof SignupState, value: string) => {
    setErrorState((prevState) => {
      const newState = { ...prevState };

      if (fieldName === "password" || fieldName === "confirm-password") {
        newState[fieldName] = value.length >= 6 ? "" : "Password must be at least 6 characters long";
      } else {
        newState[fieldName] = value.trim() ? "" : "This field is required";
      }

      return newState;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignupState((prevState) => ({ ...prevState, [name]: value }));

    validateField(name as keyof SignupState, value);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof SignupState;
    const value = e.target.value;
    validateField(fieldName, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all fields.");
      return;
    }

    if (signupState.password !== signupState["confirm-password"]) {
      setErrorState((prevState) => ({
        ...prevState,
        "confirm-password": "Passwords do not match",
      }));
      return;
    }

    await createAccount();
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(signupState).forEach((fieldName) => {
      const value = signupState[fieldName as keyof SignupState];
      validateField(fieldName as keyof SignupState, value);
      if (errorState[fieldName as keyof ErrorState]) {
        isValid = false;
      }
    });

    return isValid;
  };


  function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "An unexpected error occurred";
  }

  
  const createAccount = async () => {
    try {
      setLoading(true);
      const response = await authService.signup(signupState);

      if (response && typeof response === "object") {
        const userResponse = response as { status?: string; message?: string };

        if (userResponse.status === "userexists") {
          setErrorState((prevState) => ({
            ...prevState,
            email: userResponse.message || "",
          }));
        } else if (userResponse.status === "success") {
          toast.success("Signup successful", {
            autoClose: 2000,
            onClose: () => navigate("/login"),
          });
        }
      }
      setLoading(false);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(`Error during signup: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="text-center">
          {signupFields.map((field: FieldType) => (
            <div key={field.id}>
              <Input
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={signupState[field.id as keyof SignupState]}
                labelText={t(`signup.input.${field.id}.label`)}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={t(`signup.input.${field.id}.placeholder`)}
              />
              {errorState[field.id as keyof ErrorState] && (
                <p className="text-red-500 text-xs italic">
                  {errorState[field.id as keyof ErrorState]}
                </p>
              )}
            </div>
          ))}
          <div className="mt-4">
            <span className="text-gray-700 dark:text-gray-400">{t('signup.input.role.label')}</span>
            <div className="mt-2">
              {["Manager", "Developer", "QA"].map((role) => (
                <label key={role} className="inline-flex items-center mr-6">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
                    name="role"
                    value={role}
                    checked={signupState.role === role}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{role}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-white text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 uppercase ${
              isButtonDisabled ? "bg-gray-500" : "bg-primary-700 hover:bg-primary-600"
            }`}
            disabled={isButtonDisabled}
          >
            {t("signup.button.signup.label")}
          </button>
        </div>
      </form>
      {loading && <div className="text-center mt-4">Loading...</div>}
    </>
  );
};

export default Signup;
