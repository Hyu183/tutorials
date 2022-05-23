import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();

    const [register, _] = useRegisterMutation();

    const onRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await register({
            variables: { registerInput: { username, password } },
        });
        navigator('..');
    };

    return (
        <form style={{ marginTop: '1rem' }} onSubmit={onRegister}>
            <input
                type='text'
                value={username}
                placeholder='Username'
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                type='password'
                value={password}
                placeholder='Password'
                onChange={(event) => setPassword(event.target.value)}
            />
            <button type='submit'>Register</button>
        </form>
    );
};

export default Register;
