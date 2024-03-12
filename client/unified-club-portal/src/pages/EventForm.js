import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router-dom";
import {
  saveEvent,
  validateEventObject,
  fetchEventDetails,
} from "../services/eventServices";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { fetchResource } from "../services/resourceServices";
import { DB_URL } from "../services/constants";
import { CircularProgress } from "@material-ui/core";
import MessageComponent from "../components/MessageComponent";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
  },
  root: {
    minWidth: 275,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
  },
  input: {
    display: "none",
  },
  image: {
    width: "100%",
    height: "300px",
    margin: "auto",
    flexGrow: 1,
  },
}));

const EventForm = props => {
  const history = useHistory();
  const classes = useStyles();
  let { clubId, eventId } = useParams();

  const [eventState, setEventState] = useState({
    name: "",
    desc: "",
    capacity: 0,
    participants: [],
    to: null,
    from: null,
    eventPoster: null,
    venue: "",
    clubId,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [messagePopupState, setMessagePopupState] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getEventDetails = async id => {
      setLoading(true);
      const response = await fetchEventDetails(id);
      if (response.status === 200) {
        setEventState(response.data.data);
        const { publicFiles } = response.data.data;
        if (publicFiles.length > 0) {
          const resourceResponse = await fetchResource(publicFiles[0]["_id"]);
          if (resourceResponse.status === 200) {
            const { path } = resourceResponse.data.data;
            setImage(`${DB_URL}/${path}`);
          } else if (resourceResponse.status === 500) {
            console.log(resourceResponse.errors);
            setMessage("Failed to Load resource");
            setMessagePopupState(true);
          }
        }
        setLoading(false);
      } else if (response.status === 404) {
        setMessage("Entity Not Found");
        setMessagePopupState(true);
      } else if (response.status === 500) {
        console.log(response.errors);
        setMessage("Internal Server Error");
        setMessagePopupState(true);
      }
    };

    if (
      eventId !== "new" &&
      eventId !== null &&
      eventId !== undefined &&
      eventId !== ""
    ) {
      getEventDetails(eventId);
      setIsUpdate(true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const formChangeHandler = event => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setEventState({ ...eventState, [fieldName]: fieldValue });
  };

  const formChangeHandlerForImage = event => {
    setImage(URL.createObjectURL(event.target.files[0]));
    setEventState({ ...eventState, eventPoster: event.target.files[0] });
  };

  const formSubmitHandler = async event => {
    const errors = validateEventObject(eventState);
    if (errors.length === 0) {
      if (isUpdate) {
        setEventState({ ...eventState, _id: eventId });
      }
      const response = await saveEvent(eventState);
      console.log(response);
      if (response.status === 201) {
        setMessage(`Event ${isUpdate ? "Updation" : "Creation"}`);
        setMessagePopupState(true);
        // window.alert('Event Creation Successfull');
        redirectToClub();
      } else if (response.status === 404) {
        setMessage("Entity Not Found");
        setMessagePopupState(true);
      } else if (response.status === 500) {
        console.log(response.errors);
        setMessage("Internal Server Error");
        setMessagePopupState(true);
      }
    } else {
      console.log(errors[0]);
      setMessage(errors[0]);
      setMessagePopupState(true);
    }
  };
  const redirectToClub = () => {
    setTimeout(() => {
      history.push(`/club/${clubId}`);
    }, 500);
  };

  const clearImage = () => {
    setImage(null);
    setEventState({ ...eventState, eventPoster: null });
  };

  const { name, desc, from, to, capacity, venue } = eventState;
  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {messagePopupState && (
            <MessageComponent
              open={messagePopupState}
              messageContent={message}
              setMessagePopupState={setMessagePopupState}
            />
          )}
          {image && (
            <>
              <img className={classes.image} src={image} alt='event' />
            </>
          )}
          <div className={classes.layout}>
            <Card className={classes.root} variant='outlined'>
              <CardContent>
                <Typography
                  component='h1'
                  variant='h4'
                  align='center'
                  color='primary'
                >
                  {`${isUpdate ? "Update" : "New"} Event`}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      value={name}
                      id='name'
                      name='name'
                      label='Event Name'
                      fullWidth
                      autoComplete='given-name'
                      onChange={formChangeHandler}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      value={desc}
                      id='desc'
                      name='desc'
                      label='Description'
                      fullWidth
                      autoComplete='shipping address-line1'
                      onChange={formChangeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={capacity}
                      id='capacity'
                      name='capacity'
                      label='Capacity'
                      fullWidth
                      autoComplete='shipping address-line2'
                      onChange={formChangeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      value={venue}
                      id='venue'
                      name='venue'
                      label='Venue'
                      fullWidth
                      autoComplete='shipping address-line1'
                      onChange={formChangeHandler}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={isUpdate ? from.split(".")[0] : null}
                      id='date'
                      label='Start Date'
                      name='from'
                      type='datetime-local'
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={formChangeHandler}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={isUpdate ? to.split(".")[0] : null}
                      id='date'
                      label='End Date'
                      name='to'
                      type='datetime-local'
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={formChangeHandler}
                    />
                  </Grid>

                  {!isUpdate && (
                    <Grid item xs={12}>
                      <input
                        className={classes.input}
                        id='contained-button-file'
                        type='file'
                        accept='.png, .jpg, .jpeg'
                        name='eventPoster'
                        onChange={formChangeHandlerForImage}
                      />
                      <label htmlFor='contained-button-file'>
                        <Button
                          variant='contained'
                          color='primary'
                          component='span'
                        >
                          Upload Event Poster
                        </Button>
                      </label>
                    </Grid>
                  )}
                  {image && !isUpdate && (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <IconButton
                          aria-label='delete'
                          className={classes.margin}
                          onClick={clearImage}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              </CardContent>
              <CardActions>
                <Grid item xs={12} sm={6}>
                  <Button variant='contained' onClick={redirectToClub}>
                    Back to Club
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={formSubmitHandler}
                  >
                    {isUpdate ? "Update" : "Create"}
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default EventForm;
