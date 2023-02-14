import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { isWeb3Enabled } = useMoralis();
    const chainId = parseInt(useMoralis().chainId);
    const [entranceFee, setEntranceFee] = useState("0");
    const [playerAmount, setPlayerAmount] = useState("0");
    const [recentWinner, setRecentWinner] = useState("None");
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const dispatch = useNotification();

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
    });

    async function updateUI() {
        setEntranceFee((await getEntranceFee()).toString());
        setPlayerAmount((await getNumberOfPlayers()).toString());
        setRecentWinner((await getRecentWinner()).toString());
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    };

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx notification",
            position: "topR",
        });
    };

    return (
        <div className="p-5">
            {raffleAddress ? (
                <>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>The current number of players is: {playerAmount}</div>
                    <div>The winner was: {recentWinner}</div>
                    <button
                        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    );
}
