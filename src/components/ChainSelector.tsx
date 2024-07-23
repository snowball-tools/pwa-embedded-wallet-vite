import React, { useState, useCallback, useMemo } from "react";
import { SnowballChain } from "@snowballtools/js-sdk";
import { useSnowball } from "../hooks/useSnowball";

type ChainSelectorProps = {
  chains?: SnowballChain[];
  className?: string;
};

const DEFAULT_CHAINS: SnowballChain[] = [
  SnowballChain.sepolia,
  SnowballChain.ethereum,
];

export const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains = DEFAULT_CHAINS,
  className = "",
}) => {
  const snowball = useSnowball();
  const [currentChain, setCurrentChain] = useState<SnowballChain>(
    snowball.chain
  );

  const selectChain = useCallback(
    (chain: SnowballChain) => {
      snowball.switchChain(chain);
      setCurrentChain(chain);
    },
    [snowball]
  );

  const buttonClass = useCallback(
    (chain: SnowballChain) => `
    flex-1 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium
    transition-colors duration-200 ease-in-out
    ${
      chain.chainId === currentChain.chainId
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }
  `,
    [currentChain.chainId]
  );

  const memoizedButtons = useMemo(
    () =>
      chains.map((chain) => (
        <button
          key={chain.chainId}
          onClick={() => selectChain(chain)}
          className={buttonClass(chain)}
        >
          {chain.name}
        </button>
      )),
    [chains, selectChain, buttonClass]
  );

  return (
    <div className={`flex justify-center items-center gap-2 mb-4 ${className}`}>
      {memoizedButtons}
    </div>
  );
};

export default React.memo(ChainSelector);
