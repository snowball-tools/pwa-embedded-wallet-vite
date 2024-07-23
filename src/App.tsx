import PWABadge from "./PWABadge";
import { useSnowball } from "./hooks/useSnowball";
import ChainSelector from "./components/ChainSelector";
import WalletDisplay from "./components/WalletDisplay";
import SendEthForm from "./components/SendEthForm";
import AuthenticationFlow from "./components/AuthenticationFlow";

function App() {
  const snowball = useSnowball();
  const passkeyAuth = snowball.auth.passkey;
  const wallet = passkeyAuth.wallet;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-400 to-light-blue-500 p-4 sm:p-6">
          <PWABadge />
          {wallet && <ChainSelector />}
        </div>

        <div className="p-4 sm:p-8">
          <AuthenticationFlow />

          {wallet && (
            <>
              <WalletDisplay />
              <SendEthForm />
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    snowball.auth.passkey.logout();
                  }}
                  className="w-full p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
