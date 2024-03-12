import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { SIGNUP_URL } from "../services/constants";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../components/auth/ProvideAuth";
import MessageComponent from "../components/MessageComponent";

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {"Copyright © "}
      {/* <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "black",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "black",
    "&:hover": { backgroundColor: "darkgreen" },
  },
}));

export default function SignIn() {
  const history = useHistory();
  const contextValue = useContext(AuthContext);
  const { setAuthState, setUser } = contextValue;
  const classes = useStyles();
  const [credentialState, setCredentialState] = useState({
    email: "",
    password: "",
  });
  const [messagePopupState, setMessagePopupState] = useState(false);
  const [message, setMessage] = useState("");

  const formChangeHandler = event => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setCredentialState({ ...credentialState, [fieldName]: fieldValue });
  };

  const formSubmitHandler = async event => {
    event.preventDefault();
    const apiParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentialState),
    };
    const response = await fetch(SIGNUP_URL, apiParams);
    if (!response.ok) {
      console.log("Response Status", response.status);
      console.log("Response Text", await response.text());
      setMessage("Unable to sign you up");
      setMessagePopupState(true);
    } else {
      const resp = await response.json();
      window.localStorage.setItem("token", resp.token);

      //Need to figure out a solution, not sure if its good idea to store the user in local storage
      window.localStorage.setItem("user", JSON.stringify(resp.user));
      setAuthState(true);
      setUser(resp.user);
      setTimeout(() => {
        history.push("/clubs");
      }, 500);
    }
  };

  return (
    <React.Fragment>
      {messagePopupState && (
        <MessageComponent
          open={messagePopupState}
          messageContent={message}
          setMessagePopupState={setMessagePopupState}
        />
      )}
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign Up
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='name'
              label='Name'
              name='name'
              autoComplete='name'
              autoFocus
              onChange={formChangeHandler}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={formChangeHandler}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={formChangeHandler}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={formSubmitHandler}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link to={"/signin"} variant='body2'>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
