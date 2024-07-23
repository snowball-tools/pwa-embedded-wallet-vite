import React, { useState } from "react";
import { useSnowball } from "../hooks/useSnowball";

type WalletDisplayProps = {};

const WalletDisplay: React.FC<WalletDisplayProps> = ({}) => {
  const snowball = useSnowball();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const address = snowball.auth.passkey.wallet?.account.address;
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="space-y-4 mb-4">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-center">
          ☃️ 🎉 Success!
        </h2>
        <p className="text-sm text-center mb-2">
          Here's your generated wallet, secured by your passkey:
        </p>
        <div className="bg-gray-50 rounded-lg p-2 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 pb-1 pr-4">
                  Address
                </th>
                <th className="text-left text-xs font-medium text-gray-500 pb-1">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-xs break-all pr-4 align-top">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {snowball.auth.passkey.wallet?.account.address}

                      {copied ? " ✅" : " 📋"}
                    </button>
                  </div>
                </td>
                <td className="text-xs align-top">
                  {snowball.auth.passkey.wallet?.account.type}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletDisplay;
