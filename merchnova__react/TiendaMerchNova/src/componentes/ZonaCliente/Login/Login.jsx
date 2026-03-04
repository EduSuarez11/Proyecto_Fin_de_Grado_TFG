import { useState } from "react"
import './Login.css'

function Login() {

    const [formLogin, setFormLogin] = useState({});

    function onChangeInput(e) {
        return setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        })
    }


    function handleSubmit(e) {
        e.preventDefault();
    }


    return (
        <>
        </>
    )
}

export default Login