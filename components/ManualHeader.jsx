import { useMoralis } from "react-moralis";

function ManualHeader() {
    const { enableWeb3 } = useMoralis();
    return <div>hi from header</div>;
}

export default ManualHeader;
