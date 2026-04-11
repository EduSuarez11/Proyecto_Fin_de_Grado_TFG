import { useLoaderData } from "react-router";
import useGlobalState from "../../../../global_state/globalState";

function Direcciones() {
    const { clientData, setClientData, logOut } = useGlobalState();
    const countries = useLoaderData();
    const [editProfile, setEditProfile] = useState(false);
    const [formProfile, setFormProfile] = useState({ email: clientData.cuenta.email });
    return (
        <div className="card p-4">
            
           
        </div>
    )
}

export default Direcciones;