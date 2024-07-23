import React from "react";
import { useForm } from "react-hook-form";
import { useSnowball } from "../hooks/useSnowball";

type NewUserFormData = {
  email: string;
};
type VerifyEmailFormData = {
  code: string;
};

type AuthenticationFlowProps = {};

const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({}) => {
  const snowball = useSnowball();
  const passkeyAuth = snowball.auth.passkey;

  const newUserForm = useForm<NewUserFormData>();
  const verifyForm = useForm<VerifyEmailFormData>();

  const submitEmail = async (data: NewUserFormData) => {
    newUserForm.clearErrors();
    const res = await passkeyAuth.sendOtp({ email: data.email });
    if (!res.ok) newUserForm.setError("email", { message: res.reason });
  };

  const submitOtp = async (data: VerifyEmailFormData) => {
    verifyForm.clearErrors();
    const res = await passkeyAuth.verifyOtp({ code: data.code });
    if (!res.ok) verifyForm.setError("code", { message: res.reason });
  };

  const createPasskey = async () => {
    const res = await passkeyAuth.createPasskey({
      name: process.env.NEXT_PUBLIC_PASSKEY_NAME_PREFIX || "demo",
    });
    if (!res.ok) alert(`Error: ${res.reason}`);
  };

  const login = async () => {
    const res = await passkeyAuth.login();
    if (!res.ok) alert(res?.reason);
  };

  if (passkeyAuth.state.name === "initializing") {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
      </div>
    );
  }

  if (passkeyAuth.state.name === "no-session") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Create your account:</h2>
        <form
          onSubmit={newUserForm.handleSubmit(submitEmail)}
          className="space-y-3"
        >
          <div>
            <input
              {...newUserForm.register("email")}
              placeholder="Email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
            />
          </div>
          {newUserForm.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {newUserForm.formState.errors.email.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create new user
          </button>
        </form>
        <div className="my-4 text-center text-sm">OR</div>
        <h2 className="text-xl font-semibold mb-2">
          Already have an account? Login!
        </h2>
        <button
          onClick={login}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Log back in
        </button>
      </div>
    );
  }

  if (passkeyAuth.state.name === "waiting-for-otp") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Create your account:</h2>
        <p className="mb-2 text-sm">
          One-Time Password sent to <b>{newUserForm.getValues("email")}</b>
        </p>
        <form
          onSubmit={verifyForm.handleSubmit(submitOtp)}
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter the code here:
            </label>
            <input
              {...verifyForm.register("code")}
              autoComplete="one-time-code"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
            />
          </div>
          <button
            type="submit"
            value="Verify"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </form>
      </div>
    );
  }

  if (passkeyAuth.state.name === "authenticated-no-passkey") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Create your account:</h2>
        <div>
          <p className="mb-2 text-sm">
            Email verified! Now create a passkey to create your wallet:
          </p>
          <button
            onClick={() => {
              createPasskey();
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create passkey
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthenticationFlow;
