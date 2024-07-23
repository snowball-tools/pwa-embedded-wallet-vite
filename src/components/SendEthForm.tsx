import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { parseEther } from "ethers/lib/utils"; // Corrected import for parseEther
import { useSnowball } from "../hooks/useSnowball";

type SendEthFormProps = {};

type SendEthFormData = {
  to: string;
  amount: string;
};

const SendEthForm: React.FC<SendEthFormProps> = () => {
  const snowball = useSnowball();
  const wallet = snowball.auth.passkey.wallet;
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendEthFormData>({
    defaultValues: { amount: "0.001", to: "" },
  });

  const onSubmit = async (data: SendEthFormData) => {
    if (!wallet) return;
    if (!data.to.startsWith("0x")) {
      // Handle error
      return;
    }
    const hash = await wallet.sendTransaction({
      to: data.to as `0x${string}`,
      value: parseEther(data.amount).toBigInt(),
    });

    setTransactionHash(hash);
  };

  return (
    <>
      {transactionHash ? (
        <label className="font-mono text-xs break-all pr-4 align-top">
          <a
            href={
              wallet?.chain.blockExplorers?.default.url +
              "/tx/" +
              transactionHash
            }
          >
            {transactionHash}
          </a>{" "}
          <button
            className="font-mono text-xs break-all pr-4 align-top text-green-500"
            onClick={() => {
              setTransactionHash(null);
            }}
          >
            another?
          </button>
        </label>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <h2 className="text-lg font-semibold mb-2">Send ETH</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To
            </label>
            <input
              placeholder="0x1234"
              {...register("to", { required: "Address is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
            />
            {errors.to && (
              <p className="text-red-500 text-xs mt-1">{errors.to.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              placeholder="0.1"
              {...register("amount", { required: "Amount is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </form>
      )}
    </>
  );
};

export default SendEthForm;
