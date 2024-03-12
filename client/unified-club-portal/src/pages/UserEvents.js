import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/auth/ProvideAuth";
import EventCard from "../components/event/EventCard";
import {
  fetchEventListByUser,
  fetchEventList,
} from "../services/eventServices";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { Button, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow:
      "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
  },
  root: {
    margin: "auto",
  },
  list: {
    justifyContent: "center",
  },
  inline: {
    display: "flex",
  },
  avatar: {
    backgroundColor: red[500],
  },
  questionFieldStyling: {
    margin: "0 0 20px 0",
    color: "#009688",
  },
}));

const UserEvents = props => {
  const contextValue = useContext(AuthContext);
  const { user } = contextValue;
  const classes = useStyles();
  const history = useHistory();
  const [registeredEvents, setRegisteredEvents] = useState(); //Array of user Objects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchEventListByUser(user._id);
      if (response.status === 200) {
        setRegisteredEvents(response.data.data);
        setLoading(false);
      } else if (response.status === 500) {
        console.log(response.data.errors[0]);
      }
    };
    getData();
  }, []);

  const redirectToEventData = id => {
    history.push(`/event/${id}`);
  };
  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Card className={classes.card}>
            <CardHeader title='Events' />
            {registeredEvents.length > 0 ? (
              <List className={classes.root}>
                {registeredEvents.map(event => {
                  return (
                    <ListItem
                      className={classes.list}
                      alignItems='flex-start'
                      key={event["_id"]}
                    >
                      <Button
                        onClick={() => {
                          redirectToEventData(event["_id"]);
                        }}
                      >
                        <EventCard event={event} />
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <div className={classes.questionFieldStyling}>
                <Typography component='h5' variant='h5' key='name'>
                  You have no registered events!
                </Typography>
              </div>
            )}
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserEvents;
