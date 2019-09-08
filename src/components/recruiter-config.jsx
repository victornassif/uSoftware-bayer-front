import axios from "axios";
import React, { useState } from 'react';
import { Col } from "react-bootstrap";
import InputMask from 'react-input-mask';
import './../css/light-bootstrap-dashboard-react.css';
import getLocalStorage from './../uJob-local-storage';


const checkForm = (props) => {
    if (props.name === '')
        throw new Error('Nome é um campo obrigatório')
    else if (props.lastName === '')
        throw new Error('Sobrenome é um campo obrigatório')
    else if (props.email === '')
        throw new Error('Email é um campo obrigatório')
    else if (props.password === '')
        throw new Error('Senha é um campo obrigatório')

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(props.email).toLowerCase()))
        throw new Error('O e-mail fornecido não é válido')

    if(props.password !== props.passwordConfirmation)
    throw new Error('Senha e confirmação de senha devem ser exatamente iguais')
    }

const updateUser = async (props) => {
    try {
        //Verificando se o formulário está preenchido corretamente
        checkForm(props)
alert(JSON.stringify(props))
        //Chamada para o back-end
        await axios.put(`${process.env.REACT_APP_API_ADDRESS}/recruiter`, {
            recruiter_id: props.recruiter_id,
            name: props.name,
            lastName: props.lastName,
            email: props.email,
            password: props.password,
        }, {
            headers: { token: props.token }
        })

        alert('Informações atualizadas com sucesso!')
    } catch (error) {
        alert(error.message)
    }
}

const loadUser = (stateChanges, props) => {
    //Chamada para o back-end
    axios.get(`${process.env.REACT_APP_API_ADDRESS}/recruiter/` + props.recruiter_id,{
        headers: { token: props.token}
    }).then(response=>{
        const user = response.data.recruiter
        stateChanges.setName(user.name)
        stateChanges.setLastName(user.lastName)
        stateChanges.setEmail(user.email)
        stateChanges.setPassword(user.password)
    })
}

let isFirstTime = true

export default function CandidateConfig (props){
    const display = {}

    if(!props.display)
        Object.assign(display, {display: 'none'})


    const userLocalstg = getLocalStorage();

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [mobilePhone, setMobilePhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    if(isFirstTime) {
        loadUser({setName, setLastName, setMobilePhone, setEmail, setPassword}, userLocalstg)
        isFirstTime = false;
    }

    return(
        <div style={display}>
            <div className="justify-content-center">
                <Col md="auto">
                    <div className="box-dash width-signup">
                        <form className="form">
                            <h2>Informações</h2>
                            <label className="control-label">Nome</label>
                            <input type="text" value={name} className="form-control mb-2" id="name" placeholder="Nome" onChange={(e) => { setName(e.target.value)  }}/>

                            <label className="control-label">Sobrenome</label>
                            <input type="text" value={lastName} className="form-control mb-2" id="lastName" placeholder="Sobrenome" onChange={(e) => { setLastName(e.target.value) }}/>

                            <label className="control-label">E-mail</label>
                            <input type="email" value={email} className="form-control mb-2" id="email" placeholder="E-mail" onChange={(e) => { setEmail(e.target.value) }}/>

                            <label className="control-label">Senha</label>
                            <input type="password" value={password} className="form-control mb-2" id="password" placeholder="Senha" onChange={(e) => { setPassword(e.target.value) }}/>

                            <label className="control-label">Confirmação de senha</label>
                            <input type="password" value={passwordConfirmation} className="form-control mb-2" id="passwordConfirmation" placeholder="Confirmação" onChange={(e) => { setPasswordConfirmation(e.target.value) }}/>

                            <footer>
                                <button type="button" className="btn btn-blue btn-block" onClick={() => {
                                    updateUser({
                                        props: props,
                                        token: userLocalstg.token,
                                        recruiter_id: userLocalstg.recruiter_id,
                                        name: name,
                                        lastName: lastName,
                                        email: email,
                                        password: password,
                                        passwordConfirmation: passwordConfirmation
                                    })
                                }}>Atualizar</button>
                            </footer>
                        </form>
                    </div>
                </Col>
            </div>
        </div>
    )
}
