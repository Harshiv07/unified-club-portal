import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import EventInfo from '../components/event/EventInfo';
import UserList from '../components/user/UserList';
import { fetchEventDetails, registerUser, getEventStatus } from '../services/eventServices';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useParams } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../components/auth/ProvideAuth';
import { fetchResource } from '../services/resourceServices';
import { DB_URL } from '../services/constants';
import RatingComponent from '../components/event/RatingComponent';
import Card from '@material-ui/core/Card';
import MessageComponent from '../components/MessageComponent';
import EventFeedbackList from '../components/event/EventFeedbackList';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  image: {
    width: '100%',
    height: '300px'
  },
  registerButton: {
    margin: 'auto',
  },
  memberSection: {
    width: '50%',
    margin: 'auto'
  }
}));


const EventData = props => {
  const contextValue = useContext(AuthContext);
  let { id } = useParams();
  const classes = useStyles();
  const history = useHistory();

  const [eventState, setEventState] = useState();
  const [loading, setLoading] = useState(true);
  const [imagePath, setImagePath] = useState();
  const [eventStatusState, setEventStatusState] = useState();
  const [ratingComponentState, setRatingComponentState] = useState(false);
  const [feedbackComponentState, setFeedbackComponentState] = useState(false);
  const [messagePopupState, setMessagePopupState] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = contextValue;

  useEffect(() => {
    getEventDetails();
  }, [id]);

  const registerUserToEvent = async () => {
    const response = await registerUser(user['_id'], eventState['_id']);
    if (response.status === 200) {
      setEventState(response.data.data);
      setMessage('Registered in Event');
      setMessagePopupState(true);
    }
    else if (response.status === 412) {
      console.log(response.data.message);
      setMessage(response.data.message);
      setMessagePopupState(true);
    }
    else if (response.status === 500) {
      console.log(response.data.errors);
      setMessage('Internal Server Error');
      setMessagePopupState(true);
    }
  }

  const getEventDetails = async () => {
    setLoading(true);
    const response = await fetchEventDetails(id);
    if (response.status === 200) {
      setEventState(response.data.data);
      setEventStatusState(getEventStatus(response.data.data.from, response.data.data.to));
      const { publicFiles } = response.data.data;
      if (publicFiles.length > 0) {
        const resourceResponse = await fetchResource(publicFiles[0]['_id']);
        if (resourceResponse.status === 200) {
          const { path } = resourceResponse.data.data;
          setImagePath(path);
        }
        else if (resourceResponse.status === 500) {
          console.log(resourceResponse.data.errors);
          setMessage('Could not fetch File');
          setMessagePopupState(true);
        }
      }
      setLoading(false);
    }
    else if (response.message) {
      setMessage(response.message);
      setMessagePopupState(true);
    }
    else {
      console.log(response.errors);
    }
  };

  const redirectToEventForm = () => {
    history.push(`/event/new/${eventState.clubId}/${eventState['_id']}`)
  }

  const toggleRatingComponentState = () => {
    setRatingComponentState(!ratingComponentState);
  }

  const toggleFeedbackComponentState = () => {
    setFeedbackComponentState(!feedbackComponentState);
  }

  return (
    <React.Fragment>
      {loading ? <CircularProgress /> : (

        <div >
          {messagePopupState && <MessageComponent open={messagePopupState} messageContent={message} setMessagePopupState={setMessagePopupState} />}
          {imagePath && (<><img className={classes.image} src={`${DB_URL}/${imagePath}`} alt="event" />
            <br></br>
            <br></br></>)}
          <Grid container justifyContent="center" spacing={5} alignItems="center">
            <Grid key="club-info" item xs={12} md={8}>
              <EventInfo event={eventState} />
            </Grid>
          </Grid>
          <br></br>
          <Grid container item className={classes.registerButton} >
            {(!eventState.participants.includes(user['_id']) && user.role === 'participant' && eventStatusState < 2) &&
              (<Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={registerUserToEvent}
                >
                  Register
                </Button>
              </Grid>)
            }
            {(user.role === 'admin' && eventStatusState === -1) && (<Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={redirectToEventForm}
              >
                Edit
              </Button>
            </Grid>)}
            {(user.role === 'participant' && eventStatusState === 2) && (<Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleRatingComponentState}
              >
                Rate Event
              </Button>
            </Grid>)}
            {(user.role === 'admin' && eventStatusState === 2) && (<Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleFeedbackComponentState}
              >
                View Feedbacks
              </Button>
            </Grid>)}
          </Grid>
          {ratingComponentState && (
            <>
              <br></br>
              <Card>
                <Grid item container>
                  <Grid item xs={12}>
                    <RatingComponent eventId={eventState['_id']} />
                  </Grid>
                </Grid>
              </Card>
            </>
          )}
          <br></br>
          <Grid container item className={classes.memberSection} justifyContent="center">
            <Grid item xs={12} >
              <UserList ids={eventState.participants} />
            </Grid>
          </Grid>

          {feedbackComponentState && (
            <>
              <br></br>
              <Card>
                <Grid item container>
                  <Grid item xs={12}>
                    <EventFeedbackList eventId={eventState['_id']} />
                  </Grid>
                </Grid>
              </Card>
            </>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default EventData;