import { FormEvent, FunctionComponent, useState } from 'react';
import { Button, Grid, FormHelperText, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../hooks';
import { CHATBOT_NAME } from '../../constants';

interface iProps {}

const SignUp: FunctionComponent<iProps> = () => {
    const { updateUser } = useUser();
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | undefined>(undefined);

    const completeSignUp = async (e: FormEvent) => {
        e.preventDefault();
        if (!username || username.trim() == '') {
            setError("Please enter a username to continue.");

        } else if (username.length >= 20) {
            setError("Please enter a username that is less than 20 characters.");
        } else if (username.toUpperCase() === CHATBOT_NAME.toUpperCase()) {
            setError("Nice try, this is the username reserved for our chatbot. Please enter a different username.");
        } else {
            updateUser({
                id: uuidv4(),
                name: username,
            });
        }
    };

    return (
        <form onSubmit={completeSignUp}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="username"
                        type="text"
                        placeholder="Enter Your Display Name"
                        error={Boolean(error)}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth size="large" variant='contained' type='submit' color='primary' disabled={Boolean(error)}>
                        Enter the Forum!
                    </Button>
                    {error && (
                        <FormHelperText sx={{ paddingTop: 1, color: 'error.main' }}>
                            {error}
                        </FormHelperText>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

export { SignUp };