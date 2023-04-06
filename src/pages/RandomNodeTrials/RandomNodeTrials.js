import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './RandomNodeTrials.css';

function RandomNodeTrials() {

    const [apiRoute, setApiRoute] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = () => {
        fetch(`http://localhost:3001/api/${apiRoute}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setResponse(JSON.stringify(data));
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    console.error('Server not found');
                } else if (err.response && err.response.status === 500) {
                    console.error('Internal server error');
                } else {
                    console.error('Something went wrong');
                }
            });
    };

    return (
        <div className="custom-container">
            <h3>Enter API Route:</h3>
            <div className="input-field">
                <Input
                    className="custom-input"
                    id="apiRouteInput"
                    type="text" v
                    alue={apiRoute}
                    onChange={(e) => setApiRoute(e.target.value)}
                    placeholder="API route to test"
                />
            </div>
            <Button className="custom-button" onClick={handleSubmit}>Submit</Button>
            <div className="custom-response">
                <p >Response:</p>
                <pre>{response}</pre>
            </div>
        </div>
    );
}

export default RandomNodeTrials;
